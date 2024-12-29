import React, { useContext } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import css from "../css/header.module.css"
import { useNavigate } from "react-router-dom"

export const Category = ({ category, subCategory }) => {
  const navigate = useNavigate()
  const {
    setCategory,
    setSubCategory,
    setTitle,
    activeMobileCategory,
    setActiveMobileCategory,
  } = useContext(StoreContext)

  const isMobile = window.innerWidth <= 768

  const handleCategoryClick = (e) => {
    if (isMobile) {
      e.preventDefault()
      // If clicking the same category, close it. If different category, open it
      setActiveMobileCategory(
        activeMobileCategory === category ? null : category
      )
    } else {
      setCategory(category)
      setSubCategory([])
      setTitle("")
      navigate(`/store`)
    }
  }

  const handleSubCategoryClick = (subCat) => {
    setCategory(category)
    setSubCategory(subCat)
    setTitle("")
    setActiveMobileCategory(null) // Close after selection
    navigate(`/store`)
  }

  return (
    <div
      className={`${css.categoryItem} ${activeMobileCategory === category ? css.active : ""}`}
      onClick={handleCategoryClick}
    >
      {category}
      {subCategory && subCategory.length > 0 && (
        <div
          className={`${css.subCategories} ${activeMobileCategory === category && isMobile ? css.showMobile : ""}`}
        >
          {subCategory.map((subCat, index) => (
            <div
              key={index}
              className={css.subCategoryItem}
              onClick={(e) => {
                e.stopPropagation()
                handleSubCategoryClick(subCat)
              }}
            >
              {subCat}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
