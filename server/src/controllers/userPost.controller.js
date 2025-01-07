import AppError from "../utils/appError.js"
import { UserPost } from "../models/UserPost.model.js"
import { User } from "../models/user.model.js"
import { PostCategory } from "../models/PostCategory.model.js"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const userPostCtrl = {
  // Add a new post
  async addPost(req, res, next) {
    try {
      const { title, content, category, location, product } = req.body
      const userId = req._id

      // Basic validatio
      if (!title || !content || !category) {
        return next(
          new AppError("Title, content, and category are required", 400)
        )
      }

      // Category-specific validation
      if (category === "locations" && !location) {
        return next(
          new AppError("Location is required for location posts", 400)
        )
      }
      if (category === "products reviews" && !product) {
        return next(
          new AppError("Product is required for product reviews", 400)
        )
      }

      const user = await User.findById(userId)
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // Handle image uploads
      let mainImageUrl = ""
      let additionalImages = []

      if (req.files?.mainImage) {
        const mainImageResult = await cloudinary.uploader.upload(
          req.files.mainImage[0].path,
          { folder: "user-posts/main-images" }
        )
        mainImageUrl = mainImageResult.secure_url
        fs.unlinkSync(req.files.mainImage[0].path)
      }

      if (req.files?.images) {
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "user-posts/additional-images",
          })
          additionalImages.push(result.secure_url)
          fs.unlinkSync(file.path)
        }
      }

      // Create post
      const newPost = new UserPost({
        title,
        content: Array.isArray(content) ? content : [content],
        category,
        ...(location && { location }),
        ...(product && { product }),
        mainImage: mainImageUrl,
        images: additionalImages,
        createdBy: {
          username: user.name,
          userId: user._id,
        },
      })

      const savedPost = await newPost.save()

      // Add post to user's posts array
      user.posts.push({ postId: savedPost._id })
      await user.save()

      res.status(201).json({
        message: "Post created successfully",
        post: savedPost,
      })
    } catch (error) {
      next(new AppError("Error creating post", 500, error))
    }
  },

  // Get user's own posts
  async getUserPosts(req, res, next) {
    try {
      const { page = 1, limit = 10, status = "active" } = req.query

      const query = {
        "createdBy.userId": req._id,
        status,
      }

      const posts = await UserPost.find(query)
        .populate("product", "title images price")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

      const total = await UserPost.countDocuments(query)

      res.status(200).json({
        posts,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      })
    } catch (error) {
      next(new AppError("Error fetching user posts", 500, error))
    }
  },

  // Get all public posts with filters
  async getAllPosts(req, res, next) {
    try {
      const { category, search, page = 1, limit = 10 } = req.query

      const query = { status: "active" }

      if (category) query.category = category
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ]
      }

      const posts = await UserPost.find(query)
        .populate("product", "title images price")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

      const total = await UserPost.countDocuments(query)

      res.status(200).json({
        posts,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      })
    } catch (error) {
      next(new AppError("Error fetching posts", 500, error))
    }
  },

  // Update post
  async updatePost(req, res, next) {
    try {
      const postId = req.params.id
      const { title, content, category, location, product } = req.body
      const userId = req._id
      const userRole = req.user?.role // Get user role if available

      const post = await UserPost.findById(postId)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      // Check authorization - allow both owner and admin
      if (post.createdBy.userId.toString() !== userId && userRole !== "admin") {
        return next(new AppError("Not authorized to update this post", 403))
      }

      // Handle image updates
      let updateData = {
        title,
        content: Array.isArray(content) ? content : [content],
        category,
        ...(location && { location }),
        ...(product && { product }),
      }

      if (req.files?.mainImage) {
        const result = await cloudinary.uploader.upload(
          req.files.mainImage[0].path,
          { folder: "user-posts/main-images" }
        )
        updateData.mainImage = result.secure_url
        fs.unlinkSync(req.files.mainImage[0].path)
      }

      if (req.files?.images) {
        const newImages = []
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "user-posts/additional-images",
          })
          newImages.push(result.secure_url)
          fs.unlinkSync(file.path)
        }
        updateData.images = newImages
      }

      // Add admin edit record if admin is making the change
      if (userRole === "admin") {
        updateData.$push = {
          adminEdits: {
            editedBy: req.user.name || "Admin",
            editedAt: new Date(),
            reason: req.body.editReason || "Administrative update",
          },
        }
      }

      const updatedPost = await UserPost.findByIdAndUpdate(postId, updateData, {
        new: true,
      })

      res.status(200).json({
        message: "Post updated successfully",
        post: updatedPost,
      })
    } catch (error) {
      console.error("Update error:", error)
      next(new AppError("Error updating post", 500, error))
    }
  },

  // Delete post
  async deletePost(req, res, next) {
    try {
      const postId = req.params.id
      const userId = req._id

      const post = await UserPost.findById(postId)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      // Check authorization - allow both owner and admin
      if (post.createdBy.userId.toString() !== userId && req.role !== "admin") {
        return next(new AppError("Not authorized to delete this post", 403))
      }

      await UserPost.findByIdAndDelete(postId)

      res.status(200).json({
        message: "Post deleted successfully",
      })
    } catch (error) {
      console.error("Delete error:", error)
      next(new AppError("Error deleting post", 500, error))
    }
  },

  // Get categories
  async getCategories(req, res, next) {
    try {
      const categories = await PostCategory.find()
      res.status(200).json(categories)
    } catch (error) {
      next(new AppError("Error fetching categories", 500, error))
    }
  },

  // Get post by ID
  async getPostById(req, res, next) {
    try {
      const { id } = req.params
      const post = await UserPost.findById(id).populate(
        "product",
        "title images price"
      )

      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      res.status(200).json(post)
    } catch (error) {
      next(new AppError("Error fetching post", 500, error))
    }
  },

  async adminEditPost(req, res, next) {
    try {
      const postId = req.params.id
      const { title, content, category, location, product, editReason } =
        req.body

      const post = await UserPost.findById(postId)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      let updateData = {
        title,
        content: Array.isArray(content) ? content : [content],
        category,
        ...(location && { location }),
        ...(product && { product }),
        $push: {
          adminEdits: {
            editedBy: "Admin",
            editedAt: new Date(),
            reason: editReason || "Administrative update",
          },
        },
      }

      if (req.files?.mainImage) {
        const result = await cloudinary.uploader.upload(
          req.files.mainImage[0].path,
          { folder: "user-posts/main-images" }
        )
        updateData.mainImage = result.secure_url
        fs.unlinkSync(req.files.mainImage[0].path)
      }

      if (req.files?.images) {
        const newImages = []
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "user-posts/additional-images",
          })
          newImages.push(result.secure_url)
          fs.unlinkSync(file.path)
        }
        updateData.images = newImages
      }

      const updatedPost = await UserPost.findByIdAndUpdate(postId, updateData, {
        new: true,
      })

      res.status(200).json({
        message: "Post updated successfully by admin",
        post: updatedPost,
      })
    } catch (error) {
      console.error("Admin update error:", error)
      next(new AppError("Error updating post", 500, error))
    }
  },

  async adminDeletePost(req, res, next) {
    try {
      const postId = req.params.id
      const { deleteReason } = req.body

      if (!deleteReason) {
        return next(
          new AppError("Delete reason is required for admin deletion", 400)
        )
      }

      const post = await UserPost.findById(postId)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      // Record the deletion in admin actions before deleting
      await UserPost.findByIdAndUpdate(postId, {
        $push: {
          adminEdits: {
            editedBy: "Admin",
            editedAt: new Date(),
            action: "delete",
            reason: deleteReason,
          },
        },
      })

      // Then delete the post
      await UserPost.findByIdAndDelete(postId)

      res.status(200).json({
        message: "Post deleted successfully by admin",
        deletedPostId: postId,
      })
    } catch (error) {
      console.error("Admin delete error:", error)
      next(new AppError("Error deleting post", 500, error))
    }
  },

  async ratePost(req, res, next) {
    try {
      const { id } = req.params
      const { rating } = req.body
      const userId = req._id

      const post = await UserPost.findById(id)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      // Find if user has already rated this post
      const existingRatingIndex = post.rating.userRatings.findIndex(
        (r) => r.userId.toString() === userId.toString()
      )

      if (existingRatingIndex !== -1) {
        // Update existing rating
        const oldRating = post.rating.userRatings[existingRatingIndex].rating
        post.rating.userRatings[existingRatingIndex].rating = rating

        // Recalculate average rating
        const totalRating =
          post.rating.rate * post.rating.count - oldRating + rating
        post.rating.rate = Number((totalRating / post.rating.count).toFixed(1))
      } else {
        // Add new rating
        post.rating.userRatings.push({
          userId,
          rating,
        })

        // Calculate new rating
        const newCount = post.rating.count + 1
        const newRate =
          (post.rating.rate * post.rating.count + rating) / newCount

        post.rating.count = newCount
        post.rating.rate = Number(newRate.toFixed(1))
      }

      await post.save()

      res.status(200).json({
        message: "Rating updated successfully",
        rating: {
          rate: post.rating.rate,
          count: post.rating.count,
        },
      })
    } catch (error) {
      next(new AppError("Error updating rating", 500, error))
    }
  },
}

export { userPostCtrl }
