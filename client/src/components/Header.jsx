import React, { useContext, useEffect, useState, useRef } from "react"
import css from "../css/header.module.css"
import cartIcon from "../assets/cart-shopping-svgrepo-com.svg"
import userIcon from "../assets/user-svgrepo-com.svg"
import logo from "../assets/world-for-traveller-high-resolution-logo.png"
import searchIcon from "../assets/search-alt-2-svgrepo-com.svg"
import UserForm from "./UserForm"
import { UserContext } from "../contexts/UserContextpProvider"
import { UserProfile } from "./UserProfile"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { GET_CATEGORIES_URL } from "../constants/endPoint"
import axios from "axios"
import { Category } from "./Category"
import CartTable from "./CartTable"
import tripPlannerIcon from "../assets/trip-planner.svg"
import guidesIcon from "../assets/guide.svg"
import communityIcon from "../assets/community.svg"
import closeIcon from "../assets/close-icon.svg"
import chevronIcon from "../assets/chevron-icon.svg"
import { useNavigateWithConfirm } from "../hooks/useNavigateWithConfirm"

export const Header = () => {
  // ניהול מצב התפריטים הנפתחים והממשק //
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isSignup, setIsSignup] = useState(false)
  const [showInMobile, setShowInMobile] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const headerRef = useRef(null)

  // הוקים וקונטקסט //
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const { setTitle, categories, setCategory, setSubCategory, cart } =
    useContext(StoreContext)
  const navigateWithConfirm = useNavigateWithConfirm()
  let title = ""

  // טיפול בלחיצות מחוץ לתפריט הנפתח //
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        // התעלמות מלחיצות על כפתור הוספה לעגלה //
        if (
          activeDropdown === "cart" &&
          event.target.closest("[data-add-to-cart]")
        ) {
          return
        }
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeDropdown])

  // פונקציות לניהול הניווט והתפריטים //
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  const navigateAndClose = (path) => {
    setIsMobileNavOpen(false)
    setActiveDropdown(null)
    navigateWithConfirm(path)
  }

  // טיפול בלחיצות על אייקונים //
  const handleCartClick = () => {
    navigateAndClose("/cart")
  }

  const handleUserClick = () => {
    if (!user) {
      navigateAndClose("/loginsingup")
    } else {
      navigateAndClose("/user")
    }
  }

  return (
    // הדר ראשי //
    <header ref={headerRef} className={css.header}>
      <div className="mycontainer flex h-[90px] items-center justify-between">
        {/* לוגו */}
        <img
          onClick={() => navigateAndClose("/")}
          className={css.logo}
          src={logo}
          alt="Logo"
        />

        {/* אזור החיפוש והניווט */}
        <div className="flex items-center">
          <div className="flex items-center gap-4 sm:flex-row-reverse md:flex-row lg:flex-row">
            {/* תיבת חיפוש */}
            <div className={css.searchContainer}>
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setTitle(title)
                    setCategory([])
                    setSubCategory([])
                    navigate("/store")
                  }
                }}
                onChange={(e) => (title = e.target.value)}
                className={css.input}
                type="text"
                placeholder="Search products..."
              />
              <button
                onClick={() => {
                  setTitle(title)
                  setCategory([])
                  setSubCategory([])
                  navigate("/store")
                }}
                className={css.sBtn}
              >
                <img src={searchIcon} alt="Search" className={css.icons} />
              </button>
            </div>

            {/* סרגל ניווט אייקונים */}
            <div className="ml-1 flex items-center">
              <div className={css.iconsNavStrip}>
                {/* תפריט ניווט */}
                <nav
                  className={`${css.iconsNav} ${isMobileNavOpen ? css.iconsNavOpen : ""}`}
                >
                  {/* קישורי ניווט */}

                  <Link
                    to="/community"
                    onClick={() => navigateAndClose("/community")}
                  >
                    <img
                      src={communityIcon}
                      alt="Community"
                      className={css.icons}
                      title="Travel Community"
                    />
                  </Link>

                  <Link
                    to="/guides"
                    onClick={() => navigateAndClose("/guides")}
                    title="Travel Guides"
                  >
                    <img src={guidesIcon} alt="Guides" className={css.icons} />
                  </Link>

                  <Link
                    to="/trip-planner"
                    onClick={() => navigateAndClose("/trip-planner")}
                    title="Trip Planner"
                  >
                    <img
                      src={tripPlannerIcon}
                      alt="Trip Planner"
                      className={css.icons}
                    />
                  </Link>
                </nav>

                {/* כפתור תפריט נייד */}
                <button
                  onClick={toggleMobileNav}
                  className={`${css.mobileMenuButton} ${isMobileNavOpen ? css.open : ""}`}
                >
                  <img
                    src={isMobileNavOpen ? closeIcon : chevronIcon}
                    alt={isMobileNavOpen ? "Close menu" : "Open menu"}
                    className={css.menuIcon}
                  />
                </button>
              </div>

              {/* אייקוני עגלה ומשתמש */}
              <div className="flex items-center gap-4">
                {/* עגלת קניות */}
                <div className="relative">
                  <img
                    onClick={(e) => {
                      const isMobile = window.innerWidth < 768
                      if (isMobile) {
                        handleCartClick()
                      } else {
                        toggleDropdown("cart")
                        if (e.detail === 2) handleCartClick()
                      }
                    }}
                    className={css.icons}
                    src={cartIcon}
                    alt="Cart"
                    title="Cart"
                  />
                  {/* תצוגה מקדימה של העגלה */}
                  <div
                    className={`text-center ${activeDropdown !== "cart" ? "hidden" : ""} ${css.cartPreview}`}
                  >
                    <Link to="/cart">
                      <button className="mt-2 cursor-pointer font-medium bg-green-800 px-4 py-2 w-full rounded-md text-white hover:underline">
                        go to cart
                      </button>
                    </Link>
                    <CartTable seeCart={() => setActiveDropdown(null)} />
                  </div>
                </div>

                {/* פרופיל משתמש */}
                <div className="relative">
                  <div className={css.userInfo}>
                    <img
                      onClick={(e) => {
                        const isMobile = window.innerWidth < 768
                        if (isMobile) {
                          handleUserClick()
                        } else {
                          toggleDropdown("user")
                          if (e.detail === 2) handleUserClick()
                        }
                      }}
                      className={`${css.icons} ${user ? css.userLogIcon : ""}`}
                      src={userIcon}
                      alt={user ? "User" : "Login/Signup"}
                      title={user ? "User" : "Login/Signup"}
                    />
                    {user && <span className={css.userName}>{user.name}</span>}
                  </div>

                  <div
                    className={`${activeDropdown !== "user" ? "hidden" : ""} ${css.userForm}`}
                  >
                    {user ? (
                      <UserProfile
                        onNav={() => setActiveDropdown(null)}
                        setIsSignup={setIsSignup}
                      />
                    ) : (
                      <UserForm formChenge={setIsSignup} isSignup={isSignup} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* סרגל קטגוריות */}
          <div className="flex items-center gap-4">
            <div className={css.catBar}>
              <div
                alt="Store Categories"
                title="Store Categories"
                onClick={() => toggleDropdown("categories")}
                className={`${css.linseBox} ${activeDropdown === "categories" ? css.linseBoxRotate : ""}`}
              >
                <div className={css.lines}></div>
                <div className={css.lines}></div>
                <div className={css.lines}></div>
              </div>
              <div
                className={`${css.navBlock} ${activeDropdown === "categories" ? css.navBlockApear : ""}`}
              >
                {categories.map((item) => (
                  <Category
                    key={item._id}
                    category={item.category}
                    _id={item._id}
                    subCategory={item.subCategory}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
