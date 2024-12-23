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
  async addProduct(req, res) {
    try {
      const productData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        subCategory: req.body.subCategory,
        images: [],
      }

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          })

          productData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path) // מוחק את הקובץ מהשרת
        }
      }
     const newProduct = new Product(productData)
     const savedProduct = await newProduct.save()
     console.log("Saved Product:", savedProduct)

      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      })
    } catch (error) {
      console.error("Error saving product:", error)
      res.status(500).json({ message: "Failed to create product", error })
    }
  },

  //לקבל את כל המוצרים
  async getProdacts(req, res) {
    const cat = new RegExp(req.query.cat || "")
    const sCat = new RegExp(req.query.sCat || "")
    const title = new RegExp(req.query.title || "", "i")
    try {
      const Products = await Product.aggregate([
        { $match: { category: cat, subCategory: sCat, title: title } },
      ])
      // const Products = await Product.find()
      res.status(200).json(Products)
    } catch (error) {
      console.log(error)
    }
  },
  async getCategories(req, res) {
    try {
      const categories = await Category.find()
      res.status(200).json(categories)
    } catch (error) {
      console.log(error)
    }
  },
  //קבלת מוצר יחיד
  async getProdact(req, res, next) {
    const id = req.params.id
    try {
      const product = await Product.findById(id)
      res.status(200).json(product)
    } catch (error) {
      next(new AppError("Error geting product", 500, error))
    }
  },
  //לעדכן מוצר לפי ID
  async updateProduct(req, res, next) {
    const id = req.params.id
    try {
      // קבלת נתוני המוצר
      const productData = req.body

      // אם יש קובץ בתמונה, נעלה אותו ל-Cloudinary
      if (req.file && req.file.path) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "products", // תיקיית העלאה
        })
        // נעדכן את התמונות עם ה-URL של Cloudinary
        if (!productData.images) {
          productData.images = []
        }
        productData.images.push(uploadResult.secure_url) // הוספת התמונה החדשה
      }

      // עדכון המוצר במסד הנתונים
      const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      })

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" })
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
  async deleteProduct(req, res) {
    const id = req.params.id
    try {
      const deleteProduct = await Product.findByIdAndDelete(id)
      if (!deleteProduct) {
        return res.status(404).json({ message: "Product not found" })
      }
      return res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
      next(new AppError("Error deleted product", 500, error))
    }
  },
}
export { productsCtrl }
