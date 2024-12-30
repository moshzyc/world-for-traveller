import express from "express"
import { emailCtrl } from "../controllers/email.controller.js"

const router = express.Router()

router.post("/send-order", emailCtrl.sendOrderConfirmation)
router.post("/send-verification", emailCtrl.sendVerificationEmail)

export default router
