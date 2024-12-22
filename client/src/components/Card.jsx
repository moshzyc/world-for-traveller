import React, { useContext } from 'react'
import css from "../css/store.module.css"
import { StoreContext } from '../contexts/StoreContaxtProvider'
import { useNavigate } from 'react-router-dom'

export const Card = (props) => {
  const {addItem} = useContext(StoreContext)
  const navigate = useNavigate()

    const item = {
      title: props.title,
      category: props.category,
      price: props.price,
      quantity: 1,
      productId: props._id,
    }
const productNavigate = (id) =>{
  navigate(`/product/${id}`,{
    state:{
      img: props.img,
      title:props.title,
      category:props.category,
      description: props.description,
      price: props.price,
      productId:props._id,
    }
  })
}
    
  return (
    <div className={css.card}>
      <div>
        <img
         onClick={()=>productNavigate(props._id)}
          className={css.img}
          src={props.img}
          alt=""
        />
        <h3 onClick={()=>productNavigate(props._id)} className={css.title}>{props.title}</h3>
        <h4 className={css.category}>catrgory: {props.category}</h4>
        <h4 className={`${css.category} text-base font-light`}>sub-catrgory: {props.subCategory}</h4>
        <p>$ {props.price}</p>
      </div>
      <div className="flex flex-col gap-1">
        <button onClick={()=>productNavigate(props._id)}className={css.btn}>to the product</button>
        <button onClick={()=>{addItem(item)}} className={css.btn}>add to cart</button>
      </div>
    </div>
  )
}
