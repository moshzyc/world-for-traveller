import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

// קומפוננטת אימות אימייל - מאמתת את כתובת האימייל של המשתמש באמצעות טוקן //
export const VerifyEmail = () => {
  // ניהול מצב סטטוס האימות //
  const [status, setStatus] = useState("Verifying...")
  // קבלת הטוקן מפרמטרי ה-URL //
  const { token } = useParams()
  // הפניה לניווט //
  const navigate = useNavigate()

  // ביצוע אימות בטעינה ראשונית //
  useEffect(() => {
    // פונקציית אימות האימייל //
    const verifyEmail = async () => {
      try {
        // שליחת בקשת אימות לשרת //
        console.log("Verifying token:", token)
        const response = await axios.get(
          `http://localhost:3000/user/verify/${token}`
        )
        console.log("Verification response:", response)

        // עדכון סטטוס והפניה לדף התחברות //
        setStatus("Email verified successfully! Redirecting...")
        setTimeout(() => navigate("/loginsingup"), 3000)
      } catch (error) {
        // טיפול בשגיאות //
        console.error("Verification error:", error)
        setStatus("Verification failed. Please try again or contact support.")
      }
    }

    verifyEmail()
  }, [token, navigate])

  // תצוגת סטטוס האימות //
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">{status}</h2>
      </div>
    </div>
  )
}
