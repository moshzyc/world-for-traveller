import React, { useState } from "react"
import { AddProducts } from "../components/AddProducts"
import { EditProduct } from "../components/EditProduct"
import { EditGuide } from "../components/EditGuid"
import { AddGuide } from "../components/AddGuide"
import { OrdersManagement } from "../components/OrdersManagement"
import { UsersManagement } from "../components/UsersManagement"
import { UserPostsManagement } from "../components/UserPostsManagement"

// דף ניהול - מאפשר למנהל לנהל את כל היבטי המערכת //
export const Admin = () => {
  // ניהול מצב תצוגת הסקציות השונות //
  const [addProducts, setAddProducts] = useState(false) // הוספת מוצרים
  const [AddGuides, setAddGuides] = useState(false) // הוספת מדריכים
  const [editProducts, setEditProducts] = useState(false) // עריכת מוצרים
  const [editGuides, setEditGuides] = useState(false) // עריכת מדריכים
  const [showOrders, setShowOrders] = useState(false) // צפייה בהזמנות
  const [showUsers, setShowUsers] = useState(false) // ניהול משתמשים
  const [showPosts, setShowPosts] = useState(false) // ניהול פוסטים

  // חיפוש משתמשים ופוסטים //
  const [userSearch, setUserSearch] = useState("")
  const [postSearch, setPostSearch] = useState("")

  return (
    <main className="min-h-screen bg-[#f0f7f0] py-8">
      <div className="mycontainer max-w-4xl">
        {/* סקציית ניהול מוצרים */}
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[#2e7d32]">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          Products Management
        </h2>
        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-lg">
          {/* אזור הוספת מוצרים */}
          <div
            onClick={() => setAddProducts((p) => !p)}
            className="cursor-pointer border-b border-green-100 p-4 transition-all hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold text-green-800">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                {addProducts ? "−" : "+"}
              </span>
              Add Products
            </h3>
          </div>
          <div
            className={`transition-all ${addProducts ? "animate-fadeIn" : "hidden"}`}
          >
            <AddProducts />
          </div>

          {/* אזור עריכת מוצרים */}
          <div
            onClick={() => setEditProducts((p) => !p)}
            className="cursor-pointer border-b border-green-100 p-4 transition-all hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold text-green-800">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                {editProducts ? "−" : "+"}
              </span>
              Edit Products
            </h3>
          </div>
          <div
            className={`transition-all ${editProducts ? "animate-fadeIn" : "hidden"}`}
          >
            <EditProduct />
          </div>
        </div>

        {/* סקציית ניהול מדריכים */}
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[#2e7d32]">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Guides Management
        </h2>
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* אזור הוספת מדריך */}
          <div
            onClick={() => setAddGuides((p) => !p)}
            className="cursor-pointer border-b border-green-100 p-4 transition-all hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold text-green-800">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                {AddGuides ? "−" : "+"}
              </span>
              Add Guide
            </h3>
          </div>
          <div
            className={`transition-all ${AddGuides ? "animate-fadeIn" : "hidden"}`}
          >
            <AddGuide />
          </div>

          {/* אזור עריכת מדריך */}
          <div
            onClick={() => setEditGuides((p) => !p)}
            className="cursor-pointer border-b border-green-100 p-4 transition-all hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold text-green-800">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                {editGuides ? "−" : "+"}
              </span>
              Edit Guide
            </h3>
          </div>
          <div
            className={`transition-all ${editGuides ? "animate-fadeIn" : "hidden"}`}
          >
            <EditGuide />
          </div>
        </div>

        {/* סקציית ניהול הזמנות */}
        <h2 className="mb-6 mt-8 flex items-center gap-3 text-2xl font-bold text-[#2e7d32]">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Orders Management
        </h2>
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div
            onClick={() => setShowOrders((p) => !p)}
            className="cursor-pointer border-b border-green-100 p-4 transition-all hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold text-green-800">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                {showOrders ? "−" : "+"}
              </span>
              View Orders
            </h3>
          </div>
          <div
            className={`transition-all ${showOrders ? "animate-fadeIn" : "hidden"}`}
          >
            <OrdersManagement />
          </div>
        </div>

        {/* סקציית ניהול משתמשים */}
        <h2 className="mb-6 mt-8 flex items-center gap-3 text-2xl font-bold text-[#2e7d32]">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Users Management
        </h2>
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div
            onClick={() => setShowUsers((p) => !p)}
            className="cursor-pointer border-b border-green-100 p-4 transition-all hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold text-green-800">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                {showUsers ? "−" : "+"}
              </span>
              Manage Users
            </h3>
          </div>
          <div
            className={`transition-all ${showUsers ? "animate-fadeIn" : "hidden"}`}
          >
            {/* חיפוש משתמשים */}
            <div className="border-b border-green-100 p-4">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className={adminStyles.input}
              />
            </div>
            <UsersManagement searchQuery={userSearch} />
          </div>
        </div>

        {/* סקציית ניהול פוסטים */}
        <h2 className="mb-6 mt-8 flex items-center gap-3 text-2xl font-bold text-[#2e7d32]">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
            />
          </svg>
          User Posts Management
        </h2>
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div
            onClick={() => setShowPosts((p) => !p)}
            className="cursor-pointer border-b border-green-100 p-4 transition-all hover:bg-[#e8f5e9]"
          >
            <h3 className="flex items-center text-lg font-semibold text-green-800">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                {showPosts ? "−" : "+"}
              </span>
              Manage User Posts
            </h3>
          </div>
          <div
            className={`transition-all ${showPosts ? "animate-fadeIn" : "hidden"}`}
          >
            {/* חיפוש פוסטים */}
            <div className="border-b border-green-100 p-4">
              <input
                type="text"
                placeholder="Search posts..."
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                className={adminStyles.input}
              />
            </div>
            <UserPostsManagement searchQuery={postSearch} />
          </div>
        </div>
      </div>
    </main>
  )
}

// סגנונות משותפים לקומפוננטות הבן //
export const adminStyles = {
  input:
    "w-full rounded-lg border border-gray-300 p-2 transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none",
  select:
    "w-full rounded-lg border border-gray-300 p-2 transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none",
  label: "block mb-1 font-medium text-gray-700",
  formSection: "bg-white rounded-lg p-6 shadow-sm",
  sectionTitle: "text-xl font-semibold text-green-700 mb-4",
  button:
    "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  deleteButton:
    "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
}
