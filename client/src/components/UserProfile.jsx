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
    return arr.map((item) => <PrvOrder key={item.orderDate} {...item} />)
  }

  const onLogout = async () => {
    await axios.get(LOGOUT_URL)
  }

  return (
    <div className={`${fullScreen ? "mycontainer" : css.form}`}>
      <div className="rounded-lg bg-white p-6 shadow-md">
        {/* User Info Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-[#2e7d32]">
            Profile Information
          </h2>
          {user && (
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          )}
          {role === "admin" && (
            <p
              onClick={() => {
                navigate("/admin")
                onNav()
              }}
              className="mt-4 inline-block cursor-pointer font-medium text-[#2e7d32] transition-colors hover:text-[#1b5e20] hover:underline"
            >
              Admin Dashboard
            </p>
          )}
        </div>

        {/* Orders Section */}
        {fullScreen && (
          <div className="mb-6">
            <div
              onClick={() => setSeeOrders((p) => !p)}
              className="mb-4 flex cursor-pointer items-center gap-2 text-gray-700 transition-colors hover:text-[#2e7d32]"
            >
              <span className="text-xl font-medium">
                {seeOrders ? "−" : "+"}
              </span>
              <span className="font-medium">
                {seeOrders ? "Hide Orders" : "View Orders"}
              </span>
            </div>
            <div className={`${seeOrders ? "block" : "hidden"} space-y-4`}>
              {orders.length > 0 ? (
                ordersGenerator(orders)
              ) : (
                <p className="text-gray-600">No orders found.</p>
              )}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="text-center">
          <button
            className={`${css.logoutBtn} transition-colors hover:bg-red-700`}
            onClick={() => {
              onLogout()
              setUser(null)
              setIsSignup(false)
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
