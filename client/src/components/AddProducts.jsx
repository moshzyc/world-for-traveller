import React, { useContext, useState, useEffect } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { ADD_PRODUCT_URL } from "../constants/endPoint"
import axios from "axios"

export const AddProducts = () => {
  const { categories } = useContext(StoreContext)
  const [subIndex, setSubIndex] = useState(0)
  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    subCategory: "",
    description: "",
    price: "",
    weather: "none",
    image: [],
  })
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // עדכון ערכי ברירת מחדל כאשר הקטגוריות נטענות
  useEffect(() => {
    if (categories.length > 0) {
      setFormValue((prev) => ({
        ...prev,
        category: categories[0].category,
        subCategory: categories[0].subCategory?.[0] || "",
      }))
    }
  }, [categories])

  // טיפול בהעלאת קבצי תמונה
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    // סינון קבצים כפולים
    const uniqueFiles = files.filter(
      (file) => !images.some((existingFile) => existingFile.name === file.name)
    )
    setImages([...images, ...uniqueFiles])
  }

  // שליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // יצירת אובייקט FormData לשליחת קבצים
      const formData = new FormData()
      formData.append("title", formValue.title)
      formData.append("category", formValue.category)
      formData.append("subCategory", formValue.subCategory)
      formData.append("description", formValue.description)
      formData.append("price", formValue.price)
      formData.append("weather", formValue.weather)
      images.forEach((image) => {
        formData.append(`images`, image)
      })

      // שליחת הנתונים לשרת
      const response = await axios.post(ADD_PRODUCT_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Product created successfully:", response.data)
      // איפוס הטופס לאחר הצלחה
      setFormValue({
        title: "",
        category: categories[0].category,
        subCategory: categories[0].subCategory?.[0] || "",
        description: "",
        price: "",
        weather: "none",
        image: [],
      })
      setImages([])
    } catch (error) {
      console.error("Error creating product:", error.response?.data || error)
    }
  }

  // יצירת אפשרויות הקטגוריות
  const categoriesGenerator = (arr) =>
    arr.map((item) => (
      <option value={item.category} key={item._id}>
        {item.category}
      </option>
    ))

  // יצירת אפשרויות תת-הקטגוריות
  const subCategoriesGenerator = (arr) =>
    arr.map((item, index) => (
      <option value={item} key={`${item}-${index}`}>
        {item}
      </option>
    ))

  return (
    <div className="p-4">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* שדה כותרת */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Title</label>
            <input
              className="rounded-lg border border-gray-300 p-2"
              type="text"
              placeholder="Enter title"
              name="title"
              value={formValue.title}
              onChange={(e) =>
                setFormValue({ ...formValue, [e.target.name]: e.target.value })
              }
            />
          </div>

          {/* בחירת קטגוריה ותת-קטגוריה */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* תיבת בחירת קטגוריה */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Category</label>
              <select
                className="rounded-lg border border-gray-300 p-2"
                onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex
                  setSubIndex(selectedIndex)
                  setFormValue({
                    ...formValue,
                    category: e.target.value,
                    subCategory:
                      categories[selectedIndex]?.subCategory?.[0] || "",
                  })
                }}
                name="category"
                value={formValue.category}
              >
                {categoriesGenerator(categories)}
              </select>
            </div>

            {/* תיבת בחירת תת-קטגוריה */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Subcategory</label>
              <select
                className="rounded-lg border border-gray-300 p-2"
                onChange={(e) =>
                  setFormValue({ ...formValue, subCategory: e.target.value })
                }
                name="subCategory"
                value={formValue.subCategory}
              >
                {categories[subIndex]?.subCategory ? (
                  subCategoriesGenerator(categories[subIndex].subCategory)
                ) : (
                  <option disabled>No subcategories available</option>
                )}
              </select>
            </div>
          </div>

          {/* שדה מחיר */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Price</label>
            <input
              className="rounded-lg border border-gray-300 p-2"
              type="number"
              placeholder="Enter price"
              name="price"
              value={formValue.price}
              onChange={(e) =>
                setFormValue({ ...formValue, [e.target.name]: e.target.value })
              }
            />
          </div>

          {/* בחירת מזג אוויר */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Weather</label>
            <select
              className="rounded-lg border border-gray-300 p-2"
              name="weather"
              value={formValue.weather}
              onChange={(e) =>
                setFormValue({ ...formValue, weather: e.target.value })
              }
            >
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
              <option value="neutral">Neutral</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* שדה תיאור */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              className="min-h-[100px] rounded-lg border border-gray-300 p-2"
              name="description"
              placeholder="Enter product description"
              value={formValue.description}
              onChange={(e) =>
                setFormValue({ ...formValue, [e.target.name]: e.target.value })
              }
            />
          </div>

          {/* העלאת תמונות */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Images</label>
            <input
              className="rounded-lg border border-gray-300 p-2"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {/* תצוגה מקדימה של תמונות */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {images.map((image, index) => (
                <div key={index} className="group relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      className="redBtn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* כפתור שליחה */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`blackBtn mt-4 ${
              isSubmitting ? "cursor-not-allowed opacity-75" : ""
            }`}
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  )
}
