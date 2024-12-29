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

    newFiles.forEach((file) => {
      formData.append("images", file)
    })

    images.forEach((image) => {
      formData.append("existingImages", image)
    })

    try {
      await axios.put(`${EDIT_PRODUCT_URL}${props._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      props.onClose()
    } catch (err) {
      alert("Error while saving the product.")
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="my-8 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-[#2e7d32]">Edit Product</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
              rows="4"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Images</label>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative rounded-lg border border-gray-200 p-2">
                  <img
                    src={img}
                    alt={`Product ${index}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md transition hover:bg-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="rounded-lg bg-[#2e7d32] px-4 text-white transition hover:bg-[#1b5e20]"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Upload Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full rounded-lg border border-gray-300 p-2 text-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-lg bg-gray-500 px-6 py-2 text-white transition hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2e7d32] px-6 py-2 text-white transition hover:bg-[#1b5e20]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
