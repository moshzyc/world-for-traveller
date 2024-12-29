import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { StoreContext } from "../contexts/StoreContaxtProvider"

export const Footer = () => {
  const { categories, setCategory, setSubCategory, setTitle } =
    useContext(StoreContext)

  const handleCategoryClick = (categoryName) => {
    setCategory(categoryName)
    setSubCategory([])
    setTitle("")
  }

  const handleStoreClick = () => {
    setCategory([])
    setSubCategory([])
    setTitle("")
  }

  return (
    <footer className="bg-[#2e7d32] text-white">
      <div className="mycontainer py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">World for Traveler</h3>
            <p className="text-[#e8f5e9]">
              Your ultimate destination for travel and outdoor equipment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
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
            </ul>
          </div>

          {/* Categories */}
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

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-[#e8f5e9]">
              <li>Email: info@worldfortraveler.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Location: Your Location</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-[#e8f5e9]/20 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-[#e8f5e9]">
              © {new Date().getFullYear()} World for Traveler. All rights
              reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm">
                <li>
                  <Link
                    to="/privacy"
                    className="text-[#e8f5e9] transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-[#e8f5e9] transition-colors hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
