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
  // הוספת פוסט חדש
  async addPost(req, res, next) {
    try {
      // חילוץ נתונים מגוף הבקשה
      const { title, content, category, location, product } = req.body
      const userId = req._id

      // בדיקת תקינות בסיסית
      if (!title || !content || !category) {
        return next(
          new AppError("Title, content, and category are required", 400)
        )
      }

      // בדיקות תקינות לפי קטגוריה
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

      // מציאת המשתמש במסד הנתונים
      const user = await User.findById(userId)
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // טיפול בהעלאת תמונות
      let mainImageUrl = ""
      let additionalImages = []

      // העלאת תמונה ראשית ל-Cloudinary
      if (req.files?.mainImage) {
        const mainImageResult = await cloudinary.uploader.upload(
          req.files.mainImage[0].path,
          { folder: "user-posts/main-images" }
        )
        mainImageUrl = mainImageResult.secure_url
        fs.unlinkSync(req.files.mainImage[0].path)
      }

      // העלאת תמונות נוספות
      if (req.files?.images) {
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "user-posts/additional-images",
          })
          additionalImages.push(result.secure_url)
          fs.unlinkSync(file.path)
        }
      }

      // יצירת הפוסט החדש
      const newPost = new UserPost({
        title,
        content: content || "",
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

      // הוספת הפוסט למערך הפוסטים של המשתמש
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

  // קבלת הפוסטים של המשתמש
  async getUserPosts(req, res, next) {
    try {
      const userId = req._id
      const { page = 1, limit = 10, status = "active" } = req.query

      // יצירת אובייקט השאילתה
      const query = {
        "createdBy.userId": userId,
        status: status, // מתאים לפוסטים פעילים או מחוקים
      }

      // שליפת הפוסטים עם דפדוף
      const posts = await UserPost.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("product", "title images price")

      const total = await UserPost.countDocuments(query)

      res.status(200).json({
        posts,
        pagination: {
          currentPage: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
        },
      })
    } catch (error) {
      next(new AppError("Error fetching user posts", 500, error))
    }
  },

  // קבלת כל הפוסטים הציבוריים עם פילטרים
  async getAllPosts(req, res, next) {
    try {
      const { category, search, page = 1, limit = 10 } = req.query

      // בניית שאילתת החיפוש
      const query = { status: "active" }

      if (category) query.category = category
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ]
      }

      // שליפת הפוסטים המסוננים
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

  // עדכון פוסט
  async updatePost(req, res, next) {
    try {
      const postId = req.params.id
      const { title, content, category, location, product } = req.body
      const userId = req._id
      const userRole = req.user?.role

      // בדיקת קיום הפוסט
      const post = await UserPost.findById(postId)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      // בדיקת הרשאות - מאפשר למחבר ולמנהל
      if (post.createdBy.userId.toString() !== userId && userRole !== "admin") {
        return next(new AppError("Not authorized to update this post", 403))
      }

      // יצירת אובייקט העדכון
      let updateData = {
        title,
        content: content || "",
        category,
        ...(location && { location }),
        ...(product && { product }),
      }

      // טיפול בעדכון תמונות
      if (req.files?.mainImage) {
        const result = await cloudinary.uploader.upload(
          req.files.mainImage[0].path,
          { folder: "user-posts/main-images" }
        )
        updateData.mainImage = result.secure_url
        fs.unlinkSync(req.files.mainImage[0].path)
      }

      // טיפול בתמונות נוספות
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

      // הוספת רשומת עריכה אדמין אם העדכון נעשה על ידי מנהל
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

  // מחיקת פוסט
  async deletePost(req, res, next) {
    try {
      const postId = req.params.id
      const userId = req._id

      const post = await UserPost.findById(postId)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      // בדיקת הרשאות - מאפשר למחבר ולמנהל
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

  // קבלת קטגוריות
  async getCategories(req, res, next) {
    try {
      const categories = await PostCategory.find()
      res.status(200).json(categories)
    } catch (error) {
      next(new AppError("Error fetching categories", 500, error))
    }
  },

  // קבלת פוסט לפי מזהה
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

  // עריכת פוסט על ידי מנהל
  async adminEditPost(req, res, next) {
    try {
      const postId = req.params.id
      const { title, content, category, location, product } = req.body

      // יצירת אובייקט העדכון
      let updateData = {
        title,
        content: content || "",
        category,
        ...(location && { location }),
        ...(product && { product }),
      }

      // טיפול בהעלאת תמונות
      if (req.files?.mainImage) {
        const mainImageResult = await cloudinary.uploader.upload(
          req.files.mainImage[0].path,
          { folder: "user-posts/main-images" }
        )
        updateData.mainImage = mainImageResult.secure_url
        fs.unlinkSync(req.files.mainImage[0].path)
      }

      // הוספת רשומת עריכת מנהל
      updateData.$push = {
        adminEdits: {
          editedBy: "Admin",
          editedAt: new Date(),
          action: "edit",
          reason: "Administrative update",
        },
      }

      const updatedPost = await UserPost.findByIdAndUpdate(postId, updateData, {
        new: true,
      })

      if (!updatedPost) {
        return next(new AppError("Post not found", 404))
      }

      res.status(200).json({
        message: "Post updated successfully by admin",
        post: updatedPost,
      })
    } catch (error) {
      console.error("Admin update error:", error)
      next(new AppError("Error updating post", 500, error))
    }
  },

  // מחיקת פוסט על ידי מנהל
  async adminDeletePost(req, res, next) {
    try {
      const postId = req.params.id
      const { deleteReason } = req.body

      const post = await UserPost.findById(postId)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      // סימון הפוסט כמחוק והוספת רשומת מחיקה
      post.status = "deleted"
      post.adminEdits.push({
        editedBy: "Admin",
        action: "delete",
        reason: deleteReason || "Administrative action",
        editedAt: new Date(),
      })

      await post.save()

      res.status(200).json({
        message: "Post deleted successfully by admin",
        deletedPostId: postId,
      })
    } catch (error) {
      console.error("Admin delete error:", error)
      next(new AppError("Error deleting post", 500, error))
    }
  },

  // דירוג פוסט
  async ratePost(req, res, next) {
    try {
      const { id } = req.params
      const { rating } = req.body
      const userId = req._id

      const post = await UserPost.findById(id)
      if (!post) {
        return next(new AppError("Post not found", 404))
      }

      // בדיקה אם המשתמש כבר דירג את הפוסט
      const existingRatingIndex = post.rating.userRatings.findIndex(
        (r) => r.userId.toString() === userId.toString()
      )

      if (existingRatingIndex !== -1) {
        // עדכון דירוג קיים
        const oldRating = post.rating.userRatings[existingRatingIndex].rating
        post.rating.userRatings[existingRatingIndex].rating = rating

        // חישוב מחדש של הדירוג הממוצע
        const totalRating =
          post.rating.rate * post.rating.count - oldRating + rating
        post.rating.rate = Number((totalRating / post.rating.count).toFixed(1))
      } else {
        // הוספת דירוג חדש
        post.rating.userRatings.push({
          userId,
          rating,
        })

        // חישוב הדירוג החדש
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
