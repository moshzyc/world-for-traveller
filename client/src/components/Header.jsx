import React, { useContext, useState } from "react"
import css from "../css/header.module.css"
import cartIcon from "../assets/cart-shopping-svgrepo-com.svg"
import userIcon from "../assets/user-svgrepo-com.svg"
import UserForm from "./UserForm"
import { UserContext } from "../contexts/UserContextpProvider"
import { UserProfile } from "./UserProfile"



export const Header = () => {
  const [rotateBox, setRotateBox] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const {user} = useContext(UserContext)

  return (
    <header>
      <div className="mycontainer flex h-12 justify-between">
        <div className="h-[30px] w-[150px] bg-sky-950 text-center text-white">
          logo
        </div>
        <div className="flex">
          <button className={css.sBtn}>search</button>
          <input
            className={css.input}
            type="text"
            placeholder="search products"
          />
        </div>
        <div className="flex gap-1">
          <img className={css.icons} src={cartIcon} alt="" />
          <div className={css.userIcon}>
            <img className={css.icons} src={userIcon} alt="" />
            <div className={css.userForm}>
              {!user && (
                <UserForm formChenge={setIsSignup} isSignup={isSignup} />
              )}
              {user && <UserProfile setIsSignup={setIsSignup} />}
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
          <div className={`${css.navBlock} ${rotateBox && css.navBlockApear}`}>
            <p className={css.navlink}>men's clothes</p>
            <p className={css.navlink}>women's clothes</p>
            <p className={css.navlink}>to field</p>
            <p className={css.navlink}>field cooking</p>
          </div>
        </nav>
      </div>
    </header>
  )
}
