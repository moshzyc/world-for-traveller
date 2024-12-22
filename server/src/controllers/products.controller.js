import mongoose from "mongoose"
import { Product } from "../models/Product.model.js"
import { Category } from "../models/Category.model.js"
import { v2 as cloudinary } from "cloudinary"
import AppError from "../utils/appError.js"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const productsCtrl = {
  //מוסיף מוצר
  async addProduct(req, res) {
    try {
      const productData = req.body

      // העלאת תמונה ל-Cloudinary
      if (req.file && req.file.path) {
        // אם התמונה נשלחה בקובץ
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "products", // תיקייה ב-Cloudinary
        })
        productData.image = uploadResult.secure_url // שמירת קישור התמונה
      }

      // בדיקה אם הקטגוריה כבר קיימת
      let category = await Category.findOne({ category: productData.category })

      if (!category) {
        // אם הקטגוריה לא קיימת, ליצור חדשה עם subCategory (אם קיים)
        const newCategory = new Category({
          category: productData.category,
          subCategory: productData.subCategory ? [productData.subCategory] : [],
        })
        category = await newCategory.save()
      } else if (productData.subCategory) {
        // אם הקטגוריה קיימת, לבדוק אם ה-subCategory קיים
        if (!category.subCategory.includes(productData.subCategory)) {
          category.subCategory.push(productData.subCategory) // הוספת תת-קטגוריה חדשה
          await category.save() // שמירת הקטגוריה עם התת-קטגוריה המעודכנת
        }
      }

      // יצירת מוצר חדש ושמירתו
      const newProduct = new Product(productData)
      const savedProduct = await newProduct.save()

      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
        category: category, // מחזירים גם את הקטגוריה שנוצרה או עודכנה
      })
    } catch (err) {
      console.error("Error saving product:", err)

      res.status(400).json({
        error: "Failed to create product",
        details: err.message,
      })
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

  async getProdact(req,res,next){
    const id = req.params.id
    try{
      const product = await Product.findById(id)
      res.status(200).json(product
      )
    }
    catch(error){
    next(new AppError("Error geting product", 500 ,error))
    }
  },

  //לעדכן מוצר לפי ID
  async updateProduct(req, res, next) {
    const id = req.params.id
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body)

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" })
      }

      return res.status(200).json({
        message: "Product updated successfully",
        Product: updatedProduct,
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
