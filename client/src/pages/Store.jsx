import React, { useContext } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { Card } from "../components/Card"

export const Store = () => {
  const { products, category, subCategory, title } = useContext(StoreContext)

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
        <div className="flex flex-wrap justify-center gap-4">
          {productGenerator(filteredProducts)}
        </div>
      </div>
    </main>
  )
}
