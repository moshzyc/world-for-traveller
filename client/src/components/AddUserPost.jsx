import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { ADD_POST_URL, POST_CATEGORIES_URL } from "../constants/endPoint"
import { UserContext } from "../contexts/UserContextpProvider"
import { LocationSearchInput } from "./GooglePlacesAutocomplete"
import { ProductSelector } from "./ProductSelector"
import { adminStyles } from "../pages/Admin"
import { useNavigate } from "react-router-dom"

export const AddUserPost = () => {
  // שימוש בקונטקסט המשתמש
  const { user } = useContext(UserContext)
  // ניהול מצב הטופס
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
    category: "",
    location: null,
    product: null,
    images: [],
    mainImage: null,
  })

  // מצבים נוספים
  const [files, setFiles] = useState([]) // קבצי תמונה נוספים
  const [categories, setCategories] = useState([]) // רשימת קטגוריות
  const [loading, setLoading] = useState(false) // מצב טעינה
  const [error, setError] = useState(null) // הודעות שגיאה
  const navigate = useNavigate() // ניווט בין דפים

  // טעינת קטגוריות בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchCategories()
  }, [])

  // פונקציה לטעינת קטגוריות מהשרת
  const fetchCategories = async () => {
    try {
      const response = await axios.get(POST_CATEGORIES_URL)
      setCategories(response.data)
    } catch (error) {
      setError("Error fetching categories")
      console.error("Error fetching categories:", error)
    }
  }

  // טיפול בבחירת מיקום מ-Google Places
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

  // טיפול בבחירת מוצר
  const handleProductSelect = (product) => {
    setFormValue({
      ...formValue,
      product: product._id,
    })
  }

  // טיפול בהעלאת קבצי תמונה נוספים
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  // טיפול בהעלאת תמונה ראשית
  const handleMainImageChange = (e) => {
    setFormValue({ ...formValue, mainImage: e.target.files[0] })
  }

  // טיפול בשינוי תוכן הפוסט
  const handleContentChange = (e) => {
    setFormValue({ ...formValue, content: e.target.value })
  }

  // שליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // יצירת אובייקט FormData לשליחת קבצים
      const formData = new FormData()
      formData.append("title", formValue.title)
      formData.append("content", formValue.content)
      formData.append("category", formValue.category)

      // לוג לצורכי דיבוג
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

      // הוספת נתוני מיקום אם קיימים
      if (formValue.location) {
        formData.append("location[name]", formValue.location.name)
        formData.append("location[lat]", formValue.location.lat)
        formData.append("location[lng]", formValue.location.lng)
      }

      // הוספת מזהה מוצר אם קיים
      if (formValue.product) {
        formData.append("product", formValue.product)
      }

      // הוספת תמונה ראשית
      if (formValue.mainImage) {
        formData.append("mainImage", formValue.mainImage)
      }

      // הוספת תמונות נוספות
      files.forEach((file) => {
        formData.append("images", file)
      })

      // שליחת הנתונים לשרת
      const { data } = await axios.post(ADD_POST_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })

      // ניווט לדף הקהילה לאחר הצלחה
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
      {/* הצגת הודעות שגיאה */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* שדה כותרת */}
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

        {/* בחירת קטגוריה */}
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

        {/* שדה מיקום מותנה */}
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

        {/* בחירת מוצר מותנית */}
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

        {/* העלאת תמונות */}
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

        {/* תצוגה מקדימה של תמונות */}
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
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  )
}
