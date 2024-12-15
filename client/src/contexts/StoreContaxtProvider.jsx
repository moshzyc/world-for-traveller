import React, { createContext, useEffect, useState } from 'react'
export const StoreContext = createContext()
export const StoreContaxtProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartSum, setCartSum] = useState(0)
  const SAVE = 0.5
  const roundToTwo = (num) => {
    return Math.round(num * 100) / 100
  }
  useEffect(() => {
    const sortedData = localStorage.getItem("cart")
    const itemsArrey = sortedData ? JSON.parse(sortedData) : []
    setCart(itemsArrey)
    const totalSum = itemsArrey.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    )
    setCartSum(totalSum)
  }, [])
 const addItem = (item) => {
   let exist = false

   const updatedCart = cart.map((element) => {
     if (element.title === item.title) {
       exist = true
       return {
         ...element,
         price: roundToTwo(element.price + item.price),
         amount: element.amount + item.amount,
       }
     }
     return element
   })

   if (!exist) {
     updatedCart.push(item)
   }

   setCart(updatedCart)
   setCartSum(roundToTwo(cartSum + item.price))

   const sortedData = localStorage.getItem("cart")
   const existingItems = sortedData ? JSON.parse(sortedData) : []

   exist = false
   const updatedLocalCart = existingItems.map((element) => {
     if (element.title === item.title) {
       exist = true
       return {
         ...element,
         price: roundToTwo(element.price + item.price),
         amount: element.amount + item.amount,
       }
     }
     return element
   })

   if (!exist) {
     updatedLocalCart.push(item)
   }

   localStorage.setItem("cart", JSON.stringify(updatedLocalCart))
 }

  const deletItem = (number) => {
    setCartSum(roundToTwo(cartSum - cart[number - 1].price))
    const newCart = cart.filter((item, index) => index + 1 != number)
    setCart(newCart)
    if ([...cart]) localStorage.setItem("cart", JSON.stringify(newCart))
    else localStorage.clear()
  }
  const minusAmount = (number) => {
    const index = number - 1
    const updatedCart = [...cart]
    const item = updatedCart[index]

    if (item.amount > 1) {
      const pricePerUnit = roundToTwo(item.price / item.amount)
      item.amount--
      item.price = roundToTwo(item.price - pricePerUnit)
      setCartSum(roundToTwo(cartSum - pricePerUnit))
    } else {
      updatedCart.splice(index, 1)
      setCartSum(roundToTwo(cartSum - item.price))
    }

    setCart(updatedCart)
    if (updatedCart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    } else {
      localStorage.clear()
    }
  }
 const addAnother = (number) => {
   const index = number - 1
   const updatedCart = [...cart]
   const item = updatedCart[index]
   const pricePerUnit = roundToTwo(item.price / item.amount)

   item.amount++
   item.price = roundToTwo(item.price + pricePerUnit)

   setCart(updatedCart)
   setCartSum(roundToTwo(cartSum + pricePerUnit))
   localStorage.setItem("cart", JSON.stringify(updatedCart))
 }
  return (
    <StoreContext.Provider
      value={{
        SAVE,
        cart,
        cartSum,
        setCartSum,
        setCart,
        addItem,
        deletItem,
        roundToTwo,
        minusAmount,
        addAnother,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
