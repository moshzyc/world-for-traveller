import React, { useState } from "react"
import axios from "axios"
import { ADD_GUIDE_URL, EDIT_GUIDE_URL } from "../constants/endPoints"

export const AddGuide = () => {
  const [formValue, setFormValue] = useState({
    title: "",
    content: "",
    images: [],
  })
  const [images, setImages] = useState([])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setImages([...images, ...files])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formData.append("content", formValue.content)
      images.forEach((image) => {
        formData.append("images", image)
      })

      const response = await axios.post(ADD_GUIDE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Guide created successfully:", response.data)
      setFormValue({ title: "", content: "", images: [] })
      setImages([])
    } catch (error) {
      console.error("Error creating guide:", error.response?.data || error)
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
        <textarea
          className="rounded-lg border border-black p-1"
          name="content"
          value={formValue.content}
          onChange={(e) =>
            setFormValue({ ...formValue, content: e.target.value })
          }
        ></textarea>

        <label htmlFor="images">Images</label>
        <input
          className="rounded-lg border border-black p-1"
          type="file"
          multiple
          onChange={handleFileChange}
        />

        <div className="preview">
          {images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
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

export const EditGuide = ({ guide, onClose }) => {
  const [formValue, setFormValue] = useState({
    title: guide.title || "",
    content: guide.content || "",
    images: guide.images || [],
  })
  const [newImages, setNewImages] = useState([])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setNewImages([...newImages, ...files])
  }

  const handleRemoveImage = (index) => {
    setFormValue({
      ...formValue,
      images: formValue.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formData.append("content", formValue.content)
      formValue.images.forEach((image) => formData.append("images", image))
      newImages.forEach((image) => formData.append("images", image))

      const response = await axios.put(
        `${EDIT_GUIDE_URL}/${guide._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      console.log("Guide updated successfully:", response.data)
      onClose()
    } catch (error) {
      console.error("Error updating guide:", error.response?.data || error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[80%] max-w-md overflow-x-auto rounded-lg bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Edit Guide</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={formValue.title}
            onChange={(e) =>
              setFormValue({ ...formValue, title: e.target.value })
            }
            className="w-full rounded-md border border-black p-2"
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={formValue.content}
            onChange={(e) =>
              setFormValue({ ...formValue, content: e.target.value })
            }
            className="w-full rounded-md border border-black p-2"
          ></textarea>

          <label>Existing Images</label>
          <div className="flex flex-col gap-2">
            {formValue.images.map((img, index) => (
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

          <label>Upload New Images</label>
          <input type="file" multiple onChange={handleFileChange} />

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="redBtn">
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
