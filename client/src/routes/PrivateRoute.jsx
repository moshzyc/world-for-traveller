import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContextpProvider"

export const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext)

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/loginsingup" replace />
  }

  // If user is logged in, render the protected component
  return children
}
