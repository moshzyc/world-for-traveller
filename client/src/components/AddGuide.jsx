import React, { useState } from "react"
import axios from "axios"
import { ADD_GUIDE_URL } from "../constants/endPoint"

export const AddGuide = () => {
  const [formValue, setFormValue] = useState({
    title: "",
    content: [""], // ייצוג של מערך פסקאות
    images: [], // תמונות שהוזנו (כקבצים או URLs)
  })

  const [files, setFiles] = useState([]) // קבצים שמועלים

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]) // הוסף קבצים בסוף
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
        formData.append("content[]", para) // הוסף כל פסקה בנפרד
      })

      // הוספת קבצים שנבחרו
      if (files.length > 0) {
        files.forEach((file) => formData.append("images", file))
      }

      // הוספת תמונות (URLs או קבצים אחרים)
      if (formValue.images.length > 0) {
        formValue.images.forEach((image) => formData.append("images", image))
      }

      const response = await axios.post(ADD_GUIDE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Guide added successfully:", response.data)
      // Reset the form
      setFormValue({ title: "", content: [""], images: [] })
      setFiles([]) // מחק את הקבצים
    } catch (error) {
      console.error("Error adding guide:", error.response?.data || error)
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

        <label htmlFor="images">Images</label>
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
        </div>

        <button className="blackBtn" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
