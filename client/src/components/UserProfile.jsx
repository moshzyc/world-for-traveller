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
  const [activeTab, setActiveTab] = useState("profile")
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

  return (
    <div className={`${fullScreen ? "mycontainer py-8" : css.form}`}>
      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="rounded-lg bg-gradient-to-r from-[#2e7d32] to-[#1b5e20] p-6 text-white shadow-lg">
          <div className={`flex ${fullScreen ? "" : "flex-col gap-4"}`}>
            {fullScreen ? (
              // Fullscreen layout
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#2e7d32]">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-green-100">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin")
                        onNav && onNav()
                      }}
                      className="rounded-lg bg-white px-4 py-2 font-medium text-[#2e7d32] transition-colors hover:bg-[#e8f5e9]"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
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
            ) : (
              // Non-fullscreen layout
              <>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#2e7d32]">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-green-100">{user?.email}</p>
                    {role === "admin" && (
                      <p
                        onClick={() => {
                          navigate("/admin")
                          onNav && onNav()
                        }}
                        className="mt-2 cursor-pointer font-medium text-white hover:underline"
                      >
                        Admin Dashboard
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className={`${css.logoutBtn} w-full transition-colors hover:bg-red-700`}
                  onClick={() => {
                    onLogout()
                    setUser(null)
                    setIsSignup(false)
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {fullScreen && (
          <>
            {/* Navigation Tabs */}
            <div className="mb-6 mt-8 flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "border-b-2 border-[#2e7d32] text-[#2e7d32]"
                    : "text-gray-500 hover:text-[#2e7d32]"
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "orders"
                    ? "border-b-2 border-[#2e7d32] text-[#2e7d32]"
                    : "text-gray-500 hover:text-[#2e7d32]"
                }`}
              >
                Order History
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "profile" ? (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="mt-1 text-gray-800">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="mt-1 text-gray-800">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <PrvOrder key={order.orderDate + index} {...order} />
                  ))
                ) : (
                  <div className="rounded-lg bg-white p-8 text-center shadow-md">
                    <div className="mb-4 text-4xl">🛍️</div>
                    <h3 className="mb-2 text-lg font-medium text-gray-800">
                      No Orders Yet
                    </h3>
                    <p className="text-gray-600">
                      When you make your first purchase, it will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
