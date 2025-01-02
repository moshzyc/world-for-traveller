import React, { useState, useEffect } from "react"
import axios from "axios"
import { PRODUCTS_URL } from "../constants/endPoint"
import { adminStyles } from "../pages/Admin"

export const ProductSelector = ({ onProductSelect }) => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (filters.category) params.append("category", filters.category)
      if (filters.minPrice) params.append("minPrice", filters.minPrice)
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)

      const { data } = await axios.get(`${PRODUCTS_URL}?${params.toString()}`)
      setProducts(data)
    } catch (err) {
      setError("Error fetching products")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${PRODUCTS_URL}/categories`)
      setCategories(data.map((cat) => cat.category))
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    onProductSelect(product)
  }

  return (
    <div className="space-y-4">
      {/* Only show filters if no product is selected */}
      {!selectedProduct && (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <select
              className={adminStyles.select}
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              className={adminStyles.input}
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Max Price"
              className={adminStyles.input}
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            className={adminStyles.input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </>
      )}

      {/* Products List */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Show only selected product if one is selected, otherwise show all */}
          {selectedProduct ? (
            <div
              key={selectedProduct._id}
              className="relative cursor-pointer rounded-lg border border-green-500 bg-green-50 p-4 transition-all hover:shadow-md"
            >
              <button
                onClick={() => {
                  setSelectedProduct(null)
                  onProductSelect(null)
                }}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                className="mb-2 h-32 w-full rounded-lg object-cover"
              />
              <h3 className="font-medium">{selectedProduct.title}</h3>
              <p className="text-sm text-gray-600">${selectedProduct.price}</p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md"
                onClick={() => handleProductSelect(product)}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="mb-2 h-32 w-full rounded-lg object-cover"
                />
                <h3 className="font-medium">{product.title}</h3>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
            ))
          )}
        </div>
      )}

      {products.length === 0 && !loading && !selectedProduct && (
        <div className="text-center text-gray-500">No products found</div>
      )}
    </div>
  )
}
