import mongoose from "mongoose"
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
  async addPost(req, res) {
    try {
      const { title, content, category } = req.body
      const userId = req.user.id

      if (!title || !content || !category) {
        return res
          .status(400)
          .json({ message: "Title, content, and category are required" })
      }

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const postData = {
        title,
        content: Array.isArray(content) ? content : [content],
        category: Array.isArray(category) ? category : [category],
        images: [],
        mainImage: "",
        createBy: {
          username: user.name,
          userId: user._id,
        },
      }

      // Handle mainImage as a file
      if (req.files?.mainImage) {
        const mainImageFile = req.files.mainImage[0]
        const uploadResult = await cloudinary.uploader.upload(
          mainImageFile.path,
          {
            folder: "user-posts/main-images",
          }
        )
        postData.mainImage = uploadResult.secure_url
        fs.unlinkSync(mainImageFile.path) // Delete file from server
      } else if (req.body.mainImage) {
        postData.mainImage = req.body.mainImage // Use mainImage as URL
      } else {
        return res.status(400).json({ message: "Main image is required" })
      }

      // Handle additional images
      if (req.files?.images) {
        for (const file of req.files.images) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "user-posts",
          })
          postData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path) // Delete file from server
        }
      }

      // Ensure categories exist in the PostCategory collection
      for (const cat of postData.category) {
        const existingCategory = await PostCategory.findOne({ category: cat })
        if (!existingCategory) {
          const newCategory = new PostCategory({ category: cat })
          await newCategory.save()
        }
      }

      const newPost = new UserPost(postData)
      const savedPost = await newPost.save()

      // Add the post to the user's posts array
      user.posts.push({ postId: savedPost._id })
      await user.save()

      res.status(201).json({
        message: "Post created successfully",
        post: savedPost,
      })
    } catch (error) {
      console.error("Error saving post:", error)
      res.status(500).json({ message: "Failed to create post", error })
    }
  },

  // Update an existing post
  async updatePost(req, res) {
    try {
      const postId = req.params.id
      const { title, content, category } = req.body

      const updateData = {
        ...(title && { title }),
        ...(content && {
          content: Array.isArray(content) ? content : [content],
        }),
        ...(category && {
          category: Array.isArray(category) ? category : [category],
        }),
      }

      // Handle mainImage as a file
      if (req.files?.mainImage) {
        const mainImageFile = req.files.mainImage[0]
        const uploadResult = await cloudinary.uploader.upload(
          mainImageFile.path,
          {
            folder: "user-posts/main-images",
          }
        )
        updateData.mainImage = uploadResult.secure_url
        fs.unlinkSync(mainImageFile.path) // Delete file from server
      } else if (req.body.mainImage) {
        updateData.mainImage = req.body.mainImage // Use mainImage as URL
      }

      // Handle additional images
      if (req.files?.images) {
        updateData.images = []
        for (const file of req.files.images) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "user-posts",
          })
          updateData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path) // Delete file from server
        }
      }

      // Ensure categories exist in the PostCategory collection
      if (updateData.category) {
        for (const cat of updateData.category) {
          const existingCategory = await PostCategory.findOne({ category: cat })
          if (!existingCategory) {
            const newCategory = new PostCategory({ category: cat })
            await newCategory.save()
          }
        }
      }

      const updatedPost = await UserPost.findByIdAndUpdate(postId, updateData, {
        new: true,
      })

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" })
      }

      res.status(200).json({
        message: "Post updated successfully",
        post: updatedPost,
      })
    } catch (error) {
      console.error("Error updating post:", error)
      res.status(500).json({ message: "Failed to update post", error })
    }
  },

  // Get all posts
  async getPosts(req, res) {
    const cat = new RegExp(req.query.cat || "")

    try {
      const posts = await UserPost.aggregate([{ $match: { category: cat } }])
      res.status(200).json(posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      res.status(500).json({ message: "Failed to fetch posts", error })
    }
  },

  // Delete a post
  async deletePost(req, res) {
    try {
      const postId = req.params.id
      const userId = req.user.id

      const post = await UserPost.findById(postId)
      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      if (post.createBy.userId !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this post" })
      }

      await UserPost.findByIdAndDelete(postId)

      // Remove post from user's posts array
      await User.findByIdAndUpdate(userId, {
        $pull: { posts: { postId } },
      })

      res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
      console.error("Error deleting post:", error)
      res.status(500).json({ message: "Failed to delete post", error })
    }
  },
}

export { userPostCtrl }
