// ייבוא הספריות והקונטקסט הנדרשים //
import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { UserContext } from "../contexts/UserContextpProvider"

export const Footer = () => {
  // שימוש בקונטקסט החנות והמשתמש //
  const { categories, setCategory, setSubCategory, setTitle } =
    useContext(StoreContext)
  const { user } = useContext(UserContext)

  // פונקציה לטיפול בלחיצה על קטגוריה //
  const handleCategoryClick = (categoryName) => {
    setCategory(categoryName)
    setSubCategory([])
    setTitle("")
  }

  // פונקציה לטיפול בלחיצה על החנות //
  const handleStoreClick = () => {
    setCategory([])
    setSubCategory([])
    setTitle("")
  }

  return (
    // פוטר ראשי //
    <footer className="bg-[#2e7d32] text-white">
      <div className="mycontainer py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* חלק אודות */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">World for Traveler</h3>
            <p className="text-[#e8f5e9]">
              Your ultimate destination for travel and outdoor equipment.
            </p>
          </div>

          {/* קישורים מהירים */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {/* קישורי ניווט */}
              <li>
                <Link
                  to="/"
                  className="text-[#e8f5e9] transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="text-[#e8f5e9] transition-colors hover:text-white"
                  onClick={handleStoreClick}
                >
                  Store
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-[#e8f5e9] transition-colors hover:text-white"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/trip-planner"
                  className="text-[#e8f5e9] transition-colors hover:text-white"
                >
                  Plan Your Trip
                </Link>
              </li>
              <li>
                <Link
                  to={user ? "user" : "/loginsingup"}
                  className="text-[#e8f5e9] transition-colors hover:text-white"
                >
                  {user ? "User" : "Login/Signup"}
                </Link>
              </li>
            </ul>
          </div>

          {/* רשימת קטגוריות */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              {categories?.slice(0, 4).map((cat) => (
                <li key={cat._id}>
                  <Link
                    to="/store"
                    className="text-[#e8f5e9] transition-colors hover:text-white"
                    onClick={() => handleCategoryClick(cat.category)}
                  >
                    {cat.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* פרטי יצירת קשר */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-[#e8f5e9]">
              <li>Email: worldfortraveler770@gmail.com</li>
              <li>Phone: (518) 478-6421</li>
              <li>Location: Ort Singalovski, Israel</li>
            </ul>
          </div>
        </div>

        {/* חלק תחתון של הפוטר */}
        <div className="mt-8 border-t border-[#e8f5e9]/20 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            {/* זכויות יוצרים */}
            <p className="text-sm text-[#e8f5e9]">
              © {new Date().getFullYear()} World for Traveler. All rights
              reserved.
            </p>
            {/* קישורים נוספים (כרגע מוסתרים) */}
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm">
                {/* <li>Privacy Policy</li> */}
                {/* <li>Terms of Service</li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
