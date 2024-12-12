import mongoose from "mongoose"
import { Product } from "../models/Product.model.js"
import { Category } from "../models/Category.model.js"
const productsCtrl = {
  //מוסיף מוצר
  async addProduct(req, res) {
    try {
      const productData = req.body

      // בדיקה אם הקטגוריה כבר קיימת
      let category = await Category.findOne({ category: productData.category })
      if (!category) {
        // אם הקטגוריה לא קיימת, ליצור חדשה ולשמור אותה
        const newCategory = new Category({ category: productData.category }) // שם השדה תואם לסכמה
        category = await newCategory.save()
      }

      // יצירת מוצר חדש ושמירתו
      const newProduct = new Product(productData)
      const savedProduct = await newProduct.save()

      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
        category: category, // מחזירים גם את הקטגוריה שנוצרה או הייתה קיימת
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
    try {
      const Products = await Product.find()
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
