import React, { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { UserContext } from "../contexts/UserContextpProvider"
import css from "../css/userForm.module.css"
import axios from "axios"
import {
  LOGOUT_URL,
  USER_URL,
  POSTS_URL,
  GET_USER_POSTS_URL,
} from "../constants/endPoint"
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
    phone: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [favorites, setFavorites] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [userPosts, setUserPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    user && getOrders()
  }, [user])

  useEffect(() => {
    user && getFavorites()
  }, [user])

  useEffect(() => {
    fetchUserPosts()
  }, [page])

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${USER_URL}get-orders`, {
        withCredentials: true,
      })
      console.log("Orders received:", data)
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
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
        phone: "",
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

  const filteredOrders = orders.filter((order) =>
    statusFilter === "all" ? true : order.status === statusFilter
  )

  const fetchUserPosts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${GET_USER_POSTS_URL}?page=${page}`, {
        withCredentials: true,
      })
      setUserPosts(data.posts)
      setPagination(data.pagination)
    } catch (err) {
      setError("Error fetching your posts")
      console.error(err)
    } finally {
      setLoading(false)
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
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="mt-1 text-gray-800">{user?.phone}</p>
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
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              placeholder="New phone number"
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
              <button
                onClick={() => setActiveTab("posts")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "posts"
                    ? "border-b-2 border-[#2e7d32] text-[#2e7d32]"
                    : "text-gray-500 hover:text-[#2e7d32]"
                }`}
              >
                My Posts
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "profile" ? (
              renderProfileContent()
            ) : activeTab === "orders" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Order History
                  </h2>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">
                      Filter by status:
                    </label>
                    <select
                      className="rounded-lg border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <PrvOrder key={order.orderDate + index} {...order} />
                  ))
                ) : (
                  <div className="rounded-lg bg-white p-8 text-center shadow-md">
                    <div className="mb-4 text-4xl">🛍️</div>
                    <h3 className="mb-2 text-lg font-medium text-gray-800">
                      No {statusFilter !== "all" ? statusFilter : ""} Orders
                      Found
                    </h3>
                    <p className="text-gray-600">
                      {statusFilter === "all"
                        ? "When you make your first purchase, it will appear here."
                        : `You don't have any ${statusFilter} orders yet.`}
                    </p>
                  </div>
                )}
              </div>
            ) : activeTab === "favorites" ? (
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
            ) : activeTab === "posts" ? (
              <div className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#2e7d32]">
                    My Posts
                  </h2>
                  <Link
                    to="/community/add"
                    className="rounded-lg bg-[#2e7d32] px-4 py-2 text-white transition-colors hover:bg-[#1b5e20]"
                  >
                    Create New Post
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : error ? (
                  <div className="text-center text-red-500">{error}</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {userPosts.map((post) => (
                        <Link
                          key={post._id}
                          to={`/community/post/${post._id}`}
                          className="group overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-lg"
                        >
                          <div className="relative aspect-video">
                            <img
                              src={post.mainImage}
                              alt={post.title}
                              className="h-full w-full bg-gray-100 object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="mb-2 text-lg font-semibold">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {pagination && pagination.pages > 1 && (
                      <div className="mt-4 flex justify-center gap-2">
                        {Array.from({ length: pagination.pages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`rounded px-3 py-1 ${
                              page === i + 1
                                ? "bg-[#2e7d32] text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}

                    {userPosts.length === 0 && (
                      <div className="rounded-lg bg-gray-50 p-8 text-center">
                        <div className="mb-4 text-4xl">✍️</div>
                        <h3 className="mb-2 text-lg font-medium text-gray-800">
                          No Posts Yet
                        </h3>
                        <p className="text-gray-600">
                          Share your travel experiences with the community!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>

      {renderDeleteModal()}
    </div>
  )
}
