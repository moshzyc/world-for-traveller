import React, { useContext, useState } from "react"
import CartTable from "../components/CartTable"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { UserContext } from "../contexts/UserContextpProvider"
import { Order } from "../components/Order"


const CartPage = () => {
  const [order, setOrder] = useState(false)
  const {cart} = useContext(StoreContext)
  const {user} = useContext(UserContext)


  return (
    <main>
      <div className="mycontainer">
      <CartTable fullScreen />
      <button onClick={()=>{setOrder(p=>!p)}}>complete order</button>
      {order&&<div><Order/></div>}
      </div>
    </main>
  )
}

export default CartPage
