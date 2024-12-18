import React, { useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContextpProvider"
import css from "../css/userForm.module.css"
import axios from "axios"
import { LOGOUT_URL } from "../constants/endPoint"

export const UserProfile = ({ setIsSignup }) => {
  const { user, setUser } = useContext(UserContext)
  return (
    <div className={css.form}>
      <p>name: {user.name}</p>
      <p>email: {user.email}</p>
      <button
        className={css.logoutBtn}
        onClick={async () => {
          await axios.get(LOGOUT_URL)
          setUser(null)
          setIsSignup(false)
          location.reload()
        }}
      >
        logout
      </button>
    </div>
  )
}
