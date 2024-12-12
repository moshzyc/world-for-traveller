import express from "express"
import AppError from "../utils/appError.js"
import userCtrl from "../controllers/users.controller.js"
import { auth } from "../middlewares/auth.js"
const router = express.Router()

router.post("/signup", userCtrl.signup)
router.post("/login", userCtrl.login)
router.get("/logout", userCtrl.logout)
router.get("/info", auth, userCtrl.getInfo)
router.delete("/delete", auth, userCtrl.deleteUser)
router.put("/update", auth, userCtrl.updateUser)

export default router
