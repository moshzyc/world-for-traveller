import React, { useContext, useState } from 'react'
import css from "../css/store.module.css"
import { StoreContext } from '../contexts/StoreContaxtProvider'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { PRODUCTS_URL } from '../constants/endPoint'

export const Product = () => {
  const {addItem} = useContext(StoreContext)
  // const navigate = useNavigate()
  const location = useLocation()
  const[product, setProducts] = useState({})
  const {id} = useParams()
  console.log(id);

  const getProducts = async ()=>{
    try{
      const{data} = axios.get(PRODUCTS_URL+`/${id}`)
        console.log(data);
    
    }
    catch (error){
      console.error(error)

    }
  }
  
  const{img, title, category, subCategory, description,price,productId} = location.state || {}

    const item = {
      title: title,
      category: category,
      price: price,
      quantity: 1,
      productId: productId,
    }
    
  return (
    <div className="mycontainer">
      <div>
        <img
          className={css.pImg}
          src={img}
          alt=""
        />
        <h3 className={css.title}>{title}</h3>
        <h4 className={css.category}>catrgory: {category}</h4>
        <h4 className={`${css.category} text-base font-light`}>sub-catrgory: {subCategory}</h4>
        <p>{description}</p>
        <p>$ {price}</p>
      </div>
      <div className="flex flex-col gap-1">
        <button onClick={()=>{addItem(item)}} className={`${css.btn} w-[300px]`}>add to cart</button>
      </div>
    </div>
  )
}