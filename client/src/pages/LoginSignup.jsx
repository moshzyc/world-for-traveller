import React, { useState } from 'react'
import UserForm from '../components/UserForm'

export const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false)
  return <UserForm isSignup={isSignup} formChenge={setIsSignup} />
}
