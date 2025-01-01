import mongoose from "mongoose"
import { Product } from "../models/Product.model.js"
import { Category } from "../models/Category.model.js"
import AppError from "../utils/appError.js"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const productsCtrl = {
  //מוסיף מוצר
  async addProduct(req, res, next) {
    try {
      const productData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        subCategory: req.body.subCategory,
        weather: req.body.weather,
        images: [],
      }

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          })

          productData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path)
        }
      }
      const newProduct = new Product(productData)
      const savedProduct = await newProduct.save()

      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      })
    } catch (error) {
      next(new AppError("Failed to create product", 500, error))
    }
  },

  //לקבל את כל המוצרים
  async getProdacts(req, res, next) {
    const cat = new RegExp(req.query.cat || "")
    const sCat = new RegExp(req.query.sCat || "")
    const title = new RegExp(req.query.title || "", "i")
    try {
      const Products = await Product.aggregate([
        { $match: { category: cat, subCategory: sCat, title: title } },
      ])
      res.status(200).json(Products)
    } catch (error) {
      next(new AppError("Error fetching products", 500, error))
    }
  },
  async getCategories(req, res, next) {
    try {
      const categories = await Category.find()
      res.status(200).json(categories)
    } catch (error) {
      next(new AppError("Error fetching categories", 500, error))
    }
  },
  //קבלת מוצר יחיד
  async getProdact(req, res, next) {
    const id = req.params.id
    try {
      const product = await Product.findById(id)
      if (!product) {
        return next(new AppError("Product not found", 404))
      }
      res.status(200).json(product)
    } catch (error) {
      next(new AppError("Error getting product", 500, error))
    }
  },
  //לעדכן מוצר לפי ID
  async updateProduct(req, res, next) {
    const id = req.params.id
    try {
      const updateData = {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.price && { price: parseFloat(req.body.price) }),
        ...(req.body.weather && { weather: req.body.weather }),
      }

      // Initialize images array
      updateData.images = []

      // Handle existing images if any
      const existingImages = req.body.existingImages
      if (existingImages) {
        if (Array.isArray(existingImages)) {
          updateData.images = [...existingImages]
        } else if (typeof existingImages === "string") {
          updateData.images = [existingImages]
        }
      }

      // Handle file uploads if any
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          })
          updateData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path)
        }
      }

      // If no images were provided (neither existing nor new), keep the current images
      if (updateData.images.length === 0) {
        const currentProduct = await Product.findById(id)
        if (currentProduct) {
          updateData.images = currentProduct.images
        }
      }

      console.log("Update data:", updateData)

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      })

      if (!updatedProduct) {
        return next(new AppError("Product not found", 404))
      }

      return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      })
    } catch (error) {
      next(new AppError("Error updating product", 500, error))
    }
  },
  //למחוק מוצר לפי ID
  async deleteProduct(req, res, next) {
    const id = req.params.id
    try {
      const deleteProduct = await Product.findByIdAndDelete(id)
      if (!deleteProduct) {
        return next(new AppError("Product not found", 404))
      }
      return res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
      next(new AppError("Error deleting product", 500, error))
    }
  },
  async rateProduct(req, res, next) {
    try {
      const { id } = req.params
      const { rating } = req.body
      const userId = req._id // This comes from the auth middleware

      const product = await Product.findById(id)
      if (!product) {
        return next(new AppError("Product not found", 404))
      }

      // Find if user has already rated this product
      const existingRatingIndex = product.rating.userRatings.findIndex(
        (r) => r.userId.toString() === userId.toString()
      )

      if (existingRatingIndex !== -1) {
        // Update existing rating
        const oldRating = product.rating.userRatings[existingRatingIndex].rating
        product.rating.userRatings[existingRatingIndex].rating = rating

        // Recalculate average rating
        const totalRating =
          product.rating.rate * product.rating.count - oldRating + rating
        product.rating.rate = Number(
          (totalRating / product.rating.count).toFixed(1)
        )
      } else {
        // Add new rating
        product.rating.userRatings.push({
          userId,
          rating,
        })

        // Calculate new rating
        const newCount = product.rating.count + 1
        const newRate =
          (product.rating.rate * product.rating.count + rating) / newCount

        product.rating.count = newCount
        product.rating.rate = Number(newRate.toFixed(1))
      }

      await product.save()

      res.status(200).json({
        message: "Rating updated successfully",
        rating: {
          rate: product.rating.rate,
          count: product.rating.count,
        },
      })
    } catch (error) {
      next(new AppError("Error updating rating", 500, error))
    }
  },
  async getRecommendedProducts(req, res, next) {
    try {
      const { weatherConditions } = req.query

      // Convert weather conditions to an array if it's not already
      const conditions = Array.isArray(weatherConditions)
        ? weatherConditions
        : [weatherConditions]

      // Get products for each weather condition
      const products = await Product.aggregate([
        { $match: { weather: { $in: conditions } } },
        { $sample: { size: 10 } }, // Get random products
      ])

      // Ensure we have at least 5 products but no more than 10
      const minProducts = 5
      const maxProducts = 10

      // If we don't have enough products, we'll include some neutral weather products
      if (products.length < minProducts) {
        const additionalProducts = await Product.aggregate([
          { $match: { weather: "neutral" } },
          { $sample: { size: minProducts - products.length } },
        ])
        products.push(...additionalProducts)
      }

      // Limit to maximum 10 products
      const finalProducts = products.slice(0, maxProducts)

      res.status(200).json(finalProducts)
    } catch (error) {
      next(new AppError("Error fetching recommended products", 500, error))
    }
  },
}
export { productsCtrl }
