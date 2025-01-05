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
import { format } from "date-fns"
import { ShareTrip } from "./trip/ShareTrip"

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
  const [trips, setTrips] = useState([])
  const [tripsLoading, setTripsLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)

  useEffect(() => {
    user && getOrders()
  }, [user])

  useEffect(() => {
    user && getFavorites()
  }, [user])

  useEffect(() => {
    fetchUserPosts()
  }, [page])

  useEffect(() => {
    if (user && activeTab === "trips") {
      fetchTrips()
    }
  }, [user, activeTab])

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

  const fetchTrips = async () => {
    try {
      setTripsLoading(true)
      const { data } = await axios.get(`${USER_URL}trips`)
      console.log("Fetched trips:", data)
      setTrips(data)
    } catch (error) {
      console.error("Error fetching trips:", error)
      setError("Failed to load trips")
    } finally {
      setTripsLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await axios.delete(`${USER_URL}trips/${tripId}`)
        setTrips(trips.filter((trip) => trip._id !== tripId))
      } catch (error) {
        console.error("Error deleting trip:", error)
        alert("Failed to delete trip")
      }
    }
  }

  const handleShareClick = (trip) => {
    setSelectedTrip(trip)
    setShowShareModal(true)
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
              <button
                onClick={() => setActiveTab("trips")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "trips"
                    ? "border-b-2 border-[#2e7d32] text-[#2e7d32]"
                    : "text-gray-500 hover:text-[#2e7d32]"
                }`}
              >
                My Trips
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
            ) : activeTab === "trips" ? (
              <div className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#2e7d32]">
                    My Trips
                  </h2>
                  <Link
                    to="/trip-planner"
                    className="rounded-lg bg-[#2e7d32] px-4 py-2 text-white transition-colors hover:bg-[#1b5e20]"
                  >
                    Plan New Trip
                  </Link>
                </div>

                {tripsLoading ? (
                  <div className="text-center">Loading...</div>
                ) : trips.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {trips.map((trip, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {trip.name}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleShareClick(trip)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Share trip"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTrip(trip._id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete trip"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="mb-3 text-sm text-gray-500">
                            {format(new Date(trip.dates.start), "MMM d, yyyy")}{" "}
                            - {format(new Date(trip.dates.end), "MMM d, yyyy")}
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">
                              Locations:
                            </h4>
                            <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600">
                              {trip.locations.map((loc, i) => (
                                <li key={i}>{loc.name}</li>
                              ))}
                            </ul>
                          </div>
                          {trip.weatherData && trip.weatherData.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <h4 className="font-medium text-gray-700">
                                Weather Forecast:
                              </h4>
                              <div className="grid grid-cols-1 gap-2 text-sm">
                                {trip.weatherData.map((weather, i) => (
                                  <div
                                    key={i}
                                    className="rounded-md bg-gray-50 p-2"
                                  >
                                    <div className="font-medium">
                                      {weather.location}
                                    </div>
                                    <div className="text-gray-600">
                                      {weather.forecast && (
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="font-medium">
                                              Temperature:
                                            </span>{" "}
                                            {weather.forecast.temperature !==
                                            "N/A"
                                              ? `${weather.forecast.temperature}°C`
                                              : "Not available"}
                                          </div>
                                          <div>
                                            <span className="font-medium">
                                              Conditions:
                                            </span>{" "}
                                            {weather.forecast.conditions ||
                                              "Not available"}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 text-xs text-gray-400">
                            Created:{" "}
                            {format(new Date(trip.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <div className="mb-4 text-4xl">🗺️</div>
                    <h3 className="mb-2 text-lg font-medium text-gray-800">
                      No Trips Planned Yet
                    </h3>
                    <p className="text-gray-600">
                      Start planning your next adventure!
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>

      {renderDeleteModal()}

      {showShareModal && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Share Trip: {selectedTrip.name}
              </h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ShareTrip
              locations={selectedTrip.locations}
              dates={selectedTrip.dates}
              weatherData={selectedTrip.weatherData}
              onClose={() => setShowShareModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
