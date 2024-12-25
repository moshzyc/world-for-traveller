import mongoose from "mongoose"
import AppError from "../utils/appError.js"
import { Guide } from "../models/Guide.model.js"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const guidesCtrl = {
  async addGuide(req, res) {
    try {
      const { title, content } = req.body

      if (!title || !content) {
        return res
          .status(400)
          .json({ message: "Title and content are required" })
      }

      const guideData = {
        title,
        content: Array.isArray(content) ? content : [content], // מוודא שה-content הוא מערך
        images: [],
      }

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "guides",
          })

          guideData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path) // מוחק את הקובץ מהשרת
        }
      }

      const newGuide = new Guide(guideData)
      const savedGuide = await newGuide.save()

      res.status(201).json({
        message: "Guide created successfully",
        guide: savedGuide,
      })
    } catch (error) {
      console.error("Error saving guide:", error)
      res.status(500).json({ message: "Failed to create guide", error })
    }
  },

  async updateGuide(req, res) {
    try {
      console.log("Body:", req.body)
      console.log("Files:", req.files)

      const guideId = req.params.id
      const { title, content } = req.body

      const updateData = {
        ...(title && { title }),
        ...(content && {
          content: Array.isArray(content) ? content : [content],
        }), // מוודא שה-content הוא מערך
      }

      // אם יש קבצים להעלאה, עדכן את התמונות
      if (req.files && req.files.length > 0) {
        updateData.images = []
        for (const file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "guides",
          })
          updateData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path) // מוחק את הקובץ מהשרת
        }
      }

      if (!updateData.images) {
        updateData.images = [] // אתחול של updateData.images אם הוא לא קיים
      }
      
      // הוספת תמונות שמגיעות כ-URL (אם יש)
      if (req.body.images && req.body.images.length > 0) {
        updateData.images = [...updateData.images, ...req.body.images]
      }

      const updatedGuide = await Guide.findByIdAndUpdate(guideId, updateData, {
        new: true,
      })

      if (!updatedGuide) {
        return res.status(404).json({ message: "Guide not found" })
      }

      res.status(200).json({
        message: "Guide updated successfully",
        guide: updatedGuide,
      })
    } catch (error) {
      console.error("Error updating guide:", error)
      res.status(500).json({ message: "Failed to update guide", error })
    }
  },

  async getGuides(req, res) {
    try {
      const guides = await Guide.find()
      res.status(200).json(guides)
    } catch (error) {
      console.error("Error fetching guides:", error)
      res.status(500).json({ message: "Failed to fetch guides", error })
    }
  },

  // Delete Guide
  async deleteGuide(req, res) {
    try {
      const guideId = req.params.id
      const deletedGuide = await Guide.findByIdAndDelete(guideId)

      if (!deletedGuide) {
        return res.status(404).json({ message: "Guide not found" })
      }

      res.status(200).json({
        message: "Guide deleted successfully",
        guide: deletedGuide,
      })
    } catch (error) {
      console.error("Error deleting guide:", error)
      res.status(500).json({ message: "Failed to delete guide", error })
    }
  },
}

export { guidesCtrl }
