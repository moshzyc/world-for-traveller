import React, { useState } from "react"
import axios from "axios"
import { EDIT_GUIDE_URL } from "../constants/endPoint"

export const EditGuideWin = (props) => {
  const [title, setTitle] = useState(props.title || "")
  const [content, setContent] = useState(props.content || [])
  const [mainImage, setMainImage] = useState(null)
  const [mainImageUrl, setMainImageUrl] = useState(props.mainImage || "")
  const [images, setImages] = useState(props.images || [])
  const [newImage, setNewImage] = useState("")
  const [newParagraph, setNewParagraph] = useState("")
  const [files, setFiles] = useState([])

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMainImage(file)
      setMainImageUrl("") // Clear URL when file is selected
    }
  }

  const handleMainImageUrlChange = (e) => {
    setMainImageUrl(e.target.value)
    setMainImage(null) // Clear file when URL is entered
  }

  const handleAddParagraph = () => {
    if (newParagraph.trim()) {
      setContent([...content, newParagraph.trim()])
      setNewParagraph("")
    }
  }

  const handleRemoveParagraph = (index) => {
    setContent(content.filter((_, i) => i !== index))
  }

  const handleRemoveImage = (index) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append("title", title)
    formData.append("content", JSON.stringify(content))

    // Handle main image
    if (mainImage) {
      formData.append("mainImage", mainImage)
    } else if (mainImageUrl) {
      formData.append("mainImageUrl", mainImageUrl)
    }

    // Handle additional files
    files.forEach((file) => {
      formData.append("images", file)
    })

    // Handle existing and new image URLs
    formData.append("imageUrls", JSON.stringify(images))

    try {
      const response = await axios.put(
        `${EDIT_GUIDE_URL}/${props._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      console.log("Response data:", response.data)
      props.onClose()
    } catch (err) {
      console.error("Error during guide update:", err)
      alert("Error while updating guide")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="my-8 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-[#2e7d32]">Edit Guide</h2>
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

          <div className="space-y-4">
            <label className="block font-medium text-gray-700">
              Main Image
            </label>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Upload Main Image</label>
              <input
                type="file"
                onChange={handleMainImageChange}
                accept="image/*"
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Main Image URL</label>
              <input
                type="url"
                value={mainImageUrl}
                onChange={handleMainImageUrlChange}
                placeholder="Enter main image URL"
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>

            {(mainImage || mainImageUrl) && (
              <div className="mt-2">
                <h3 className="mb-2 font-medium text-gray-700">
                  Main Image Preview:
                </h3>
                <div className="relative inline-block">
                  <img
                    src={
                      mainImage ? URL.createObjectURL(mainImage) : mainImageUrl
                    }
                    alt="Main image preview"
                    className="h-48 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImage(null)
                      setMainImageUrl("")
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Content</label>
            <div className="space-y-3">
              {content.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => {
                      const updatedContent = [...content]
                      updatedContent[index] = e.target.value
                      setContent(updatedContent)
                    }}
                    className="flex-1 rounded-lg border border-gray-300 p-2"
                    rows="3"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(index)}
                    className="h-10 rounded-lg bg-red-500 px-4 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <textarea
                  placeholder="Add new paragraph"
                  value={newParagraph}
                  onChange={(e) => setNewParagraph(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 p-2"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="h-10 rounded-lg bg-[#2e7d32] px-4 text-white hover:bg-[#1b5e20]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-medium text-gray-700">
              Additional Images
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((img, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={img}
                      alt={`Guide ${index}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {files.map((file, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Upload New Images</label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 p-2"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="rounded-lg bg-[#2e7d32] px-4 text-white hover:bg-[#1b5e20]"
              >
                Add URL
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-lg bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2e7d32] px-6 py-2 text-white hover:bg-[#1b5e20]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
