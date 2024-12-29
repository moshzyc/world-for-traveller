import React, { useContext, useState } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { EditProductWin } from "./EditProductWin"
import axios from "axios"
import { PRODUCTS_URL } from "../constants/endPoint"

export const EditProduct = () => {
  const { categories, products, setCategory, setSubCategory } =
    useContext(StoreContext)
  const [subIndex, setSubIndex] = useState(0)
  const [productEdited, setProductEdited] = useState(null)

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
    <div className="p-4">
      <div className="rounded-lg bg-white shadow-md">
        <div className="border-b border-gray-200 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Category</label>
              <select
                className="rounded-lg border border-gray-300 p-2"
                onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex
                  setSubIndex(selectedIndex)
                  setCategory(e.target.value)
                }}
                name="category"
              >
                {categoriesGenerator(categories)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Subcategory</label>
              <select
                className="rounded-lg border border-gray-300 p-2"
                onChange={(e) => setSubCategory(e.target.value)}
                name="subCategory"
              >
                {categories[subIndex]?.subCategory ? (
                  subCategoriesGenerator(categories[subIndex].subCategory)
                ) : (
                  <option disabled>No subcategories available</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {products.map((item) => (
            <div
              key={item._id}
              className="flex justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex w-[70%] gap-4">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-600">Category: {item.category}</p>
                  <p className="text-gray-600">Price: ${item.price}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setProductEdited(item)}
                  className="whiteBtn"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure?")) {
                      await axios.delete(PRODUCTS_URL + `/delete/${item._id}`)
                    }
                  }}
                  className="redBtn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {productEdited && (
        <EditProductWin
          {...productEdited}
          onClose={() => setProductEdited(null)}
        />
      )}
    </div>
  )
}
