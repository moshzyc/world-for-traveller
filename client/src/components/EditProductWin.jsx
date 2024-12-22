import React, { useState } from "react"
import axios from "axios"
import { EDIT_PRODUCT_URL } from "../constants/endPoint"

export const EditProductWin = (props) => {
  const [title, setTitle] = useState(props.title || "")
  const [description, setDescription] = useState(props.description || "")
  const [price, setPrice] = useState(props.price || 0)
  const [images, setImages] = useState(props.images || [])
  const [newImage, setNewImage] = useState("")

  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "your_upload_preset") // עדכן לפי Cloudinary שלך

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // עדכן לפי Cloudinary שלך
          formData
        )
        setImages([...images, res.data.secure_url])
      } catch (err) {
        alert("Failed to upload image.")
      }
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${EDIT_PRODUCT_URL}${props._id}`, {
        title,
        description,
        price,
        images,
      })
      props.onClose()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-[80%] max-w-md rounded-lg bg-white p-4 shadow-lg overflow-x-auto">
          <h2 className="mb-4 text-xl font-bold">Edit Product</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <label htmlFor="title">title:</label>
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
            <input type="file" onChange={handleFileUpload} className="mb-4" />

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
