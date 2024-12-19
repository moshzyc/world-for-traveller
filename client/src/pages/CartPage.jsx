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
      <div className="mycontainer text-center">
      <CartTable fullScreen />
      <button className="bg-green-400 p-1 rounded-lg m-4 font-semibold hover:bg-green-300 active: scale-[0.98]"onClick={()=>{setOrder(p=>!p)}}>complete order</button>
      {order&&<div><Order exit={setOrder}/></div>}
      </div>
    </main>
  )
}

export default CartPage
