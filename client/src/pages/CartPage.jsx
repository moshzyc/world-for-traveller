import React, { useContext, useState } from "react"
import CartTable from "../components/CartTable"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { UserContext } from "../contexts/UserContextpProvider"
import { Order } from "../components/Order"
import css from "../css/store.module.css" // Import the shared styles

const CartPage = () => {
  const [order, setOrder] = useState(false)
  const { cart } = useContext(StoreContext)
  const { user } = useContext(UserContext)

  return (
    <main className="min-h-screen bg-[#f0f7f0] py-8">
      <div className="mycontainer text-center">
        <h2 className="mb-6 text-2xl font-bold text-[#2e7d32]">
          Shopping Cart
        </h2>
        <CartTable fullScreen />
        {user && cart.length > 0 && (
          <button
            className={`${css.btn} mb-4 mt-6 w-full max-w-[300px]`}
            onClick={() => setOrder((p) => !p)}
          >
            Complete Order
          </button>
        )}
        {user && order && <Order exit={setOrder} />}
        {!user && cart.length > 0 && (
          <p className="mt-4 text-[#558b2f]">
            Please log in to complete your order
          </p>
        )}
        {cart.length === 0 && (
          <p className="mt-4 text-[#558b2f]">Your cart is empty</p>
        )}
      </div>
    </main>
  )
}

export default CartPage
