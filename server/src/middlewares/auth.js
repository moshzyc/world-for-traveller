import jwt from "jsonwebtoken"
import AppError from "../utils/appError.js"
import { secretKey } from "../secrets/env.js"
import { User } from "../models/user.model.js"
import generateToken from "../utils/generateToken.js"

// מידלוור לאימות משתמש רגיל
const auth = async (req, res, next) => {
  try {
    console.log(req.cookies)

    // חילוץ טוקנים מה-cookies
    const accessCookie = req.cookies.access_token || ""
    const refreshCookie = req.cookies.refresh_token || ""
    // הסרת תחילית Bearer אם קיימת
    const accessToken = accessCookie.startsWith("Bearer ")
      ? accessCookie.split(" ")[1]
      : accessCookie
    const refreshToken = refreshCookie.startsWith("Bearer ")
      ? refreshCookie.split(" ")[1]
      : refreshCookie

    // בדיקה שקיים לפחות טוקן אחד
    if (!accessToken && !refreshToken) {
      return next(new AppError("Unauthorized: No tokens provided", 401))
    }

    try {
      // ניסיון לאמת את טוקן הגישה
      const decoded = jwt.verify(accessToken, secretKey)
      req._id = decoded._id
      req.role = decoded.role
      return next()
    } catch {
      console.log("Access token expired, checking refresh token")
    }

    // אימות טוקן הרענון
    const decodedRefresh = jwt.verify(refreshToken, secretKey)
    // חיפוש המשתמש וטוקן הרענון שלו
    const user = await User.findOne({
      _id: decodedRefresh._id,
      "refreshTokens.token": refreshToken,
    })
    if (!user) {
      return next(
        new AppError("Unauthorized: Invalid refresh token or expired", 401)
      )
    }

    // יצירת טוקנים חדשים
    const newAccessToken = generateToken(
      { _id: decodedRefresh._id, role: decodedRefresh.role },
      "15m"
    )
    const newRefreshToken = generateToken(
      { _id: decodedRefresh._id, role: decodedRefresh.role },
      "30d"
    )
    const MAX_REFRESH_TOKENS = 5 // הגבלת כמות טוקני רענון למשתמש

    // עדכון רשימת טוקני הרענון של המשתמש
    await User.updateOne(
      { _id: decodedRefresh._id },
      {
        $push: {
          refreshTokens: {
            $each: [{ token: newRefreshToken, createdAt: new Date() }],
            $slice: -MAX_REFRESH_TOKENS, // שמירת 5 הטוקנים האחרונים בלבד
          },
        },
      }
    )

    // הגדרת עוגיות חדשות
    res.cookie("access_token", "Bearer " + newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    res.cookie("refresh_token", "Bearer " + newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })

    // הגדרת נתוני המשתמש בבקשה
    req._id = decodedRefresh._id
    req.role = decodedRefresh.role
    next()
  } catch (error) {
    return next(new AppError("unauthorized", 401, error))
  }
}

// מידלוור לאימות מנהל מערכת
const autAdmin = async (req, res, next) => {
  try {
    // חילוץ טוקנים מה-cookies
    const accessCookie = req.cookies.access_token || ""
    const refreshCookie = req.cookies.refresh_token || ""
    const accessToken = accessCookie.startsWith("Bearer ")
      ? accessCookie.split(" ")[1]
      : accessCookie
    const refreshToken = refreshCookie.startsWith("Bearer ")
      ? refreshCookie.split(" ")[1]
      : refreshCookie

    if (!accessToken && !refreshToken) {
      return next(new AppError("Unauthorized: No tokens provided", 401))
    }

    try {
      // בדיקת תקפות טוקן הגישה והרשאות מנהל
      const decoded = jwt.verify(accessToken, secretKey)
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only" })
      }
      req._id = decoded._id
      req.role = decoded.role
      return next()
    } catch {
      console.log("Access token expired, checking refresh token")
    }

    // אימות טוקן הרענון
    const decodedRefresh = jwt.verify(refreshToken, secretKey)
    const user = await User.findOne({
      _id: decodedRefresh._id,
      "refreshTokens.token": refreshToken,
    })
    if (!user) {
      return next(
        new AppError("Unauthorized: Invalid refresh token or expired", 401)
      )
    }

    // יצירת טוקנים חדשים
    const newAccessToken = generateToken(
      { _id: decodedRefresh._id, role: decodedRefresh.role },
      "15m"
    )
    const newRefreshToken = generateToken(
      { _id: decodedRefresh._id, role: decodedRefresh.role },
      "30d"
    )
    const MAX_REFRESH_TOKENS = 5

    // עדכון רשימת טוקני הרענון
    await User.updateOne(
      { _id: decodedRefresh._id },
      {
        $push: {
          refreshTokens: {
            $each: [{ token: newRefreshToken, createdAt: new Date() }],
            $slice: -MAX_REFRESH_TOKENS,
          },
        },
      }
    )

    // הגדרת עוגיות חדשות
    res.cookie("access_token", "Bearer " + newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    res.cookie("refresh_token", "Bearer " + newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })

    // בדיקת הרשאות מנהל
    if (decodedRefresh.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only" })
    }

    // הגדרת נתוני המשתמש בבקשה
    req._id = decodedRefresh._id
    req.role = decodedRefresh.role
    next()
  } catch (error) {
    return next(new AppError("Unauthorized", 401, error))
  }
}

export { auth, autAdmin }
