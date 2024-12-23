import React, { useContext, useState, useEffect } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { ADD_PRODUCT_URL } from "../constants/endPoint"
import axios from "axios"

export const AddProducts = () => {
  const { categories } = useContext(StoreContext)
  const [subIndex, setSubIndex] = useState(0)
  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    subCategory: "",
    description: "",
    price: "", // added price field
    image: [],
  })
  const [images, setImages] = useState([])

  // Update default values when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      setFormValue((prev) => ({
        ...prev,
        category: categories[0].category,
        subCategory: categories[0].subCategory?.[0] || "",
      }))
    }
  }, [categories])

const handleFileChange = (e) => {
  const files = Array.from(e.target.files)
  const uniqueFiles = files.filter(
    (file) => !images.some((existingFile) => existingFile.name === file.name)
  )
  setImages([...images, ...uniqueFiles])
}

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formData.append("category", formValue.category)
      formData.append("subCategory", formValue.subCategory)
      formData.append("description", formValue.description)
      formData.append("price", formValue.price)
      images.forEach((image, index) => {
        formData.append(`images`, image) 
      })

      const response = await axios.post(ADD_PRODUCT_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Product created successfully:", response.data)
      setFormValue({
        title: "",
        category: categories[0].category, 
        subCategory: categories[0].subCategory?.[0] || "",
        description: "",
        price: "",
        image: [],
      })
      setImages([])
    } catch (error) {
      console.error("Error creating product:", error.response?.data || error)
    }
  }

  const categoriesGenerator = (arr) =>
    arr.map((item) => (
      <option value={item.category} key={item._id}>
        {item.category}
      </option>
    ))

  const subCategoriesGenerator = (arr) =>
    arr.map((item, index) => (
      <option value={item} key={`${item}-${index}`}>
        {item}
      </option>
    ))

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
            setFormValue({ ...formValue, [e.target.name]: e.target.value })
          }
        />
        <label htmlFor="category">Category</label>
        <select
          className="rounded-lg border border-black p-1"
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex
            setSubIndex(selectedIndex)
            setFormValue({
              ...formValue,
              category: e.target.value,
              subCategory: categories[selectedIndex]?.subCategory?.[0] || "", // Default to first subcategory
            })
          }}
          name="category"
          value={formValue.category}
        >
          {categoriesGenerator(categories)}
        </select>
        <label htmlFor="subCategory">Subcategory</label>
        <select
          className="rounded-lg border border-black p-1"
          onChange={(e) =>
            setFormValue({ ...formValue, subCategory: e.target.value })
          }
          name="subCategory"
          value={formValue.subCategory}
        >
          {categories[subIndex]?.subCategory ? (
            subCategoriesGenerator(categories[subIndex].subCategory)
          ) : (
            <option disabled>No subcategories available</option>
          )}
        </select>
        <label htmlFor="price">Price</label>
        <input
          className="rounded-lg border border-black p-1"
          type="number"
          placeholder="Enter price"
          name="price"
          value={formValue.price}
          onChange={(e) =>
            setFormValue({ ...formValue, [e.target.name]: e.target.value })
          }
        />
        <label htmlFor="description">Description:</label>
        <textarea
          className="rounded-lg border border-black p-1"
          name="description"
          id="description"
          value={formValue.description}
          onChange={(e) =>
            setFormValue({ ...formValue, [e.target.name]: e.target.value })
          }
        ></textarea>
        <label htmlFor="image">Images</label>
        <input
          className="rounded-lg border border-black p-1"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <div className="preview">
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="preview-image"
              />
            </div>
          ))}
        </div>

        <button className="blackBtn" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
