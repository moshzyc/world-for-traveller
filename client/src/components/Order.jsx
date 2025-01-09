import React, { useContext, useState } from "react"
import { UserContext } from "../contexts/UserContextpProvider"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import axios from "axios"
import { ORDER_URL, SEND_EMAIL_URL } from "../constants/endPoint"
import CartTable from "./CartTable"
import { useNavigate } from "react-router-dom"
import css from "../css/Overlay.module.css"
import PayPalCheckout from "./PayPalCheckout"

export const Order = ({ exit }) => {
  const { user } = useContext(UserContext)
  const { cart, clearCart } = useContext(StoreContext)
  const [address, setAddress] = useState("")
  const navigate = useNavigate()

  // פונקציה לעיצוב המחיר בשקלים //
  const formatPrice = (price) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
    }).format(price)
  }

  // טיפול בשליחת ההזמנה //
  const handleSubmit = async () => {
    // בדיקת תקינות הכתובת //
    if (!address.trim()) {
      alert("Please enter a delivery address")
      return
    }

    // יצירת אובייקט ההזמנה //
    const orderData = {
      userId: user._id,
      cart: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        title: item.title,
      })),
      totalAmount: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      address: address.trim(),
    }

    try {
      // שליחת ההזמנה למסד הנתונים //
      const orderResponse = await axios.post(ORDER_URL, orderData)

      // הכנת תבנית המייל //
      const emailData = {
        to: user.email,
        subject: "Order Confirmation",
        html: `
          <h2>Thank you for your order, ${user.name}!</h2>
          <p>Order details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Product</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Quantity</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Price</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${cart
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.title}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${formatPrice(item.price)}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr style="background-color: #f3f4f6;">
                <td colspan="3" style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>${formatPrice(orderData.totalAmount)}</strong></td>
              </tr>
            </tfoot>
          </table>
          <p>Delivery Address: ${address}</p>
          <p>Thank you for shopping with us!</p>
        `,
      }

      // שליחת מייל אישור //
      await axios.post(SEND_EMAIL_URL, emailData)

      // ניקוי העגלה וניווט לדף הבית //
      clearCart()
      navigate("/")
    } catch (error) {
      console.error("Error placing order", error)
      console.error("Server response:", error.response?.data)
      alert("Failed to order. Please try again.")
    }
  }

  return (
    <div className={css.outsideOverlay}>
      {/* תוכן ההזמנה */}
      <div className={css.insideOverlay}>
        {/* כפתור יציאה */}
        <div className="sticky top-0 w-7 text-left">
          <button
            onClick={() => exit((p) => !p)}
            className="w-[25px] rounded-[50%] bg-red-600 hover:bg-red-400 active:scale-[0.98]"
          >
            X
          </button>
        </div>

        {/* טבלת העגלה */}
        <CartTable fullScreen />

        {/* טופס ההזמנה */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-lg rounded-lg bg-white p-4 shadow-md"
        >
          {/* פרטי המשתמש */}
          <p className="mb-2 text-lg font-semibold">
            Your name: <span className="font-normal">{user.name}</span>
          </p>
          <p className="mb-4 text-lg font-semibold">
            Your email: <span className="font-normal">{user.email}</span>
          </p>

          {/* שדה כתובת למשלוח */}
          <div className="mb-4">
            <label
              htmlFor="address"
              className="mb-2 block font-semibold text-gray-700"
            >
              Please enter address for order:
            </label>
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Please enter address"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* רכיב תשלום PayPal */}
          <PayPalCheckout handleSubmit={handleSubmit} />
        </form>
      </div>
    </div>
  )
}
