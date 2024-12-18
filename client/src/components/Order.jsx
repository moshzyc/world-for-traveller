import React, { useContext, useState } from "react"
import { UserContext } from "../contexts/UserContextpProvider"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import axios from "axios"
import { ORDER_URL } from "../constants/endPoint"
import CartTable from "./CartTable"
import { useNavigate } from "react-router-dom"

export const Order = () => {
  const { user } = useContext(UserContext)
  const { cart, clearCart } = useContext(StoreContext)
  const [address, setAddress] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const orderData = {
      userId: user._id,
      cart: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      address: address,
    }

    try {
      const response = await axios.post(ORDER_URL, orderData)
      //   alert("Order placed successfully!")
      clearCart()
      navigate("/")
    } catch (error) {
      console.error("Error placing order", error)
      alert("Failed to order.")
    }
  }

  return (
    <div className="mycontainer">
      <CartTable fullScreen />
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg rounded-lg bg-white p-4 shadow-md"
      >
        <p className="mb-2 text-lg font-semibold">
          Your name: <span className="font-normal">{user.name}</span>
        </p>
        <p className="mb-4 text-lg font-semibold">
          Your email: <span className="font-normal">{user.email}</span>
        </p>

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
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Place Order
        </button>
      </form>
    </div>
  )
}
