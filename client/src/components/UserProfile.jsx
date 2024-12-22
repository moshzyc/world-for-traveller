import React, { useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContextpProvider"
import css from "../css/userForm.module.css"
import axios from "axios"
import { LOGOUT_URL } from "../constants/endPoint"
import { useNavigate } from "react-router-dom"

export const UserProfile = ({ setIsSignup }) => {
  const { user, setUser, role } = useContext(UserContext)
  const navigate = useNavigate()
  return (
    <div className={css.form}>
      <p>name: {user.name}</p>
      <p>email: {user.email}</p>
      {role =='admin'&&<p onClick={() => navigate("/admin")} className="w-[50px] cursor-pointer font-bold text-blue-600 hover:underline active:text-blue-500">{role}</p>}
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
