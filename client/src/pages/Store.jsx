import React, { useContext, useState } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { Card } from "../components/Card"

export const Store = () => {
  const { products, category, subCategory, title, setSubCategory } =
    useContext(StoreContext)

  console.log("Category:", category, "SubCategory:", subCategory)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredProducts = title
    ? products.filter((item) =>
        item.title.toLowerCase().includes(title.toLowerCase())
      )
    : products || []

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const productGenerator = (arr) => {
    return arr
      .map((item) => {
        return <Card key={item._id} item={item} />
      })
      .filter(Boolean)
  }

  const Pagination = () => {
    const getPageNumbers = () => {
      const pageNumbers = []
      if (totalPages <= 5) {
        // If 5 or fewer pages, show all
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // Always add page 1
        pageNumbers.push(1)

        if (currentPage <= 3) {
          // If near start, show 2,3,4,...,last
          pageNumbers.push(2, 3, 4, "...", totalPages)
        } else if (currentPage >= totalPages - 2) {
          // If near end, show 1,...,last-3,last-2,last-1,last
          pageNumbers.push(
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
          )
        } else {
          // If in middle, show 1,...,current-1,current,current+1,...,last
          pageNumbers.push(
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
          )
        }
      }
      return pageNumbers
    }

    return (
      <div className="mt-8 flex items-center justify-center gap-4">
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
          className="rounded border p-2"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={40}>40 per page</option>
        </select>

        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded bg-green-600 px-4 py-2 text-white disabled:bg-gray-400"
        >
          Back
        </button>

        <div className="flex gap-2">
          {getPageNumbers().map((number, index) => (
            <button
              key={index}
              onClick={() => number !== "..." && setCurrentPage(number)}
              disabled={number === "..."}
              className={`h-8 w-8 rounded ${
                number === "..."
                  ? "cursor-default"
                  : currentPage === number
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-green-100"
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="rounded bg-green-600 px-4 py-2 text-white disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f0f7f0] py-8">
      <div className="mycontainer">
        <div className="mb-8">
          {title ? (
            <div>
              <h1 className="text-xl font-medium text-green-800">
                Search results for{" "}
                <span className="font-semibold text-green-700">"{title}"</span>
              </h1>
            </div>
          ) : category ? (
            <div className="flex items-center gap-2">
              <h1
                className="cursor-pointer text-xl font-medium text-green-800 hover:text-green-700"
                onClick={() => setSubCategory("")}
              >
                {category}
              </h1>
              {subCategory && (
                <>
                  <span className="text-green-600">/</span>
                  <h2 className="text-xl font-medium text-green-700">
                    {subCategory}
                  </h2>
                </>
              )}
            </div>
          ) : (
            <h1 className="text-xl font-medium text-green-800">All Products</h1>
          )}
          <p className="mt-1 text-sm text-green-600">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {productGenerator(currentItems)}
        </div>

        {filteredProducts.length > 10 && <Pagination />}
      </div>
    </main>
  )
}
