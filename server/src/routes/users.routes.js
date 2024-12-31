import express from "express"
import AppError from "../utils/appError.js"
import userCtrl from "../controllers/users.controller.js"
import { auth, autAdmin } from "../middlewares/auth.js"
const router = express.Router()

router.post("/signup", userCtrl.signup)
router.post("/login", userCtrl.login)
router.get("/logout", userCtrl.logout)
router.get("/info", auth, userCtrl.getInfo)
router.delete("/delete", auth, userCtrl.deleteUser)
router.put("/update", auth, userCtrl.updateUser)
router.put("/cart", auth, userCtrl.saveCart)
router.get("/cart", auth, userCtrl.getCart)
router.post("/save-order", auth, userCtrl.saveOrder)
router.get("/get-orders", auth, userCtrl.getOrders)
router.get("/verify/:token", userCtrl.verifyEmail)
router.post("/toggle-favorite", auth, userCtrl.toggleFavorite)
router.get("/favorites", auth, userCtrl.getFavorites)
router.get("/all-orders", autAdmin, userCtrl.getAllOrders)
router.put("/update-order-status", autAdmin, userCtrl.updateOrderStatus)

export default router
