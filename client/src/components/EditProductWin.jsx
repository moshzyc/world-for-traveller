import React, { useState, useEffect } from "react"
import axios from "axios"
import { EDIT_PRODUCT_URL } from "../constants/endPoint"
import css from "../css/overlay.module.css"

export const EditProductWin = (props) => {
  const [title, setTitle] = useState(props.title || "")
  const [description, setDescription] = useState(props.description || "")
  const [price, setPrice] = useState(props.price || 0)
  const [weather, setWeather] = useState(props.weather || "none")
  const [images, setImages] = useState(props.images || [])
  const [newImage, setNewImage] = useState("")
  const [newFiles, setNewFiles] = useState([])

  useEffect(() => {
    setTitle(props.title)
    setDescription(props.description)
    setPrice(props.price)
    setWeather(props.weather || "none")
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
    formData.append("weather", weather)

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
    <div className={css.outsideOverlay}>
      <div className={`${css.insideOverlay} max-w-2xl`}>
        <div className="rounded-lg bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-[#2e7d32]">Edit Product</h2>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-32 w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Price:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Weather:</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
              >
                <option value="hot">Hot</option>
                <option value="cold">Cold</option>
                <option value="neutral">Neutral</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Current Images:</label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images.map((img, index) => (
                  <div key={index} className="relative rounded-lg border border-gray-200 p-2">
                    <img
                      src={img}
                      alt={`Product ${index}`}
                      className="h-24 w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Add Image URL:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="rounded-lg bg-[#2e7d32] px-4 py-2 text-white transition-colors hover:bg-[#1b5e20]"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Upload New Images:</label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#2e7d32] file:px-4 file:py-2 file:text-white hover:file:bg-[#1b5e20]"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={props.onClose}
                className="rounded-lg border border-red-500 px-6 py-2 text-red-500 transition-colors hover:bg-red-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#2e7d32] px-6 py-2 text-white transition-colors hover:bg-[#1b5e20]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
