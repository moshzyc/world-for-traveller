import React, { useState } from "react"
import axios from "axios"
import { ADD_GUIDE_URL } from "../constants/endPoint"

export const AddGuide = () => {
  const [formValue, setFormValue] = useState({
    title: "",
    content: [""],
    images: [],
  })
  const [files, setFiles] = useState([])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const handleContentChange = (index, value) => {
    const updatedContent = [...formValue.content]
    updatedContent[index] = value
    setFormValue({ ...formValue, content: updatedContent })
  }

  const handleAddParagraph = () => {
    setFormValue({ ...formValue, content: [...formValue.content, ""] })
  }

  const handleRemoveParagraph = (index) => {
    const updatedContent = formValue.content.filter((_, i) => i !== index)
    setFormValue({ ...formValue, content: updatedContent })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formValue.content.forEach((para) => {
        formData.append("content[]", para)
      })

      files.forEach((file) => formData.append("images", file))

      if (formValue.images.length > 0) {
        formValue.images.forEach((image) => formData.append("images", image))
      }

      await axios.post(ADD_GUIDE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Reset form
      setFormValue({ title: "", content: [""], images: [] })
      setFiles([])
    } catch (error) {
      console.error("Error adding guide:", error.response?.data || error)
    }
  }

  return (
    <div className="p-4">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Title</label>
            <input
              className="rounded-lg border border-gray-300 p-2"
              type="text"
              placeholder="Enter guide title"
              name="title"
              value={formValue.title}
              onChange={(e) =>
                setFormValue({ ...formValue, title: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-medium text-gray-700">Content</label>
            {formValue.content.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  className="min-h-[100px] flex-1 rounded-lg border border-gray-300 p-2"
                  placeholder={`Paragraph ${index + 1}`}
                  value={paragraph}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                />
                {formValue.content.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(index)}
                    className="redBtn self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddParagraph}
              className="whiteBtn self-start"
            >
              Add Paragraph
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Images</label>
            <input
              className="rounded-lg border border-gray-300 p-2"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {files.map((file, index) => (
                <div key={index} className="group relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== index))
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

          <button type="submit" className="blackBtn mt-4">
            Add Guide
          </button>
        </form>
      </div>
    </div>
  )
}
