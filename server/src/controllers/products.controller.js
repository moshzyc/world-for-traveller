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
      // יצירת אובייקט עם נתוני המוצר מהבקשה
      const productData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        subCategory: req.body.subCategory,
        weather: req.body.weather,
        images: [], // מערך ריק לתמונות
      }

      // אם יש קבצי תמונה בבקשה
      if (req.files && req.files.length > 0) {
        // העלאת כל תמונה ל-cloudinary
        for (const file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "products", // שמירה בתיקיית מוצרים
          })

          // הוספת URL של התמונה למערך התמונות
          productData.images.push(uploadResult.secure_url)
          // מחיקת הקובץ הזמני מהשרת
          fs.unlinkSync(file.path)
        }
      }
      // יצירת מופע חדש של מוצר
      const newProduct = new Product(productData)
      // שמירת המוצר במסד הנתונים
      const savedProduct = await newProduct.save()

      // שליחת תשובה חיובית עם פרטי המוצר
      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      })
    } catch (error) {
      // טיפול בשגיאות
      next(new AppError("Failed to create product", 500, error))
    }
  },

  //לקבל את כל המוצרים
  async getProdacts(req, res, next) {
    // יצירת ביטויים רגולריים לחיפוש גמיש
    const cat = new RegExp(req.query.cat || "")
    const sCat = new RegExp(req.query.sCat || "")
    const title = new RegExp(req.query.title || "", "i")
    try {
      // חיפוש מוצרים לפי הפילטרים
      const Products = await Product.aggregate([
        { $match: { category: cat, subCategory: sCat, title: title } },
      ])
      // החזרת המוצרים שנמצאו
      res.status(200).json(Products)
    } catch (error) {
      next(new AppError("Error fetching products", 500, error))
    }
  },
  async getCategories(req, res, next) {
    try {
      // שליפת כל הקטגוריות ממסד הנתונים
      const categories = await Category.find()
      res.status(200).json(categories)
    } catch (error) {
      next(new AppError("Error fetching categories", 500, error))
    }
  },
  //קבלת מוצר יחיד
  async getProdact(req, res, next) {
    // קבלת מזהה המוצר מהפרמטרים
    const id = req.params.id
    try {
      // חיפוש המוצר לפי המזהה
      const product = await Product.findById(id)
      if (!product) {
        return next(new AppError("Product not found", 404))
      }
      // החזרת המוצר שנמצא
      res.status(200).json(product)
    } catch (error) {
      next(new AppError("Error getting product", 500, error))
    }
  },
  //לעדכן מוצר לפי ID
  async updateProduct(req, res, next) {
    const id = req.params.id
    try {
      // יצירת אובייקט עם השדות לעדכון
      const updateData = {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.price && { price: parseFloat(req.body.price) }),
        ...(req.body.weather && { weather: req.body.weather }),
      }

      // איתחול מערך התמונות
      updateData.images = []

      // טיפול בתמונות קיימות
      const existingImages = req.body.existingImages
      if (existingImages) {
        if (Array.isArray(existingImages)) {
          updateData.images = [...existingImages]
        } else if (typeof existingImages === "string") {
          updateData.images = [existingImages]
        }
      }

      // טיפול בהעלאת תמונות חדשות
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          })
          updateData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path)
        }
      }

      // שמירה על התמונות הקיימות אם לא סופקו תמונות חדשות
      if (updateData.images.length === 0) {
        const currentProduct = await Product.findById(id)
        if (currentProduct) {
          updateData.images = currentProduct.images
        }
      }

      // עדכון המוצר במסד הנתונים
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      })

      if (!updatedProduct) {
        return next(new AppError("Product not found", 404))
      }

      // החזרת המוצר המעודכן
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
    // קבלת מזהה המוצר למחיקה
    const id = req.params.id
    try {
      // מחיקת המוצר ממסד הנתונים
      const deleteProduct = await Product.findByIdAndDelete(id)
      if (!deleteProduct) {
        return next(new AppError("Product not found", 404))
      }
      // החזרת הודעת הצלחה
      return res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
      next(new AppError("Error deleting product", 500, error))
    }
  },
  async rateProduct(req, res, next) {
    try {
      // קבלת מזהה המוצר מהפרמטרים והדירוג מגוף הבקשה
      const { id } = req.params
      const { rating } = req.body
      const userId = req._id // מזהה המשתמש מגיע ממידלוור האימות

      // חיפוש המוצר במסד הנתונים
      const product = await Product.findById(id)
      if (!product) {
        return next(new AppError("Product not found", 404))
      }

      // בדיקה אם המשתמש כבר דירג את המוצר
      const existingRatingIndex = product.rating.userRatings.findIndex(
        (r) => r.userId.toString() === userId.toString()
      )

      if (existingRatingIndex !== -1) {
        // עדכון דירוג קיים
        const oldRating = product.rating.userRatings[existingRatingIndex].rating
        product.rating.userRatings[existingRatingIndex].rating = rating

        // חישוב מחדש של הדירוג הממוצע
        const totalRating =
          product.rating.rate * product.rating.count - oldRating + rating
        product.rating.rate = Number(
          (totalRating / product.rating.count).toFixed(1)
        )
      } else {
        // הוספת דירוג חדש
        product.rating.userRatings.push({
          userId,
          rating,
        })

        // חישוב הדירוג החדש
        const newCount = product.rating.count + 1
        const newRate =
          (product.rating.rate * product.rating.count + rating) / newCount

        product.rating.count = newCount
        product.rating.rate = Number(newRate.toFixed(1))
      }

      // שמירת השינויים במסד הנתונים
      await product.save()

      // שליחת תשובה עם הדירוג המעודכן
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
      // קבלת תנאי מזג האוויר מהבקשה
      const { weatherConditions } = req.query

      // המרת תנאי מזג האוויר למערך אם הוא לא כבר מערך
      const conditions = Array.isArray(weatherConditions)
        ? weatherConditions
        : [weatherConditions]

      // קבלת מוצרים המתאימים לתנאי מזג האוויר
      const products = await Product.aggregate([
        { $match: { weather: { $in: conditions } } },
        { $sample: { size: 10 } }, // קבלת מוצרים אקראיים
      ])

      // הגדרת מינימום ומקסימום מוצרים
      const minProducts = 5
      const maxProducts = 10

      // אם אין מספיק מוצרים, נוסיף מוצרים ניטרליים
      if (products.length < minProducts) {
        const additionalProducts = await Product.aggregate([
          { $match: { weather: "neutral" } },
          { $sample: { size: minProducts - products.length } },
        ])
        products.push(...additionalProducts)
      }

      // הגבלה למקסימום 10 מוצרים
      const finalProducts = products.slice(0, maxProducts)

      // שליחת המוצרים המומלצים
      res.status(200).json(finalProducts)
    } catch (error) {
      next(new AppError("Error fetching recommended products", 500, error))
    }
  },
}
export { productsCtrl }
