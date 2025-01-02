import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { GET_ALL_POSTS_URL } from "../constants/endPoint"

export const UserPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    page: 1,
  })
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [filters])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: filters.page,
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
      })

      const { data } = await axios.get(`${GET_ALL_POSTS_URL}?${params}`)
      setPosts(data.posts)
      setPagination(data.pagination)
    } catch (err) {
      setError("Error fetching posts")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, page: 1 })) // Reset to first page on new search
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mycontainer">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-[#2e7d32]">
            Travel Community
          </h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="rounded-lg border border-gray-300 px-4 py-2"
            />
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                  page: 1,
                }))
              }
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              <option value="">All Categories</option>
              <option value="locations">Locations</option>
              <option value="products">Products</option>
              <option value="tips">Travel Tips</option>
            </select>
          </form>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/community/post/${post._id}`}
                  className="group overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video">
                    <img
                      src={post.mainImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                      {post.title}
                    </h2>
                    <p className="mb-4 line-clamp-2 text-gray-600">
                      {post.content[0]}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.createdBy.username}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: i + 1 }))
                    }
                    className={`rounded px-3 py-1 ${
                      pagination.currentPage === i + 1
                        ? "bg-[#2e7d32] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            {posts.length === 0 && (
              <div className="rounded-lg bg-white p-8 text-center shadow-md">
                <div className="mb-4 text-4xl">🔍</div>
                <h3 className="mb-2 text-lg font-medium text-gray-800">
                  No Posts Found
                </h3>
                <p className="text-gray-600">
                  {filters.search || filters.category
                    ? "Try adjusting your filters"
                    : "Be the first to share your experience!"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
