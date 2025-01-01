import React from "react"
import { Card } from "../Card"

export const RecommendedProducts = ({ products }) => {
  if (!products || products.length === 0) return null

  const handleProductClick = (productId) => {
    window.open(`/product/${productId}`, "_blank")
  }

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Recommended For Your Trip</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product._id} className="flex h-full">
            <div className="flex w-full flex-col rounded-lg bg-gray-50 p-4 transition-shadow hover:shadow-md">
              <div
                className="relative mb-3 aspect-square w-full cursor-pointer overflow-hidden rounded-lg"
                onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="flex flex-grow flex-col justify-between">
                <div>
                  <h3
                    className="mb-1 cursor-pointer font-medium text-gray-900 transition-colors hover:text-[#2e7d32]"
                    onClick={() => handleProductClick(product._id)}
                  >
                    {product.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {product.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-[#2e7d32]">
                    {product.price} ILS
                  </span>
                  <button
                    className="rounded-full bg-[#2e7d32] px-4 py-1.5 text-sm text-white transition-colors hover:bg-[#1b5e20]"
                    onClick={() => {
                      /* Add to cart logic */
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
