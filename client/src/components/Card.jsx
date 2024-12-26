import React, { useContext } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import css from "../css/store.module.css"

export const Card = ({ item }) => {
  const { addToCart } = useContext(StoreContext)

  return (
    <div className={css.card}>
      <div className={css.imgBox}>
        <img
          src={Array.isArray(item.images) ? item.images[0] : item.images}
          alt={item.title}
          className={css.img}
        />
      </div>
      <div className={css.content}>
        <h3 className={css.title}>{item.title}</h3>
        <p className={css.description}>{item.description}</p>
        <div className={css.priceBox}>
          <span className={css.price}>{item.price} ILS</span>
          <button
            data-add-to-cart
            onClick={() => addToCart(item)}
            className={css.btn}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
