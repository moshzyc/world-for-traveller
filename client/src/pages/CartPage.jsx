/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react"
import CartTable from "../components/CartTable"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { UserContext } from "../contexts/UserContextpProvider"
import { Order } from "../components/Order"
import css from "../css/store.module.css" // Import the shared styles

// דף עגלת קניות - מציג את המוצרים בעגלה ומאפשר להשלים הזמנה //
const CartPage = () => {
  // ניהול מצב הזמנה //
  const [order, setOrder] = useState(false) // האם להציג טופס הזמנה

  // קבלת נתוני עגלה ומשתמש מהקונטקסט //
  const { cart } = useContext(StoreContext)
  const { user } = useContext(UserContext)

  return (
    <main className="min-h-screen bg-[#f0f7f0] py-8">
      <div className="mycontainer text-center">
        {/* כותרת העמוד */}
        <h2 className="mb-6 text-2xl font-bold text-[#2e7d32]">
          Shopping Cart
        </h2>
        {/* טבלת מוצרים בעגלה */}
        <CartTable fullScreen />
        {/* כפתור השלמת הזמנה - מוצג רק למשתמש מחובר עם פריטים בעגלה */}
        {user && cart.length > 0 && (
          <button
            className={`${css.btn} mb-4 mt-6 w-full max-w-[300px]`}
            onClick={() => setOrder((p) => !p)}
          >
            Complete Order
          </button>
        )}
        {/* טופס השלמת הזמנה - מוצג רק כשלוחצים על הכפתור */}
        {user && order && <Order exit={setOrder} />}

        {/* הודעה למשתמש לא מחובר */}
        {!user && cart.length > 0 && (
          <p className="mt-4 text-[#558b2f]">
            Please log in to complete your order
          </p>
        )}

        {/* הודעה כשהעגלה ריקה */}
        {cart.length === 0 && (
          <p className="mt-4 text-[#558b2f]">Your cart is empty</p>
        )}
      </div>
    </main>
  )
}
export default CartPage
