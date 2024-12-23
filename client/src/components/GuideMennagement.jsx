import React, { useState } from "react"
import axios from "axios"
import { ADD_GUIDE_URL, EDIT_GUIDE_URL } from "../constants/endPoint"

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
      formData.append("existingImages", JSON.stringify(formValue.images))
      images.forEach((image) => formData.append("newImages", image))

      formData.forEach((value, key) => {
        console.log(`FormData Key: ${key}, Value:`, value)
      })

      const response = await axios.put(
        `${EDIT_GUIDE_URL}/${props._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      console.log("Guide updated successfully:", response.data)
      props.onClose()
    } catch (error) {
      console.error("Error updating guide:", error.response?.data || error)
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

export const EditGuideWin = (props) => {
  const [title, setTitle] = useState(props.title || "")
  const [content, setContent] = useState(props.content || "")
  const [images, setImages] = useState(props.images || [])
  const [newImage, setNewImage] = useState("")

  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "your_upload_preset") // עדכן לפי Cloudinary שלך

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // עדכן לפי Cloudinary שלך
          formData
        )
        setImages([...images, res.data.secure_url])
      } catch (err) {
        alert("Failed to upload image.")
      }
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${EDIT_GUIDE_URL}/${props._id}`, {
        title,
        content,
        images,
      })
      props.onClose()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-[80%] max-w-md overflow-x-auto rounded-lg bg-white p-4 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Edit Guide</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-black p-2"
            />

            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-md border border-black p-2"
            />

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
              <button
                type="button"
                onClick={handleAddImage}
                className="greenBtn"
              >
                Add
              </button>
            </div>

            <label>Upload Image:</label>
            <input type="file" onChange={handleFileUpload} className="mb-4" />

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
    </>
  )
}