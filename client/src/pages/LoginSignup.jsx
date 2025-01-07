import React, { useState } from "react"
import UserForm from "../components/UserForm"
import { useNavigate } from "react-router-dom"

export const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false)
  const navigate = useNavigate()

  const onLoginSuccess = () => {
    navigate("/")
  }

  return (
    <UserForm
      isSignup={isSignup}
      formChenge={setIsSignup}
      onLoginSuccess={onLoginSuccess}
    />
  )
}
