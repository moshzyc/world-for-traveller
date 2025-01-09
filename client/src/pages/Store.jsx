import React, { useContext, useState } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { Card } from "../components/Card"

// דף החנות - מציג את כל המוצרים עם אפשרויות סינון ודפדוף //
export const Store = () => {
  // קבלת נתונים מהקונטקסט //
  const { products, category, subCategory, title, setSubCategory } =
    useContext(StoreContext)

  // ניהול מצב דפדוף //
  const [currentPage, setCurrentPage] = useState(1) // דף נוכחי
  const [itemsPerPage, setItemsPerPage] = useState(10) // מספר פריטים בדף

  // סינון מוצרים לפי חיפוש //
  const filteredProducts = title
    ? products.filter((item) =>
        item.title.toLowerCase().includes(title.toLowerCase())
      )
    : products || []

  // חישוב מוצרים לדף הנוכחי //
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  // יצירת כרטיסי מוצרים //
  const productGenerator = (arr) => {
    return arr
      .map((item) => {
        return <Card key={item._id} item={item} />
      })
      .filter(Boolean)
  }

  // קומפוננטת דפדוף //
  const Pagination = () => {
    // חישוב מספרי העמודים להצגה //
    const getPageNumbers = () => {
      const pageNumbers = []
      if (totalPages <= 5) {
        // אם יש 5 עמודים או פחות, הצג את כולם
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // תמיד הוסף את עמוד 1
        pageNumbers.push(1)

        if (currentPage <= 3) {
          // אם קרוב להתחלה, הצג 2,3,4,...,אחרון
          pageNumbers.push(2, 3, 4, "...", totalPages)
        } else if (currentPage >= totalPages - 2) {
          // אם קרוב לסוף, הצג 1,...,אחרון-3,אחרון-2,אחרון-1,אחרון
          pageNumbers.push(
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
          )
        } else {
          // אם באמצע, הצג 1,...,נוכחי-1,נוכחי,נוכחי+1,...,אחרון
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

    // תצוגת רכיב הדפדוף //
    return (
      <div className="mt-8 flex items-center justify-center gap-4">
        {/* בחירת מספר פריטים בדף */}
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
        {/* כפתור לעמוד קודם */}
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

  // תצוגת הדף //
  return (
    <main className="min-h-screen bg-[#f0f7f0] py-8">
      <div className="mycontainer">
        {/* כותרת וסינון */}
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
          {/* מספר מוצרים שנמצאו */}
          <p className="mt-1 text-sm text-green-600">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* רשימת המוצרים */}
        <div className="flex flex-wrap justify-center gap-4">
          {productGenerator(currentItems)}
        </div>

        {/* דפדוף - מוצג רק אם יש יותר מ-10 מוצרים */}
        {filteredProducts.length > 10 && <Pagination />}
      </div>
    </main>
  )
}
