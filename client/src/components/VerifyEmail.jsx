import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

export const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...")
  const { token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("Verifying token:", token)
        const response = await axios.get(
          `http://localhost:3000/user/verify/${token}`
        )
        console.log("Verification response:", response)
        setStatus("Email verified successfully! Redirecting...")
        setTimeout(() => navigate("/loginsingup"), 3000)
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("Verification failed. Please try again or contact support.")
      }
    }

    verifyEmail()
  }, [token, navigate])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">{status}</h2>
      </div>
    </div>
  )
}
