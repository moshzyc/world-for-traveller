import React, { useContext } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import css from "../css/header.module.css"
import { useNavigate } from "react-router-dom"

export const Category = ({ category, subCategory }) => {
  // הוק ניווט
  const navigate = useNavigate()

  // שימוש בקונטקסט החנות
  const {
    setCategory,
    setSubCategory,
    setTitle,
    activeMobileCategory,
    setActiveMobileCategory,
  } = useContext(StoreContext)

  // בדיקה האם המכשיר הוא נייד
  const isMobile = window.innerWidth <= 768

  // טיפול בלחיצה על קטגוריה
  const handleCategoryClick = (e) => {
    if (isMobile) {
      e.preventDefault()
      // אם לוחצים על אותה קטגוריה - סוגרים אותה, אם על קטגוריה אחרת - פותחים אותה
      setActiveMobileCategory(
        activeMobileCategory === category ? null : category
      )
    } else {
      // במחשב נייח - ניווט ישיר לחנות
      setCategory(category)
      setSubCategory([])
      setTitle("")
      navigate(`/store`)
    }
  }

  // טיפול בלחיצה על תת-קטגוריה
  const handleSubCategoryClick = (subCat) => {
    setCategory(category)
    setSubCategory(subCat)
    setTitle("")
    setActiveMobileCategory(null) // סגירת התפריט לאחר בחירה
    navigate(`/store`)
  }

  return (
    <div
      // מחלקות עיצוב דינמיות בהתאם למצב הקטגוריה
      className={`${css.categoryItem} ${activeMobileCategory === category ? css.active : ""}`}
      onClick={handleCategoryClick}
    >
      {category}
      {/* תצוגת תת-קטגוריות אם קיימות */}
      {subCategory && subCategory.length > 0 && (
        <div
          className={`${css.subCategories} ${activeMobileCategory === category && isMobile ? css.showMobile : ""}`}
        >
          {/* מיפוי תת-הקטגוריות */}
          {subCategory.map((subCat, index) => (
            <div
              key={index}
              className={css.subCategoryItem}
              onClick={(e) => {
                e.stopPropagation() // מניעת הפעלת אירוע הקטגוריה הראשית
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
