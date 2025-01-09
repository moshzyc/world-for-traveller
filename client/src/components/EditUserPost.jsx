import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { POSTS_URL } from "../constants/endPoint"
import { UserContext } from "../contexts/UserContextpProvider"
import { LocationSearchInput } from "./GooglePlacesAutocomplete"
import { ProductSelector } from "./ProductSelector"
import { adminStyles } from "../pages/Admin"

export const EditUserPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // סטייט ראשוני עבור הטופס //
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
    category: "",
    location: null,
    product: null,
    images: [],
    mainImage: null,
  })

  // סטייט עבור תמונות //
  const [files, setFiles] = useState([])
  const [currentImages, setCurrentImages] = useState([])
  const [currentMainImage, setCurrentMainImage] = useState("")

  useEffect(() => {
    fetchPost()
  }, [id])

  // טעינת הפוסט בעת טעינת הדף //
  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`${POSTS_URL}/post/${id}`, {
        withCredentials: true,
      })
      setFormValue({
        title: data.title,
        content: data.content,
        category: data.category,
        location: data.location,
        product: data.product?._id,
      })
      setCurrentImages(data.images || [])
      setCurrentMainImage(data.mainImage)
    } catch (error) {
      console.error("Error fetching post:", error)
      setError("Error fetching post")
    } finally {
      setLoading(false)
    }
  }

  // טיפול בבחירת מיקום //
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

  // טיפול בהעלאת קבצים //
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

  const handleAddParagraph = () => {
    setFormValue({ ...formValue, content: [...formValue.content, ""] })
  }

  const handleRemoveParagraph = (index) => {
    const updatedContent = formValue.content.filter((_, i) => i !== index)
    setFormValue({ ...formValue, content: updatedContent })
  }

  // שליחת הטופס //
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formData.append("content", formValue.content)
      formData.append("category", formValue.category)

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

      // שליחה לנקודת קצה שונה בהתאם לתפקיד המשתמש //
      const endpoint =
        user.role === "admin"
          ? `${POSTS_URL}/admin/edit/${id}`
          : `${POSTS_URL}/update/${id}`

      const { data } = await axios.put(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      navigate(`/community/post/${id}`)
    } catch (error) {
      console.error("Error updating post:", error)
      setError("Error updating post")
    }
  }

  // תצוגת טעינה ושגיאה //
  if (loading) return <div className="py-8 text-center">Loading...</div>
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>

  return (
    // טיכל ראשי לטופס העריכה //
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mycontainer max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-[#2e7d32]">Edit Post</h1>

        {/* טופס העריכה */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* שדה כותרת */}
          <div>
            <label className={adminStyles.label}>Title</label>
            <input
              type="text"
              value={formValue.title}
              onChange={(e) =>
                setFormValue({ ...formValue, title: e.target.value })
              }
              className={adminStyles.input}
              required
            />
          </div>

          {/* בחירת קטגוריה */}
          <div>
            <label className={adminStyles.label}>Category</label>
            <select
              value={formValue.category}
              onChange={(e) =>
                setFormValue({ ...formValue, category: e.target.value })
              }
              className={adminStyles.select}
              required
            >
              <option value="">Select Category</option>
              <option value="locations">Locations</option>
              <option value="products reviews">Product Reviews</option>
              <option value="trip tips">Trip Tips</option>
            </select>
          </div>

          {/* שדה מיקום - מוצג רק כאשר נבחרה קטגוריית מיקומים */}
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

          {/* שדה מוצר - מוצג רק כאשר נבחרה קטגוריית ביקורות מוצרים */}
          {formValue.category === "products reviews" && (
            <div>
              <label className={adminStyles.label}>Product</label>
              <ProductSelector
                onProductSelect={handleProductSelect}
                className={adminStyles.input}
              />
            </div>
          )}

          {/* שדה תוכן */}
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

          {/* הצגת תמונה ראשית נוכחית */}
          {currentMainImage && (
            <div>
              <label className={adminStyles.label}>Current Main Image</label>
              <img
                src={currentMainImage}
                alt="Current main"
                className="mb-2 h-40 w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* העלאת תמונה ראשית חדשה */}
          <div>
            <label className={adminStyles.label}>New Main Image</label>
            <input
              type="file"
              onChange={handleMainImageChange}
              className={adminStyles.input}
            />
          </div>

          {/* הצגת תמונות נוספות קיימות */}
          {currentImages.length > 0 && (
            <div>
              <label className={adminStyles.label}>
                Current Additional Images
              </label>
              <div className="grid grid-cols-3 gap-4">
                {currentImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Current ${index + 1}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* העלאת תמונות נוספות חדשות */}
          <div>
            <label className={adminStyles.label}>New Additional Images</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className={adminStyles.input}
            />
          </div>

          {/* תצוגה מקדימה של תמונות חדשות */}
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

          {/* כפתור שליחה */}
          <button
            type="submit"
            className={`${adminStyles.button} w-full`}
            disabled={loading}
          >
            {loading ? "Updating Post..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  )
}
