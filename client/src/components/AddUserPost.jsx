import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { ADD_POST_URL, GET_CATEGORIES_URL } from "../constants/endPoint"
import { UserContext } from "../contexts/UserContextpProvider"

export const AddPost = () => {
  const { user } = useContext(UserContext)

  const [formValue, setFormValue] = useState({
    title: "",
    content: [""], // מערך פסקאות
    category: "", // קטגוריה נבחרת
    images: [], // תמונות נוספות
    mainImage: null, // התמונה הראשית
  })

  const [files, setFiles] = useState([]) // קבצים של תמונות נוספות
  const [categories, setCategories] = useState([]) // רשימת קטגוריות

  // שליפת הקטגוריות מהשרת
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(GET_CATEGORIES_URL)
        setCategories(response.data) // הנח שהמידע הוא מערך של קטגוריות
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response?.data || error
        )
      }
    }

    fetchCategories()
  }, [])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const handleMainImageChange = (e) => {
    setFormValue({ ...formValue, mainImage: e.target.files[0] })
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
    setFormValue({ ...formValue, category: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formValue.content.forEach((para) => formData.append("content[]", para))
      formData.append("category", formValue.category)
      formData.append("createdBy[username]", user.name)
      formData.append("createdBy[userId]", user.id)

      if (formValue.mainImage) {
        formData.append("mainImage", formValue.mainImage)
      }

      if (files.length > 0) {
        files.forEach((file) => formData.append("images", file))
      }

      const response = await axios.post(ADD_POST_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log("Post added successfully:", response.data)
      setFormValue({
        title: "",
        content: [""],
        category: "",
        images: [],
        mainImage: null,
      })
      setFiles([])
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

        <label htmlFor="category">Category</label>
        <select
          className="rounded-lg border border-black p-1"
          value={formValue.category}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>

        <label htmlFor="mainImage">Main Image</label>
        <input
          className="rounded-lg border border-black p-1"
          type="file"
          onChange={handleMainImageChange}
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
        </div>

        <button className="blackBtn" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
