import React, { useState } from "react"
import axios from "axios"
import { EDIT_GUIDE_URL } from "../constants/endPoint"

export const EditGuideWin = (props) => {
  const [title, setTitle] = useState(props.title || "")
  const [content, setContent] = useState(props.content || [])
  const [images, setImages] = useState(props.images || [])
  const [newImage, setNewImage] = useState("")
  const [newParagraph, setNewParagraph] = useState("")
  const [files, setFiles] = useState([])

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
    setImages(images.filter((_, i) => i !== index))
  }

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]) // הוסף קבצים בסוף
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }
j
  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append("title", title)
    content.forEach((para) => {
      formData.append("content[]", para)
    })

    // הוספת קבצים בתור תמונות בסוף המערך
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file)
      })
    }

    // הוספת URLs של תמונות בסוף המערך
    if (images.length > 0) {
      images.forEach((img) => {
        formData.append("images", img)
      })
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[80%] max-w-md overflow-x-auto rounded-lg bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Edit Guide</h2>
        <form onSubmit={onSubmit} method="put" className="flex flex-col gap-2">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-black p-2"
          />

          <label htmlFor="content">Content:</label>
          <div className="flex flex-col gap-2">
            {content.map((paragraph, index) => (
              <div key={index} className="flex items-center gap-2">
                <textarea
                  value={paragraph}
                  onChange={(e) => {
                    const updatedContent = [...content]
                    updatedContent[index] = e.target.value
                    setContent(updatedContent)
                  }}
                  className="flex-1 rounded-md border border-black p-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveParagraph(index)}
                  className="redBtn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <textarea
              placeholder="Add new paragraph"
              value={newParagraph}
              onChange={(e) => setNewParagraph(e.target.value)}
              className="flex-1 rounded-md border border-black p-2"
            />
            <button
              type="button"
              onClick={handleAddParagraph}
              className="greenBtn"
            >
              Add
            </button>
          </div>

          <label>Images:</label>
          <div className="flex flex-col gap-2">
            {images.map((img, index) => (
              <div key={index} className="flex items-center gap-2">
                <img
                  src={img}
                  alt={`Guide ${index}`}
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
  )
}
