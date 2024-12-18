import React, { useContext } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import css from "../css/header.module.css"
import useMediaQuery from "../Hooks/useMediaQuery"
import { useNavigate } from "react-router-dom"

export const Category = (props) => {
  const { setCategory, setSubCategory } = useContext(StoreContext)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const navigate = useNavigate()
  const subCategoryGenerator = (arr) => {
    const subArr = arr.map((item, index) => {
      return (
        <div
          onClick={() => {
            setSubCategory(item)
            setCategory(props.category)
            navigate("/")
          }}
          className={css.subCategory}
          key={props._id + index}
        >
          {item}
        </div>
      )
    })
    return subArr
  }

  return (
    <div className={css.categoryBlock}>
      <div
        // onDoubleClick={() => {
        //   if (isMobile) {
        //     setCategory(props.category)
        //     setSubCategory([])
        //   }
        // }}
        onClick={() => {
        //   if (!isMobile) {
            setCategory(props.category)
            setSubCategory([])
            navigate("/")
        //   }
        }}
        key={props._id}
        className={css.navlink}
      >
        {props.category}
      </div>
      <div className={css.subCategories}>
        {subCategoryGenerator(props.subCategory)}
      </div>
    </div>
  )
}
