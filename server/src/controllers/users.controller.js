import { User } from "../models/user.model.js"
import { secretKey } from "../secrets/env.js"
import AppError from "../utils/appError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { clearCookie } from "../utils/clearCookie.js"
import axios from "axios"

const userCtrl = {
  async signup(req, res, next) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({
        ...req.body,
        password: hashedPassword,
        isVerified: false,
      })

      // Send verification email
      try {
        await axios.post("http://localhost:3000/email/send-verification", {
          email: user.email,
          name: user.name,
        })
      } catch (emailError) {
        console.error("Error sending verification email:", emailError)
      }

      res.status(201).json({
        message: "Please check your email to verify your account",
        user: { ...user._doc, password: "*****" },
      })
    } catch (error) {
      next(new AppError("User already exists", 400, error))
    }
  },
  async login(req, res, next) {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError("Invalid credentials", 401))
      }

      // Check if user is verified
      if (!user.isVerified) {
        return next(
          new AppError("Please verify your email before logging in", 401)
        )
      }

      const accessToken = jwt.sign(
        { _id: user._id, role: user.role },
        secretKey,
        { expiresIn: "15m" }
      )
      const refreshToken = jwt.sign(
        { _id: user._id, role: user.role },
        secretKey,
        {
          expiresIn: "30d",
        }
      )
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
      next(new AppError("Error during login", 401, error))
    }
  },
  async getInfo(req, res, next) {
    try {
      const user = await User.findById(req._id)
      if (!user) {
        return next(new AppError("User not found", 404))
      }
      res.status(200).json({ ...user._doc, password: "*******" })
    } catch (error) {
      next(new AppError("Error fetching user info", 500, error))
    }
  },
  async logout(req, res, next) {
    try {
      clearCookie(res, "access_token")
      clearCookie(res, "refresh_token")

      await User.updateOne(
        { _id: req._id },
        { $unset: { "loggedUsers.refreshToken": "" } }
      )

      res.status(200).json({ message: "Cookies cleared successfully!" })
    } catch (error) {
      next(new AppError("Error during logout", 500, error))
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
    const { name, email, password, newPassword, phone } = req.body
    try {
      if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return next(new AppError("Invalid email format", 400))
      }
      const user = await User.findById(req._id)
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // If user wants to change password, verify old password
      if (newPassword) {
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return next(new AppError("Incorrect password", 400))
        }
        user.password = await bcrypt.hash(newPassword, 10)
      }

      // Update user details
      if (name) user.name = name
      if (email) user.email = email
      if (phone) user.phone = phone // Add phone update

      await user.save()

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

      // סינון הנתונים ושמירה בורמט אחיד
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
    const { cart, totalAmount, address } = req.body
    console.log(cart)
    try {
      if (!totalAmount || !address) {
        return next(new AppError("Total amount and address are required", 400))
      }

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
  async getOrders(req, res, next) {
    try {
      const user = await User.findById(req._id).populate({
        path: "orders.cart.productId",
        select: "title price category images",
        match: { _id: { $ne: null } },
      })

      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // Filter out null products and format the response
      const orders = user.orders.map((order) => ({
        _id: order._id,
        orderDate: order.orderDate,
        status: order.status,
        totalAmount: order.totalAmount,
        cart: order.cart
          .filter((item) => item.productId)
          .map((item) => ({
            productId: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            category: item.productId.category,
            images: item.productId.images,
            quantity: item.quantity,
            addedAt: item.addedAt,
          })),
      }))

      res.status(200).json(orders)
    } catch (error) {
      next(new AppError("Error fetching orders", 500, error))
    }
  },
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params
      const decoded = jwt.verify(token, secretKey)

      const user = await User.findOneAndUpdate(
        { email: decoded.email },
        { isVerified: true },
        { new: true }
      )

      if (!user) {
        return next(new AppError("Invalid verification link", 400))
      }

      res.status(200).json({
        message: "Email verified successfully",
      })
    } catch (error) {
      next(new AppError("Invalid or expired verification link", 400, error))
    }
  },
  async toggleFavorite(req, res, next) {
    const { productId } = req.body
    try {
      const user = await User.findById(req._id)
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      const favoriteIndex = user.favorites.findIndex(
        (fav) => fav.productId.toString() === productId
      )

      if (favoriteIndex === -1) {
        // Add to favorites
        user.favorites.push({ productId })
      } else {
        // Remove from favorites
        user.favorites.splice(favoriteIndex, 1)
      }

      await user.save()
      res.status(200).json({
        message:
          favoriteIndex === -1
            ? "Added to favorites"
            : "Removed from favorites",
        isFavorite: favoriteIndex === -1,
      })
    } catch (error) {
      next(new AppError("Error toggling favorite", 500, error))
    }
  },
  async getFavorites(req, res, next) {
    try {
      const user = await User.findById(req._id).populate({
        path: "favorites.productId",
        select: "title price category images description rating",
      })

      if (!user) {
        return next(new AppError("User not found", 404))
      }

      const favorites = user.favorites.map((fav) => ({
        ...fav.productId._doc,
        addedAt: fav.addedAt,
      }))

      res.status(200).json(favorites)
    } catch (error) {
      next(new AppError("Error fetching favorites", 500, error))
    }
  },
  async getAllOrders(req, res, next) {
    try {
      const users = await User.find({}, "orders name email").populate({
        path: "orders.cart.productId",
        select: "title price category",
      })

      const allOrders = users.reduce((acc, user) => {
        const userOrders = user.orders.map((order) => ({
          ...order.toObject(),
          userName: user.name,
          userEmail: user.email,
          userId: user._id,
        }))
        return [...acc, ...userOrders]
      }, [])

      // Sort orders by date, newest first
      allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))

      res.status(200).json(allOrders)
    } catch (error) {
      next(new AppError("Error fetching all orders", 500, error))
    }
  },
  async updateOrderStatus(req, res, next) {
    const { orderId, userId, status } = req.body
    try {
      const user = await User.findById(userId)
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // Find the order in the user's orders array
      const orderIndex = user.orders.findIndex(
        (order) => order._id.toString() === orderId
      )

      if (orderIndex === -1) {
        return next(new AppError("Order not found", 404))
      }

      // Update the order status
      user.orders[orderIndex].status = status
      await user.save()

      res.status(200).json({
        message: "Order status updated successfully",
        order: user.orders[orderIndex],
      })
    } catch (error) {
      next(new AppError("Error updating order status", 500, error))
    }
  },
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find({}, "-password -refreshTokens")
      res.status(200).json(users)
    } catch (error) {
      next(new AppError("Error fetching users", 500, error))
    }
  },
  async adminUpdateUser(req, res, next) {
    const { userId, updates, adminPassword } = req.body

    try {
      // Verify admin password
      const admin = await User.findById(req._id)
      if (!admin || !(await bcrypt.compare(adminPassword, admin.password))) {
        return next(new AppError("Invalid admin credentials", 401))
      }

      // Don't allow password updates through this route
      const { password, refreshTokens, ...allowedUpdates } = updates

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: allowedUpdates },
        { new: true, select: "-password -refreshTokens" }
      )

      if (!user) {
        return next(new AppError("User not found", 404))
      }

      res.status(200).json({
        message: "User updated successfully",
        user,
      })
    } catch (error) {
      next(new AppError("Error updating user", 500, error))
    }
  },
  async saveTrip(req, res, next) {
    try {
      const { name, locations, dates, weatherData } = req.body
      const userId = req._id

      const user = await User.findById(userId)
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      user.trips.push({
        name,
        locations,
        dates,
        weatherData,
      })

      await user.save()

      res.status(200).json({
        message: "Trip saved successfully",
        trip: user.trips[user.trips.length - 1],
      })
    } catch (error) {
      next(new AppError("Error saving trip", 500, error))
    }
  },
  async getTrips(req, res, next) {
    try {
      const user = await User.findById(req._id)
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      res.status(200).json(user.trips)
    } catch (error) {
      next(new AppError("Error fetching trips", 500, error))
    }
  },
  async deleteTrip(req, res, next) {
    try {
      const { tripId } = req.params
      const user = await User.findById(req._id)

      if (!user) {
        return next(new AppError("User not found", 404))
      }

      user.trips = user.trips.filter((trip) => trip._id.toString() !== tripId)
      await user.save()

      res.status(200).json({ message: "Trip deleted successfully" })
    } catch (error) {
      next(new AppError("Error deleting trip", 500, error))
    }
  },
  async updateTrip(req, res, next) {
    try {
      const { tripId } = req.params
      const { name, locations, dates, weatherData } = req.body
      const userId = req._id

      const user = await User.findById(userId)
      if (!user) {
        return next(new AppError("User not found", 404))
      }

      const tripIndex = user.trips.findIndex(
        (trip) => trip._id.toString() === tripId
      )
      if (tripIndex === -1) {
        return next(new AppError("Trip not found", 404))
      }

      user.trips[tripIndex] = {
        ...user.trips[tripIndex],
        name,
        locations,
        dates,
        weatherData,
        _id: user.trips[tripIndex]._id, // Preserve the original ID
      }

      await user.save()

      res.status(200).json({
        message: "Trip updated successfully",
        trip: user.trips[tripIndex],
      })
    } catch (error) {
      next(new AppError("Error updating trip", 500, error))
    }
  },
}

export default userCtrl
