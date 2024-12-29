import React, { useState } from "react"
import { AddProducts } from "../components/AddProducts"
import { EditProduct } from "../components/EditProduct"
import { EditGuide } from "../components/EditGuid"
import { AddGuide } from "../components/AddGuide"

export const Admin = () => {
  const [addProducts, setAddProducts] = useState(false)
  const [AddGuides, setAddGuides] = useState(false)
  const [editProducts, setEditProducts] = useState(false)
  const [editGuides, setEditGuides] = useState(false)

  return (
    <main className="min-h-screen bg-[#f0f7f0] py-8">
      <div className="mycontainer">
        {/* Products Management Section */}
        <h2 className="mb-6 text-2xl font-bold text-[#2e7d32]">
          Products Management
        </h2>
        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
          {/* Add Products Section */}
          <div
            onClick={() => setAddProducts((p) => !p)}
            className="cursor-pointer border-b p-4 transition-colors hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold">
              <span className="mr-2 text-xl">{addProducts ? "-" : "+"}</span>
              Add Products
            </h3>
          </div>
          {addProducts && <AddProducts />}

          {/* Edit Products Section */}
          <div
            onClick={() => setEditProducts((p) => !p)}
            className="cursor-pointer border-b p-4 transition-colors hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold">
              <span className="mr-2 text-xl">{editProducts ? "-" : "+"}</span>
              Edit Products
            </h3>
          </div>
          {editProducts && <EditProduct />}
        </div>

        {/* Guides Management Section */}
        <h2 className="mb-6 text-2xl font-bold text-[#2e7d32]">
          Guides Management
        </h2>
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          {/* Add Guide Section */}
          <div
            onClick={() => setAddGuides((p) => !p)}
            className="cursor-pointer border-b p-4 transition-colors hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold">
              <span className="mr-2 text-xl">{AddGuides ? "-" : "+"}</span>
              Add Guide
            </h3>
          </div>
          {AddGuides && <AddGuide />}

          {/* Edit Guide Section */}
          <div
            onClick={() => setEditGuides((p) => !p)}
            className="cursor-pointer border-b p-4 transition-colors hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold">
              <span className="mr-2 text-xl">{editGuides ? "-" : "+"}</span>
              Edit Guide
            </h3>
          </div>
          {editGuides && <EditGuide />}
        </div>
      </div>
    </main>
  )
}

// Common styles for reuse in child components
export const adminStyles = {
  input:
    "rounded-lg border border-gray-300 p-2 w-full focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none",
  select:
    "rounded-lg border border-gray-300 p-2 w-full focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none",
  label: "font-medium text-gray-700 block mb-1",
  formSection: "bg-white rounded-lg p-6",
  sectionTitle: "text-xl font-semibold text-[#2e7d32] mb-4",
}
