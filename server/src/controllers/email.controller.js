import nodemailer from "nodemailer"
import { google } from "googleapis"
import AppError from "../utils/appError.js"
import jwt from "jsonwebtoken"
import { secretKey } from "../secrets/env.js"

const OAuth2 = google.auth.OAuth2

// פונקציה ליצירת מעביר המיילים עם אימות OAuth2
const createTransporter = async () => {
  try {
    // יצירת לקוח OAuth2 עם פרטי ההזדהות של גוגל
    const oauth2Client = new OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    )

    // הגדרת טוקן הרענון לאימות
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    })

    // קבלת טוקן גישה חדש מגוגל
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log("**** Error getting access token: ", err)
          reject(err)
        }
        resolve(token)
      })
    })

    // יצירת טרנספורטר למשלוח מיילים עם אימות OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    })

    return transporter
  } catch (err) {
    // טיפול בשגיאות ביצירת הטרנספורטר
    console.error("Error creating transporter:", err)
    throw err
  }
}

const emailCtrl = {
  // שליחת אימייל אישור הזמנה
  async sendOrderConfirmation(req, res, next) {
    try {
      // חילוץ פרטי המייל מגוף הבקשה
      const { to, subject, html } = req.body

      // הגדרת אפשרויות המייל
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      }

      // יצירת טרנספורטר ושליחת המייל
      const transporter = await createTransporter()
      const info = await transporter.sendMail(mailOptions)
      console.log("Email sent: ", info.response)

      // שליחת תשובת הצלחה
      res.status(200).json({
        message: "Order confirmation email sent successfully",
      })
    } catch (error) {
      // טיפול בשגיאות במשלוח המייל
      console.error("Email error:", error)
      next(new AppError("Failed to send email", 500, error))
    }
  },

  // שליחת מייל אימות חשבון
  async sendVerificationEmail(req, res, next) {
    try {
      // קבלת פרטי המשתמש מהבקשה
      const { email, name } = req.body

      // יצירת טוקן אימות שתקף ל-24 שעות
      const verificationToken = jwt.sign({ email }, secretKey, {
        expiresIn: "24h",
      })

      // יצירת כתובת URL לאימות
      const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`

      // הגדרת תבנית המייל עם עיצוב
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `
          <h2>Hello ${name}!</h2>
          <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}" style="
            background-color: #2e7d32;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
          ">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      }

      // שליחת המייל באמצעות הטרנספורטר
      const transporter = await createTransporter()
      await transporter.sendMail(mailOptions)

      // שליחת תשובת הצלחה
      res.status(200).json({
        message: "Verification email sent successfully",
      })
    } catch (error) {
      // טיפול בשגיאות במשלוח המייל
      console.error("Email error:", error)
      next(new AppError("Failed to send verification email", 500, error))
    }
  },
}

export { emailCtrl }
