import React, { useContext, useEffect, useState } from "react"
import css from "../css/header.module.css"
import cartIcon from "../assets/cart-shopping-svgrepo-com.svg"
import userIcon from "../assets/user-svgrepo-com.svg"
import logo from "../assets/Untitled.png"
import searchIcon from "../assets/search-alt-2-svgrepo-com.svg"
import UserForm from "./UserForm"
import { UserContext } from "../contexts/UserContextpProvider"
import { UserProfile } from "./UserProfile"
import { useNavigate } from "react-router-dom"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { GET_CATEGORIES_URL } from "../constants/endPoint"
import axios from "axios"
import { Category } from "./Category"
import CartTable from "./CartTable"

export const Header = () => {
  const [rotateBox, setRotateBox] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [seeCart, setSeeCart] = useState(false)
  const [seeUserBoxs, setSeeUserBox] = useState(false)
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const { setTitle, categories } = useContext(StoreContext)

  const categoriesGenerator = (arr) => {
    const categoriesArr = arr.map((item) => {
      return (
        <Category
          key={item._id}
          category={item.category}
          _id={item._id}
          subCategory={item.subCategory}
        />
      )
    })
    return categoriesArr
  }

  // const searchFilter = (value) => {
  //   const filteredArr = rabbis.filter((item) => {
  //     return String(item)
  //       .toLowerCase()
  //       .includes(value.toLowerCase())
  //   })
  //   return filteredArr
  // }

  return (
    <header>
      <div className="mycontainer flex h-[90px] justify-between">
        <img
          onClick={() => {
            navigate("/")
          }}
          className="h-[80px] rounded-md"
          src={logo}
          alt=""
        />

        <div className="flex">
          <div className="flex h-[30px]">
            <button
              onClick={() => setTitle(title)}
              className={`${css.sBtn} ${css.icons}`}
            >
              <img src={searchIcon} alt="" />
            </button>
            <input
              onChange={(e) => (title = e.target.value)}
              className={css.input}
              type="text"
              placeholder="search products"
            />
          </div>
          <div className="flex gap-1">
            <div>
              <img
                onClick={() => setSeeCart((p) => !p)}
                onDoubleClick={() => navigate("/cart")}
                className={css.icons}
                src={cartIcon}
                alt=""
              />
              <div className={`${!seeCart ? "hidden" : "block"} absolute`}>
                <CartTable />
              </div>
            </div>
            <div>
              <img
                onClick={() => setSeeUserBox((p) => !p)}
                onDoubleClick={() => {
                  !user && navigate("/loginsingup")
                  user && navigate("/user")
                }}
                className={`${css.icons} ${user && "text-red-700"}`}
                src={userIcon}
                alt=""
              />
              <div
                className={`${css.userForm} ${!seeUserBoxs ? "hidden" : "block"}`}
              >
                {user ? (
                  <UserProfile setIsSignup={setIsSignup} />
                ) : (
                  <UserForm formChenge={setIsSignup} isSignup={isSignup} />
                )}
              </div>
            </div>
          </div>
          <nav className={css.navBar}>
            <div
              onClick={() => {
                setRotateBox(!rotateBox)
              }}
              className={`${css.linseBox} ${rotateBox && css.linseBoxRotate}`}
            >
              <div className={`${css.lines}`}></div>
              <div className={`${css.lines}`}></div>
              <div className={`${css.lines}`}></div>
            </div>
            <div
              className={`${css.navBlock} ${rotateBox && css.navBlockApear}`}
            >
              {categoriesGenerator(categories)}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
