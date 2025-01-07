import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { GET_POST_BY_ID_URL, POSTS_URL } from "../constants/endPoint"
import { UserContext } from "../contexts/UserContextpProvider"
import { adminStyles } from "../pages/Admin"
import { Rating } from "./Rating"

export const PostDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState("")

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`${GET_POST_BY_ID_URL}/${id}`)
      setPost(data)
    } catch (err) {
      setError("Error fetching post")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const endpoint =
        user.role === "admin"
          ? `${POSTS_URL}/admin/delete/${id}`
          : `${POSTS_URL}/delete/${id}`

      const config = {
        withCredentials: true,
        data: user.role === "admin" ? { deleteReason } : undefined,
      }

      await axios.delete(endpoint, config)
      navigate("/community")
    } catch (err) {
      console.error("Error deleting post:", err)
      setError("Error deleting post")
    }
  }

  if (loading) return <div className="py-8 text-center">Loading...</div>
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>
  if (!post) return <div className="py-8 text-center">Post not found</div>

  const isAuthorized =
    user && (user.id === post.createdBy.userId || user.role === "admin")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mycontainer max-w-4xl">
        {/* Navigation */}
        <Link
          to="/community"
          className="mb-4 inline-flex items-center text-[#2e7d32] hover:text-[#1b5e20]"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Community
        </Link>

        {/* Post Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>By {post.createdBy.username}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{post.category}</span>
            </div>
          </div>

          {user &&
            (user._id === post.createdBy.userId || user.role === "admin") && (
              <div className="flex gap-2">
                <Link
                  to={`/community/edit/${post._id}`}
                  className="rounded-lg bg-[#2e7d32] px-4 py-2 text-white hover:bg-[#1b5e20]"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
        </div>

        {/* Add Rating component after the header */}
        <div className="mb-6">
          <Rating
            productId={post._id}
            rating={post.rating || { rate: 0, count: 0, userRatings: [] }}
            onRatingUpdate={(newRating) => {
              setPost((prev) => ({
                ...prev,
                rating: newRating,
              }))
            }}
            isPost={true} // Add this prop to differentiate between posts and products
          />
        </div>

        {/* Main Image */}
        <div className="mb-8 bg-gray-100">
          <img
            src={post.mainImage}
            alt={post.title}
            className="h-[250px] w-full rounded-lg object-contain"
          />
        </div>

        {/* Location or Product Info */}
        {post.category === "locations" && post.location && (
          <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Location Details</h2>
            <p>{post.location.name}</p>
            {/* You can add a map here using the coordinates */}
          </div>
        )}

        {post.category === "products reviews" && post.product && (
          <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Product Review</h2>
            <div className="flex items-center gap-4">
              <img
                src={post.product.images[0]}
                alt={post.product.title}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium">{post.product.title}</h3>
                <Link
                  to={`/product/${post.product._id}`}
                  className="text-sm text-[#2e7d32] hover:text-[#1b5e20]"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none">
          {post.content.map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Additional Images */}
        {post.images && post.images.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">More Images</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${post.title} ${index + 1}`}
                  className="h-32 w-full rounded-lg bg-gray-100 object-contain"
                />
              ))}
            </div>
          </div>
        )}

        {/* Admin Edits History */}
        {post.adminEdits && post.adminEdits.length > 0 && (
          <div className="mt-8 rounded-lg bg-gray-100 p-4">
            <h2 className="mb-2 text-lg font-semibold">Edit History</h2>
            {post.adminEdits.map((edit, index) => (
              <div
                key={index}
                className="mb-2 border-b border-gray-200 pb-2 last:border-0 last:pb-0"
              >
                <p className="text-sm text-gray-600">
                  {edit.action === "edit" ? "Edited" : "Deleted"} by{" "}
                  {edit.editedBy} on{" "}
                  {new Date(edit.editedAt).toLocaleDateString()}
                </p>
                {edit.reason && (
                  <p className="text-sm text-gray-500">Reason: {edit.reason}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">Confirm Delete</h2>
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>

              {user.role === "admin" && (
                <div className="mb-4">
                  <label className={adminStyles.label}>Delete Reason</label>
                  <input
                    type="text"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className={adminStyles.input}
                    placeholder="Required for admin deletion"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={adminStyles.button}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className={adminStyles.deleteButton}
                  disabled={user.role === "admin" && !deleteReason}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
