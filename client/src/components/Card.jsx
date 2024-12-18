import React, { useContext } from 'react'
import css from "../css/store.module.css"
import { StoreContext } from '../contexts/StoreContaxtProvider'

export const Card = (props) => {
  const {addItem} = useContext(StoreContext)

    const item = {
      title: props.title,
      category: props.category,
      price: props.price,
      quantity: 1,
      productId: props._id,
    }
    
  return (
    <div className={css.card}>
      <div>
        <img
          className={css.img}
          src={props.img}
          alt=""
        />
        <h3 className={css.title}>{props.title}</h3>
        <h4 className={css.category}>catrgory: {props.category}</h4>
        <h4 className={`${css.category} text-base font-light`}>sub-catrgory: {props.subCategory}</h4>
        <p>$ {props.price}</p>
      </div>
      <div className="flex flex-col gap-1">
        <button className={css.btn}>to the product</button>
        <button onClick={()=>{addItem(item)}} className={css.btn}>add to cart</button>
      </div>
    </div>
  )
}
