import React, { useState, useEffect } from "react"
import axios from "axios"
import { EDIT_PRODUCT_URL } from "../constants/endPoint"

export const EditProductWin = (props) => {
  const [title, setTitle] = useState(props.title || "")
  const [description, setDescription] = useState(props.description || "")
  const [price, setPrice] = useState(props.price || 0)
  const [images, setImages] = useState(props.images || [])
  const [newImage, setNewImage] = useState("")
  const [newFiles, setNewFiles] = useState([])

  useEffect(() => {
    setTitle(props.title)
    setDescription(props.description)
    setPrice(props.price)
    setImages(props.images || [])
  }, [props])

  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setNewFiles([...newFiles, ...files])
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("price", price)

    // Append new files for upload
    newFiles.forEach((file) => {
      formData.append("images", file)
    })

    // Append existing image URLs
    images.forEach((image) => {
      formData.append("existingImages", image)
    })

    try {
      console.log("Sending data:", {
        title,
        description,
        price,
        newFiles: newFiles.length,
        existingImages: images,
      })

      const response = await axios.put(
        `${EDIT_PRODUCT_URL}${props._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      console.log("Update response:", response)
      props.onClose()
    } catch (err) {
      alert("Error while saving the product.")
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="my-8 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-[#2e7d32]">Edit Product</h2>
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

          <label>Current Images:</label>
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
            <button type="button" onClick={handleAddImage} className="greenBtn">
              Add
            </button>
          </div>

          <label>Upload New Images:</label>
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
  )
}
