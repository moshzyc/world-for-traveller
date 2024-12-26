import React, { useState, useEffect } from "react"
import axios from "axios"
import { EDIT_PRODUCT_URL } from "../constants/endPoint"

export const EditProductWin = (props) => {
  const [title, setTitle] = useState(props.title || "")
  const [description, setDescription] = useState(props.description || "")
  const [price, setPrice] = useState(props.price || 0)
  const [images, setImages] = useState(props.images || [])
  const [newImage, setNewImage] = useState("") // התמונות החדשות מקישור URL
  const [newFiles, setNewFiles] = useState([]) // התמונות החדשות שממתינות להעלאה כקבצים

  useEffect(() => {
    setTitle(props.title)
    setDescription(props.description)
    setPrice(props.price)
    setImages(props.images || [])
  }, [props])

  // הוספת תמונה חדשה מקישור (URL)
  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("") // נקה את השדה אחרי ההוספה
    }
  }

  // הסרת תמונה
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // העלאת קובץ תמונה
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setNewFiles([...newFiles, ...files]) // נוסיף את הקבצים החדשים
  }

  // שליחת הנתונים עם התמונות (העלות)
  const onSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("price", price)

    // הוספת כל התמונות החדשות (קבצים) ל-FormData
    newFiles.forEach((file) => {
      formData.append("images", file)
    })

    // הוספת התמונות שכבר היו קיימות (ה-URLs) אם יש כאלה
    images.forEach((image) => {
      formData.append("existingImages", image)
    })

    try {
      // שליחה לשרת עם FormData (לא ל-Cloudinary ישירות)
      await axios.put(`${EDIT_PRODUCT_URL}${props._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // חשוב לשלוח כ-Multipart
        },
      })

      props.onClose()
    } catch (err) {
      alert("Error while saving the product.")
      console.error(err)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-[80%] max-w-md overflow-x-auto rounded-lg bg-white p-4 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Edit Product</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-black p-2"
            />

            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-black p-2"
            />

            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full rounded-md border border-black p-2"
            />

            <label>Images:</label>
            <div className="flex flex-col gap-2">
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img
                    src={img}
                    alt={`Product ${index}`}
                    className="h-16 w-16 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="redBtn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 rounded-md border border-black p-2"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="greenBtn"
              >
                Add
              </button>
            </div>

            <label>Upload Image:</label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <button type="button" onClick={props.onClose} className="redBtn">
                Cancel
              </button>
              <button type="submit" className="greenBtn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
