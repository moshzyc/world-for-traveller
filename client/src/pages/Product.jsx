import React, { useContext, useEffect, useState } from "react"
import css from "../css/store.module.css"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { useLocation, useParams } from "react-router-dom"
import axios from "axios"
import { PRODUCTS_URL } from "../constants/endPoint"
import { WhatsappShareButton, FacebookShareButton } from "react-share"
import { FaWhatsapp, FaFacebook } from "react-icons/fa"

export const Product = () => {
  const { addItem } = useContext(StoreContext)
  const location = useLocation()
  const { id } = useParams()
  const [product, setProduct] = useState({})
  const shareUrl = `http://localhost:5173/product/${id}`
  console.log(shareUrl);
  
  const title = "Check out this awesome content!"

  useEffect(() => {
    getProduct()
  }, [])

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${PRODUCTS_URL}/product/${id}`)
      // console.log(data)
      setProduct(data)
    } catch (error) {
      console.error(error)
    }
  }

  const item = {
    title: product.title,
    category: product.category,
    price: product.price,
    quantity: 1,
    productId: product.productId,
  }

  return (
    <div className="mycontainer">
      <div>
        <img
          className={`${css.pImg}`}
          src={
            product.img ||
            "data:image/jpeg;base64,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"
          }
          alt=""
        />
        <h3 className={css.title}>{product.title}</h3>
        <h4 className={css.category}>catrgory: {product.category}</h4>
        <h4 className={`${css.category} text-base font-light`}>
          sub-catrgory: {product.subCategory}
        </h4>
        <p>{product.description}</p>
        <p>$ {product.price}</p>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => {
            addItem(item)
          }}
          className={`${css.btn} w-[300px]`}
        >
          add to cart
        </button>
        <div>
          <WhatsappShareButton url={shareUrl} title={title}>
            <FaWhatsapp />
          </WhatsappShareButton>
          <FacebookShareButton url={shareUrl} quote={title}>
            <FaFacebook />
          </FacebookShareButton>
        </div>
      </div>
    </div>
  )
}
