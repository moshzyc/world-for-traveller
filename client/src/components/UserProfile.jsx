import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContextpProvider"
import css from "../css/userForm.module.css"
import axios from "axios"
import { LOGOUT_URL, USER_URL } from "../constants/endPoint"
import { PrvOrder } from "./PrvOrder"
import { Card } from "./Card"

export const UserProfile = ({ setIsSignup, fullScreen, onNav }) => {
  const { user, setUser, role } = useContext(UserContext)
  const [seeOrders, setSeeOrders] = useState(false)
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState("profile")
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    user && getOrders()
  }, [user])

  useEffect(() => {
    user && getFavorites()
  }, [user])

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${USER_URL}get-orders`)
      setOrders(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getFavorites = async () => {
    try {
      const { data } = await axios.get(`${USER_URL}favorites`)
      setFavorites(data)
    } catch (error) {
      console.log(error)
    }
  }

  const onLogout = async () => {
    await axios.get(LOGOUT_URL)
    setUser(null)
    navigate("/")
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${USER_URL}update`, editForm)
      // Update the user context with new information
      const { data } = await axios.get(`${USER_URL}info`)
      setUser(data)
      setIsEditing(false)
      // Reset form
      setEditForm({
        name: "",
        email: "",
        password: "",
        newPassword: "",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      alert(error.response?.data?.message || "Error updating profile")
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${USER_URL}delete`, {
        data: { password: deletePassword },
      })
      setUser(null)
      navigate("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      alert(error.response?.data?.message || "Error deleting account")
    }
  }

  const renderProfileContent = () => (
    <div className="rounded-lg bg-white p-6 shadow-md">
      {!isEditing ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Information
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-[#2e7d32] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b5e20]"
            >
              Edit Profile
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="mt-1 text-gray-800">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="mt-1 text-gray-800">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleEdit} className="space-y-4">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Edit Profile
          </h2>
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              placeholder="New name"
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              placeholder="New email"
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Current Password (required)
            </label>
            <input
              type="password"
              value={editForm.password}
              onChange={(e) =>
                setEditForm({ ...editForm, password: e.target.value })
              }
              placeholder="Current password"
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              New Password (optional)
            </label>
            <input
              type="password"
              value={editForm.newPassword}
              onChange={(e) =>
                setEditForm({ ...editForm, newPassword: e.target.value })
              }
              placeholder="New password"
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-[#2e7d32] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b5e20]"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )

  const renderDeleteModal = () =>
    showDeleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Delete Account
          </h3>
          <p className="mb-4 text-gray-600">
            This action cannot be undone. Please enter your password to confirm.
          </p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter your password"
            className="mb-4 w-full rounded-lg border p-2"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDeleteConfirm(false)
                setDeletePassword("")
              }}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    )

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
              <button
                onClick={() => setActiveTab("favorites")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "favorites"
                    ? "border-b-2 border-[#2e7d32] text-[#2e7d32]"
                    : "text-gray-500 hover:text-[#2e7d32]"
                }`}
              >
                Favorites
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "profile" ? (
              renderProfileContent()
            ) : activeTab === "orders" ? (
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
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favorites.length > 0 ? (
                  favorites.map((product) => (
                    <Card
                      key={product._id}
                      item={product}
                      onFavoriteUpdate={getFavorites}
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-lg bg-white p-8 text-center shadow-md">
                    <div className="mb-4 text-4xl">❤️</div>
                    <h3 className="mb-2 text-lg font-medium text-gray-800">
                      No Favorites Yet
                    </h3>
                    <p className="text-gray-600">
                      Start adding products to your favorites to see them here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {renderDeleteModal()}
    </div>
  )
}
