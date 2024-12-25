import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContextpProvider"
import css from "../css/userForm.module.css"
import axios from "axios"
import { LOGOUT_URL, USER_URL } from "../constants/endPoint"
import { PrvOrder } from "./PrvOrder"

export const UserProfile = ({ setIsSignup, fullScreen, onNav }) => {
  const { user, setUser, role } = useContext(UserContext)
  const [seeOrders, setSeeOrders] = useState(false)
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    user && getOrders()
  }, [user])
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${USER_URL}get-orders`)
      setOrders(data)
    } catch (error) {
      console.log(error)
    }
  }

  const ordersGenerator = (arr) => {
    const ordersArr = arr.map((item) => {
      return <PrvOrder key={item.orderDate} {...item} />
    })
    return ordersArr
  }

  const onLogout = async () => {
    await axios.get(LOGOUT_URL)
  }
  return (
    <div className={`${fullScreen ? "mycontainer" : css.form}`}>
      {user && <p>name: {user.name}</p>}
      {user && <p>email: {user.email}</p>}
      {role == "admin" && (
        <p
          onClick={() => {
            navigate("/admin")
            onNav()
          }}
          className="w-[50px] cursor-pointer font-bold text-blue-600 hover:underline active:text-blue-500"
        >
          {role}
        </p>
      )}
      {fullScreen && (
        <div onClick={() => setSeeOrders((p) => !p)}>
          {seeOrders ? "-" : "+"}
          {seeOrders
            ? "(click to hide your orders)"
            : "(click to see your orders)"}
        </div>
      )}
      {fullScreen && (
        <div className={`${seeOrders ? " " : "hidden"}`}>
          {orders.length && ordersGenerator(orders)}
        </div>
      )}
      <div className="text-center">
        <button
          className={`${css.logoutBtn}`}
          onClick={() => {
            onLogout()
            setUser(null)
            setIsSignup(false)
          }}
        >
          logout
        </button>
      </div>
    </div>
  )
}
