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
  async addGuide(req, res, next) {
    try {
      const { title, content } = req.body

      if (!title || !content) {
        return next(new AppError("Title and content are required", 400))
      }

      const guideData = {
        title,
        content: Array.isArray(content) ? content : [content],
        images: [],
        mainImage: "",
      }

      if (req.files && req.files.length > 0) {
        const mainImageFile = req.files[0]
        const mainImageResult = await cloudinary.uploader.upload(
          mainImageFile.path,
          {
            folder: "guides/main",
          }
        )
        guideData.mainImage = mainImageResult.secure_url
        fs.unlinkSync(mainImageFile.path)

        for (let i = 1; i < req.files.length; i++) {
          const file = req.files[i]
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "guides/content",
          })
          guideData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path)
        }
      }

      const newGuide = new Guide(guideData)
      const savedGuide = await newGuide.save()

      res.status(201).json({
        message: "Guide created successfully",
        guide: savedGuide,
      })
    } catch (error) {
      next(new AppError("Failed to create guide", 500, error))
    }
  },

  async updateGuide(req, res, next) {
    try {
      const guideId = req.params.id
      const { title, content } = req.body

      const updateData = {
        ...(title && { title }),
        ...(content && {
          content: Array.isArray(content) ? content : [content],
        }),
      }

      if (req.files && req.files.length > 0) {
        if (req.body.updateMainImage === "true") {
          const mainImageFile = req.files[0]
          const mainImageResult = await cloudinary.uploader.upload(
            mainImageFile.path,
            {
              folder: "guides/main",
            }
          )
          updateData.mainImage = mainImageResult.secure_url
          fs.unlinkSync(mainImageFile.path)

          updateData.images = []
          for (let i = 1; i < req.files.length; i++) {
            const file = req.files[i]
            const uploadResult = await cloudinary.uploader.upload(file.path, {
              folder: "guides/content",
            })
            updateData.images.push(uploadResult.secure_url)
            fs.unlinkSync(file.path)
          }
        } else {
          updateData.images = []
          for (const file of req.files) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
              folder: "guides/content",
            })
            updateData.images.push(uploadResult.secure_url)
            fs.unlinkSync(file.path)
          }
        }
      }

      if (req.body.images && req.body.images.length > 0) {
        updateData.images = updateData.images || []
        updateData.images = [...updateData.images, ...req.body.images]
      }

      if (req.body.mainImage) {
        updateData.mainImage = req.body.mainImage
      }

      const updatedGuide = await Guide.findByIdAndUpdate(guideId, updateData, {
        new: true,
      })

      if (!updatedGuide) {
        return next(new AppError("Guide not found", 404))
      }

      res.status(200).json({
        message: "Guide updated successfully",
        guide: updatedGuide,
      })
    } catch (error) {
      next(new AppError("Failed to update guide", 500, error))
    }
  },

  async getGuides(req, res, next) {
    try {
      const guides = await Guide.find()
      res.status(200).json(guides)
    } catch (error) {
      next(new AppError("Failed to fetch guides", 500, error))
    }
  },

  async deleteGuide(req, res, next) {
    try {
      const guideId = req.params.id
      const deletedGuide = await Guide.findByIdAndDelete(guideId)

      if (!deletedGuide) {
        return next(new AppError("Guide not found", 404))
      }

      res.status(200).json({
        message: "Guide deleted successfully",
        guide: deletedGuide,
      })
    } catch (error) {
      next(new AppError("Failed to delete guide", 500, error))
    }
  },
}

export { guidesCtrl }
