import React, { useContext } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { Card } from "../components/Card"

export const Store = () => {
  const { products, category, subCategory, title, setSubCategory } =
    useContext(StoreContext)

  console.log("Category:", category, "SubCategory:", subCategory)

  const productGenerator = (arr) => {
    return arr
      .map((item) => {
        const selectedCategory = category || []
        const selectedSubCategory = subCategory || []

        if (
          (!selectedCategory.length || item.category === selectedCategory) &&
          (!selectedSubCategory.length ||
            item.subCategory === selectedSubCategory)
        ) {
          return <Card key={item._id} item={item} />
        }
        return null
      })
      .filter(Boolean)
  }

  const filteredProducts = title
    ? products.filter((item) =>
        item.title.toLowerCase().includes(title.toLowerCase())
      )
    : products || []

  return (
    <main className="min-h-screen bg-[#f0f7f0] py-8">
      <div className="mycontainer">
        {title ? (
          <div className="mb-6 border-b pb-3">
            <h1 className="text-xl text-gray-600">
              Results search for "<span className="font-semibold">{title}</span>
              "
            </h1>
          </div>
        ) : (
          category &&
          category !== "" && (
            <div className="mb-6 border-b pb-3">
              <h1 className="text-xl text-gray-600">
                <span
                  className="cursor-pointer font-semibold transition-colors hover:text-green-600"
                  onClick={() => setSubCategory("")}
                >
                  {category}
                </span>
                {subCategory && subCategory !== "" && (
                  <>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="font-semibold">{subCategory}</span>
                  </>
                )}
              </h1>
            </div>
          )
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {productGenerator(filteredProducts)}
        </div>
      </div>
    </main>
  )
}
