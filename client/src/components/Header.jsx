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

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isSignup, setIsSignup] = useState(false)
  const [showInMobile, setShowInMobile] = useState(false)
  const headerRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const { setTitle, categories, setCategory, setSubCategory, cart } =
    useContext(StoreContext)
  let title = ""
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
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

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  const navigateAndClose = (path) => {
    setIsMobileNavOpen(false)
    setActiveDropdown(null)
    navigate(path)
  }

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
    <header ref={headerRef} className={css.header}>
      <div className="mycontainer flex h-[90px] items-center justify-between">
        <img
          onClick={() => navigateAndClose("/")}
          className={css.logo}
          src={logo}
          alt="Logo"
        />
        <div className="flex items-center">
          <div className="flex items-center gap-4 sm:flex-row-reverse md:flex-row lg:flex-row">
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
            <div className="flex items-center">
              <div className={css.iconsNavStrip}>
                <nav
                  className={`${css.iconsNav} ${isMobileNavOpen ? css.iconsNavOpen : ""}`}
                >
                  <Link
                    to="/trip-planner"
                    onClick={() => navigateAndClose("/trip-planner")}
                  >
                    <img
                      src={tripPlannerIcon}
                      alt="Trip Planner"
                      className={css.icons}
                    />
                  </Link>
                  <Link
                    to="/guides"
                    onClick={() => navigateAndClose("/guides")}
                  >
                    <img src={guidesIcon} alt="Guides" className={css.icons} />
                  </Link>
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
                </nav>
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
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    onClick={(e) => {
                      const isMobile = window.innerWidth < 768
                      if (isMobile) {
                        handleCartClick() // Direct navigation on mobile
                      } else {
                        toggleDropdown("cart") // Keep dropdown toggle on desktop
                        if (e.detail === 2) handleCartClick() // Double click navigation on desktop
                      }
                    }}
                    className={css.icons}
                    src={cartIcon}
                    alt="Cart"
                  />
                  <div
                    className={`${activeDropdown !== "cart" ? "hidden" : ""} ${css.cartPreview}`}
                  >
                    <CartTable seeCart={() => setActiveDropdown(null)} />
                  </div>
                </div>

                <div className="relative">
                  <div className={css.userInfo}>
                    <img
                      onClick={(e) => {
                        const isMobile = window.innerWidth < 768
                        if (isMobile) {
                          handleUserClick() // Direct navigation on mobile
                        } else {
                          toggleDropdown("user") // Keep dropdown toggle on desktop
                          if (e.detail === 2) handleUserClick() // Double click navigation on desktop
                        }
                      }}
                      className={`${css.icons} ${user ? css.userLogIcon : ""}`}
                      src={userIcon}
                      alt="User"
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
          <div className="flex items-center gap-4">
            <div className={css.catBar}>
              <div
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
