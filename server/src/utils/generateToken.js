import jwt from "jsonwebtoken"
import { secretKey } from "../secrets/env.js"

/**
 * Generate a JWT token with a payload and an expiration time
 * @param {Object} payload - הנתונים שייכנסו לטוקן (למשל _id, role)
 * @param {string} expiresIn - תוקף הטוקן (למשל "15m", "30d")
 * @returns {string} - הטוקן שנוצר
 */
const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn })
}

export default generateToken
