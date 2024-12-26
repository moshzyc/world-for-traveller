import React, { useState } from "react"
import axios from "axios"
import { ADD_USER_POST_URL } from "../constants/endPoint"

export const AddUserPost = () => {
  const [formValue, setFormValue] = useState({
    title: "",
    content: [""], // מערך של פסקאות
    category: [],
    images: [], // תמונות שהוזנו (כקבצים או URLs)
    mainImage: null, // תמונה ראשית (קובץ או URL)
  })

  const [files, setFiles] = useState([]) // קבצים שמועלים
  const [mainFile, setMainFile] = useState(null) // תמונה ראשית כקובץ

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const handleMainFileChange = (e) => {
    setMainFile(e.target.files[0])
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

  const handleCategoryChange = (e) => {
    const selectedCategories = e.target.value
      .split(",")
      .map((cat) => cat.trim())
    setFormValue({ ...formValue, category: selectedCategories })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formValue.content.forEach((para) => {
        formData.append("content[]", para)
      })
      formValue.category.forEach((cat) => {
        formData.append("category[]", cat)
      })

      // הוספת תמונה ראשית
      if (mainFile) {
        formData.append("mainImage", mainFile)
      } else if (formValue.mainImage) {
        formData.append("mainImage", formValue.mainImage)
      }

      // הוספת קבצים שנבחרו
      if (files.length > 0) {
        files.forEach((file) => formData.append("images", file))
      }

      const response = await axios.post(ADD_USER_POST_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Post added successfully:", response.data)
      // איפוס הטופס
      setFormValue({
        title: "",
        content: [""],
        category: [],
        images: [],
        mainImage: null,
      })
      setFiles([])
      setMainFile(null)
    } catch (error) {
      console.error("Error adding post:", error.response?.data || error)
    }
  }

  return (
    <div className="m-auto w-[50%] p-2">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          className="rounded-lg border border-black p-1"
          type="text"
          placeholder="Enter title"
          name="title"
          value={formValue.title}
          onChange={(e) =>
            setFormValue({ ...formValue, title: e.target.value })
          }
        />

        <label htmlFor="content">Content</label>
        {formValue.content.map((paragraph, index) => (
          <div key={index} className="flex items-center gap-2">
            <textarea
              className="flex-1 rounded-lg border border-black p-1"
              placeholder={`Paragraph ${index + 1}`}
              value={paragraph}
              onChange={(e) => handleContentChange(index, e.target.value)}
            ></textarea>
            {formValue.content.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveParagraph(index)}
                className="redBtn"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddParagraph} className="greenBtn">
          Add Paragraph
        </button>

        <label htmlFor="category">Categories (comma-separated)</label>
        <input
          className="rounded-lg border border-black p-1"
          type="text"
          placeholder="Enter categories"
          value={formValue.category.join(", ")}
          onChange={handleCategoryChange}
        />

        <label htmlFor="mainImage">Main Image</label>
        <input
          className="rounded-lg border border-black p-1"
          type="file"
          onChange={handleMainFileChange}
        />

        <label htmlFor="images">Additional Images</label>
        <input
          className="rounded-lg border border-black p-1"
          type="file"
          multiple
          onChange={handleFileChange}
        />

        <div className="preview">
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="preview-image"
            />
          ))}
          {mainFile && (
            <img
              src={URL.createObjectURL(mainFile)}
              alt="Main Preview"
              className="main-preview-image"
            />
          )}
        </div>

        <button className="blackBtn" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
