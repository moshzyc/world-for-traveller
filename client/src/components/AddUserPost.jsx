import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { ADD_POST_URL, POST_CATEGORIES_URL } from "../constants/endPoint"
import { UserContext } from "../contexts/UserContextpProvider"
import { LocationSearchInput } from "./GooglePlacesAutocomplete"
import { ProductSelector } from "./ProductSelector"
import { adminStyles } from "../pages/Admin"
import { useNavigate } from "react-router-dom"

export const AddUserPost = () => {
  const { user } = useContext(UserContext)
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
    category: "",
    location: null,
    product: null,
    images: [],
    mainImage: null,
  })

  const [files, setFiles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(POST_CATEGORIES_URL)
      setCategories(response.data)
    } catch (error) {
      setError("Error fetching categories")
      console.error("Error fetching categories:", error)
    }
  }

  const handleLocationSelect = (place) => {
    setFormValue({
      ...formValue,
      location: {
        name: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    })
  }

  const handleProductSelect = (product) => {
    setFormValue({
      ...formValue,
      product: product._id,
    })
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const handleMainImageChange = (e) => {
    setFormValue({ ...formValue, mainImage: e.target.files[0] })
  }

  const handleContentChange = (e) => {
    setFormValue({ ...formValue, content: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formData.append("content", formValue.content)
      formData.append("category", formValue.category)

      // Debug log
      console.log("Sending data:", {
        title: formValue.title,
        content: formValue.content,
        category: formValue.category,
        location: formValue.location,
        product: formValue.product,
        files: files.length,
        mainImage: formValue.mainImage,
        userId: user._id,
      })

      if (formValue.location) {
        formData.append("location[name]", formValue.location.name)
        formData.append("location[lat]", formValue.location.lat)
        formData.append("location[lng]", formValue.location.lng)
      }

      if (formValue.product) {
        formData.append("product", formValue.product)
      }

      if (formValue.mainImage) {
        formData.append("mainImage", formValue.mainImage)
      }

      files.forEach((file) => {
        formData.append("images", file)
      })

      const { data } = await axios.post(ADD_POST_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })

      navigate(`/community`)
    } catch (err) {
      console.error("Error adding post:", err.response?.data || err)
      setError(err.response?.data?.message || "Error creating post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className={adminStyles.sectionTitle}>Create New Post</h2>
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title Input */}
        <div>
          <label className={adminStyles.label}>Title</label>
          <input
            type="text"
            className={adminStyles.input}
            value={formValue.title}
            onChange={(e) =>
              setFormValue({ ...formValue, title: e.target.value })
            }
            required
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className={adminStyles.label}>Category</label>
          <select
            className={adminStyles.select}
            value={formValue.category}
            onChange={(e) =>
              setFormValue({ ...formValue, category: e.target.value })
            }
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Location Input */}
        {formValue.category === "locations" && (
          <div>
            <label className={adminStyles.label}>Location</label>
            <LocationSearchInput
              onPlaceSelect={handleLocationSelect}
              className="mb-4"
            />
            {formValue.location && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {formValue.location.name}
              </div>
            )}
          </div>
        )}

        {/* Conditional Product Selection */}
        {formValue.category === "products reviews" && (
          <div>
            <label className={adminStyles.label}>Product</label>
            <ProductSelector
              onProductSelect={handleProductSelect}
              className={adminStyles.input}
            />
          </div>
        )}

        {/* Content Paragraphs */}
        <div>
          <label className={adminStyles.label}>Content</label>
          <textarea
            className={adminStyles.input}
            value={formValue.content}
            onChange={handleContentChange}
            rows="6"
            required
          />
        </div>

        {/* Image Uploads */}
        <div>
          <label className={adminStyles.label}>Main Image</label>
          <input
            type="file"
            onChange={handleMainImageChange}
            className={adminStyles.input}
            required
          />
        </div>

        <div>
          <label className={adminStyles.label}>Additional Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className={adminStyles.input}
          />
        </div>

        {/* Image Previews */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="h-32 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`${adminStyles.button} w-full`}
          disabled={loading}
        >
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  )
}
