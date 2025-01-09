import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { POSTS_URL } from "../constants/endPoint"
import { adminStyles } from "../pages/Admin"

// קומפוננטת ניהול פוסטים - מאפשרת למנהל לצפות, לערוך ולמחוק פוסטים //
export const UserPostsManagement = ({ searchQuery }) => {
  // ניהול מצב הפוסטים ומידע נוסף //
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [deleteReason, setDeleteReason] = useState("")
  const [postToDelete, setPostToDelete] = useState(null)

  // טעינת פוסטים בעת שינוי עמוד או חיפוש //
  useEffect(() => {
    fetchPosts()
  }, [page, searchQuery])

  // פונקציה לטעינת הפוסטים מהשרת //
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${POSTS_URL}/all?page=${page}&search=${searchQuery}`,
        { withCredentials: true }
      )
      setPosts(data.posts)
      setPagination(data.pagination)
    } catch (err) {
      setError("Error fetching posts")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // פונקציה למחיקת פוסט //
  const handleDelete = async () => {
    try {
      await axios.delete(`${POSTS_URL}/delete/${postToDelete}`, {
        withCredentials: true,
        data: { deleteReason },
      })
      // איפוס הטופס ורענון הפוסטים //
      setPostToDelete(null)
      setDeleteReason("")
      fetchPosts()
    } catch (err) {
      console.error("Error deleting post:", err)
      setError("Error deleting post")
    }
  }

  // תצוגות טעינה ושגיאה //
  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>

  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* רשימת הפוסטים */}
        {posts.map((post) => (
          <div
            key={post._id}
            className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
          >
            {/* תצוגת פרטי הפוסט */}
            <div className="flex gap-4">
              <img
                src={post.mainImage}
                alt={post.title}
                className="h-24 w-24 rounded-lg bg-gray-100 object-contain"
              />
              <div>
                <h3 className="mb-1 font-semibold">{post.title}</h3>
                <p className="mb-1 text-sm text-gray-600">
                  By: {post.createdBy.username}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  Category: {post.category}
                </p>
                <p className="text-sm text-gray-600">
                  Posted: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* כפתורי פעולה */}
            <div className="flex gap-2">
              <Link
                to={`/community/edit/${post._id}`}
                className={adminStyles.button}
              >
                Edit
              </Link>
              <button
                onClick={() => setPostToDelete(post._id)}
                className={adminStyles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* הודעה כאשר אין פוסטים */}
        {posts.length === 0 && (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <p className="text-gray-600">No posts found</p>
          </div>
        )}

        {/* דפדוף */}
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
      </div>

      {/* מודאל אישור מחיקה */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Confirm Delete</h2>
            <div className="mb-4">
              <label className={adminStyles.label}>Delete Reason</label>
              <input
                type="text"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className={adminStyles.input}
                placeholder="Required for deletion"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setPostToDelete(null)
                  setDeleteReason("")
                }}
                className={adminStyles.button}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={adminStyles.deleteButton}
                disabled={!deleteReason}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
