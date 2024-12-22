import React, { useContext, useState } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { EditProductWin } from "../components/EditProductWin"
import logo from "../assets/Untitled.png"

export const EditProduct = () => {
  const { categories, products, setCategory, setSubCategory } =
    useContext(StoreContext)
  const [subIndex, setSubIndex] = useState(0)
  const [edit, setEdit] = useState(false)
  const [productEdited, setProductEdited] = useState({})

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

  const productsGenerator = (arr) => {
    const productsArr = arr.map((item) => {
      return (
        <div
          className="flex justify-between border-t border-black"
          key={item._id}
        >
          <img src={logo} alt="" />
          <div className="flex flex-col gap-4">
            <p>id: {item._id}</p>
            <p>title: {item.title}</p>
            <p>category: {item.category}</p>
            <p>subCategory: {item.subCategory}</p>
            <p>description: {item.description}</p>
            <p>price: {item.price}</p>
          </div>
          <div>
            <button
              onClick={() => {
                setProductEdited(item)
                setEdit(true)
              }}
              className="whiteBtn"
            >
              edit
            </button>
          </div>
        </div>
      )
    })
    return productsArr
  }
  return (
    <div className="p-2 pb-0">
      <label htmlFor="category">Category</label>
      <select
        className="rounded-lg border border-black p-1"
        onChange={(e) => {
          const selectedIndex = e.target.selectedIndex
          setSubIndex(selectedIndex)
          setCategory(e.target.value)
        }}
        name="category"
      >
        {categoriesGenerator(categories)}
      </select>
      <label htmlFor="subCategory">Subcategory</label>
      <select
        className="rounded-lg border border-black p-1"
        onChange={(e) => setSubCategory(e.target.value)}
        name="subCategory"
      >
        {categories[subIndex]?.subCategory ? (
          subCategoriesGenerator(categories[subIndex].subCategory)
        ) : (
          <option disabled>No subcategories available</option>
        )}
      </select>
      <div className="mt-4">
        {productsGenerator(products)}
        {productEdited && (
          <EditProductWin
            {...productEdited}
            onClose={() => setProductEdited(null)}
          />
        )}
      </div>
    </div>
  )
}
