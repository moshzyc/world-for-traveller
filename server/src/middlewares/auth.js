import jwt from "jsonwebtoken"
import AppError from "../utils/appError.js"
import { secretKey } from "../secrets/env.js"
import { User } from "../models/user.model.js"
import generateToken from "../utils/generateToken.js"

const auth = async (req, res, next) => {
  try {
    console.log(req.cookies)

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
      const decoded = jwt.verify(accessToken, secretKey)
      req._id = decoded._id
      req.role = decoded.role
      return next()
    } catch {
      console.log("Access token expired, checking refresh token")
    }

    // if (!refreshToken) {
    //   return next(new AppError("Unauthorized: Refresh token missing", 401))
    // }

    const decodedRefresh = jwt.verify(refreshToken, secretKey)
    const user = await User.findOne({
      _id: decodedRefresh._id,
      "refreshTokens.token": refreshToken, // מחפש את ה-token ברשימה
    })
    if (!user) {
      return next(
        new AppError("Unauthorized: Invalid refresh token or expired", 401)
      )
    }
    const newAccessToken = generateToken(
      { _id: decodedRefresh._id, role: decodedRefresh.role },
      "15m"
    )
    const newRefreshToken = generateToken(
      { _id: decodedRefresh._id, role: decodedRefresh.role },
      "30d"
    )
    const MAX_REFRESH_TOKENS = 5 // כמות טוקנים מרבית למשתמש

    await User.updateOne(
      { _id: decodedRefresh._id },
      {
        $push: {
          refreshTokens: {
            $each: [{ token: newRefreshToken, createdAt: new Date() }],
            $slice: -MAX_REFRESH_TOKENS, // חותך ל-5 האחרונים
          },
        },
      }
    )

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
    req._id = decodedRefresh._id
    req.role = decodedRefresh.role
    next()
  } catch (error) {
    return next(new AppError("unauthorized", 401, error))
  }
}

const autAdmin = async (req, res, next) => {
  try {
    const cookie = req.cookies.access_token || ""
    const token = cookie.split(" ")[1]
    if (!token) return next(new AppError("unauthorized", 401))

    const decoded = jwt.verify(token, secretKey)
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only" })
    }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export { auth, autAdmin }
