import { User } from "../models/user.model.js"
import { secretKey } from "../secrets/env.js"
import AppError from "../utils/appError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { clearCookie } from "../utils/clearCookie.js"

const userCtrl = {
  async signup(req, res, next) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({ ...req.body, password: hashedPassword })
      res.status(201).json({ ...user._doc, password: "*****" })
    } catch (error) {
      next(new AppError("user alrady exists", 400, error))
    }
  },
  async login(req, res, next) {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      console.log(email);
      console.log(password);
      
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError("email or password wrong", 401))
      }

      const accessToken = jwt.sign(
        { _id: user._id, role: user.role },
        secretKey,
        { expiresIn: "15m" }
      )
      const refreshToken = jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: "30d",
      })
      user.refreshTokens.push({
        token: refreshToken,
        createdAt: new Date(),
      })
      await user.save()

      res.cookie("access_token", "Bearer " + accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      res.cookie("refresh_token", "Bearer " + refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      res.status(201).json({ ...user._doc, password: "****" })
    } catch (error) {
      next(new AppError(null, 401, error))
    }
  },
  async getInfo(req, res, next) {
    try {
      const user = await User.findById(req._id)
      res.status(200).json({ ...user._doc, password: "*******" })
    } catch (error) {
      next(new AppError(null, null, error))
    }
  },
  async logout(req, res) {
    try {
      clearCookie(res, "access_token")
      clearCookie(res, "refresh_token")

      await User.updateOne(
        { _id },
        { $unset: { "loggedUsers.refreshToken": "" } }
      )

      res.status(200).json({ message: "Cookies cleared successfully!" })
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error during logout", error: error.message })
    }
  },
  async deleteUser(req, res, next) {
    const { password } = req.body

    try {
      const user = await User.findById(req._id) // מציאת המשתמש לפי ה-ID שנמצא ב-token
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // השוואת הסיסמה שסופקה עם הסיסמה המאוחסנת במאגר
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return next(new AppError("Incorrect password", 400))
      }

      // אם הסיסמה נכונה, נמחק את המשתמש
      await User.findByIdAndDelete(req._id)

      res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
      next(new AppError("Error deleting user", 500, error))
    }
  },
  async updateUser(req, res, next) {
    const { name, email, password, newPassword } = req.body
    try {
      const user = await User.findById(req._id) // מציאת המשתמש לפי ה-ID שנמצא ב-token
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // אם המשתמש רוצה לשנות את הסיסמה, נוודא שהסיסמה הישנה נכונה
      if (newPassword) {
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return next(new AppError("Incorrect password", 400))
        }

        // אם הסיסמה נכונה, נשנה את הסיסמה
        user.password = await bcrypt.hash(newPassword, 10)
      }

      // עדכון פרטי המשתמש (שם, אימייל וכו')
      if (name) user.name = name
      if (email) user.email = email

      await user.save() // שמירת המשתמש עם הפרטים החדשים

      res.status(200).json({ message: "User updated successfully" })
    } catch (error) {
      next(new AppError("Error updating user", 500, error))
    }
  },
  async saveCart(req, res, next) {
    const { cart } = req.body // קבלת ה-cart מהבקשה
    try {
      if (!Array.isArray(cart)) {
        return next(new AppError("Cart must be an array", 400))
      }

      const user = await User.findById(req._id) // מציאת המשתמש לפי ה-ID שנמצא ב-token
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // סינון הנתונים ושמירה בפורמט אחיד
      const formattedCart = cart.map((item) => ({
        productId: item.productId || item._id, // אחידות לשדה productId
        title: item.title,
        category: item.category,
        price: item.price,
        quantity: item.quantity || 1, // ברירת מחדל לכמות
      }))

      user.cart = formattedCart // דריסת המערך הקיים
      await user.save() // שמירת השינויים במסד הנתונים

      res.status(200).json({ message: "Cart saved successfully" })
    } catch (error) {
      next(new AppError("Error saving cart", 500, error))
    }
  },
  async getCart(req, res, next) {
    try {
      const user = await User.findById(req._id).populate({
        path: "cart.productId", // אכלוס המידע מהקולקשן products
        select: "title price category", // שליפת השדות הרצויים בלבד
      })

      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // סינון השדות והחזרת מבנה אחיד
      const formattedCart = user.cart.map((item) => ({
        productId: item.productId._id, // שמירת ה-ID של המוצר
        title: item.productId.title,
        category: item.productId.category,
        price: item.productId.price,
        quantity: item.quantity,
      }))

      res.status(200).json(formattedCart)
    } catch (error) {
      next(new AppError("Error fetching cart", 500, error))
    }
  },
  async saveOrder(req, res, next) {
    const { cart, totalAmount, address } = req.body // קבלת העגלה, הסכום והכתובת מהבקשה
    try {
      // ודא שהעגלה לא ריקה
      if (!Array.isArray(cart) || cart.length === 0) {
        return next(new AppError("Cart cannot be empty", 400))
      }

      const user = await User.findById(req._id) // מציאת המשתמש לפי ה-ID שנמצא ב-token
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // יצירת אובייקט הזמנה
      const newOrder = {
        cart: cart.map((item) => ({
          productId: item.productId, // אחידות לשדה productId
          quantity: item.quantity || 1,
          addedAt: new Date(),
        })),
        orderDate: new Date(),
        status: "pending", // ברירת מחדל
        totalAmount: totalAmount,
      }

      // הוספת ההזמנה לשדה orders של המשתמש
      user.orders.push(newOrder)
      await user.save() // שמירה במסד הנתונים

      res
        .status(200)
        .json({ message: "Order saved successfully", order: newOrder })
    } catch (error) {
      next(new AppError("Error saving order", 500, error))
    }
  },
}

export default userCtrl
