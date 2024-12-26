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

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isSignup, setIsSignup] = useState(false)
  const headerRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const { setTitle, categories, setCategory, setSubCategory, cart } =
    useContext(StoreContext)
  let title = ""

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

  return (
    <header ref={headerRef} className={css.header}>
      <div className="mycontainer flex h-[90px] items-center justify-between">
        <img
          onClick={() => {
            navigate("/")
            setCategory([])
            setSubCategory([])
          }}
          className={css.logo}
          src={logo}
          alt="Logo"
        />

        <div className="flex items-center gap-4">
          <div className={css.searchContainer}>
            <input
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

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                onClick={() => toggleDropdown("cart")}
                onDoubleClick={() => {
                  navigate("/cart")
                  setActiveDropdown(null)
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
                  onClick={() => toggleDropdown("user")}
                  onDoubleClick={() => {
                    !user && navigate("/loginsingup")
                    user && navigate("/user")
                    setActiveDropdown(null)
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

            <nav className={css.navBar}>
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
            </nav>
          </div>
        </div>
      </div>
      <Link
        to="/trip-planner"
        className="text-white transition-colors hover:text-[#e8f5e9]"
      >
        Trip Planner
      </Link>
    </header>
  )
}
