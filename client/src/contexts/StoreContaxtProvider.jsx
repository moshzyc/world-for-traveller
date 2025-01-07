import React, { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import {
  CART_URL,
  GET_CATEGORIES_URL,
  PRODUCTS_URL,
} from "../constants/endPoint"
import { UserContext } from "../contexts/UserContextpProvider"
export const StoreContext = createContext()

export const StoreContaxtProvider = ({ children }) => {
  const { user } = useContext(UserContext)
  const [cart, setCart] = useState([])
  const [cartSum, setCartSum] = useState(0)
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [title, setTitle] = useState("")
  const [categories, setCategories] = useState([])
  const [activeMobileCategory, setActiveMobileCategory] = useState(null)
  const [rate, setRate] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    getProductsFilterd()
  }, [category, subCategory, title, rate])
  // useEffect(() => {
  //   getProducts()
  // }, [])
  useEffect(() => {
    getCategories()
  }, [])

  // const getProducts = async () => {
  //   try {
  //     const { data } = await axios.get(`${PRODUCTS_URL}`)
  //     setAllProducts(data)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  const getCategories = async () => {
    try {
      const { data } = await axios.get(GET_CATEGORIES_URL)
      setCategories(data)
      // console.log(data)
      setError(null)
    } catch (error) {
      setError("Failed to fetch categories")
      console.error(error)
    }
  }
  const getProductsFilterd = async () => {
    try {
      const { data } = await axios.get(
        `${PRODUCTS_URL}?cat=${category}&sCat=${subCategory}&title=${title}`
      )
      setProducts(data)
      setError(null)
      // console.log(data)
    } catch (err) {
      setError("Failed to fetch products")
      console.error(err)
    }
  }

  const roundToTwo = (num) => {
    return Math.round(num * 100) / 100
  }
  useEffect(() => {
    if (!user) {
      const sortedData = localStorage.getItem("cart")
      const itemsArrey = sortedData ? JSON.parse(sortedData) : []
      setCart(itemsArrey)
      const totalSum = itemsArrey.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      )
      setCartSum(totalSum)
    } else {
      getCart()
    }
  }, [user])
  const getCart = async () => {
    try {
      const { data } = await axios.get(CART_URL)
      const formattedData = data.map((item) => ({
        productId: item.productId,
        title: item.title,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
      }))

      setCart(formattedData)
      const totalSum = formattedData.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      setCartSum(totalSum)
    } catch (error) {
      console.log(error)
    }
  }

  // const updateCart = async (updatedCart) => {
  //   try {
  //     await axios.put(CART_URL, { cart: updatedCart })
  //   } catch (error) {
  //     console.log("Error updating cart:", error)
  //   }
  // }
  const updateCart = async (updatedCart) => {
    try {
      if (!Array.isArray(updatedCart)) {
        throw new Error("updatedCart is not an array")
      }
      await axios.put(CART_URL, { cart: updatedCart })
      setSuccess("Cart updated successfully")
      setError(null)
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError("Failed to update cart")
      console.error("Error updating cart:", error)
    }
  }

  const addItem = (item) => {
    let exist = false
    const pricePerUnit = roundToTwo(item.price)

    const updatedCart = cart.map((element) => {
      if (element.productId === item._id) {
        exist = true
        const newQuantity = element.quantity + 1
        return {
          ...element,
          price: roundToTwo(pricePerUnit * newQuantity),
          quantity: newQuantity,
        }
      }
      return element
    })

    if (!exist) {
      updatedCart.push({
        productId: item._id,
        title: item.title,
        category: item.category,
        price: pricePerUnit,
        quantity: 1,
      })
    }

    setCart(updatedCart)
    setCartSum(
      roundToTwo(updatedCart.reduce((sum, item) => sum + item.price, 0))
    )

    if (!user) {
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    } else {
      updateCart(updatedCart)
    }
  }

  const deletItem = (number) => {
    const updatedCart = cart.filter((item, index) => index + 1 !== number)
    const removedItem = cart[number - 1]

    // עדכון cartSum לפני שליחת הבקשה לשרת
    const updatedSum = roundToTwo(cartSum - removedItem.price)
    setCartSum(updatedSum) // עדכון הסכום

    setCart(updatedCart) // עדכון העגלה ב-state

    if (!user) {
      if (updatedCart.length > 0) {
        localStorage.setItem("cart", JSON.stringify(updatedCart))
      } else {
        localStorage.clear()
      }
    } else {
      updateCart(updatedCart) // שליחה לשרת
    }
  }

  const minusAmount = (number) => {
    const index = number - 1
    const updatedCart = [...cart]
    const item = updatedCart[index]

    if (item.quantity > 1) {
      const pricePerUnit = roundToTwo(item.price / item.quantity)
      item.quantity--
      item.price = roundToTwo(item.price - pricePerUnit)
      setCartSum(roundToTwo(cartSum - pricePerUnit))
    } else {
      setCartSum(roundToTwo(cartSum - item.price))
      updatedCart.splice(index, 1)
    }

    setCart(updatedCart)

    if (!user) {
      if (updatedCart.length > 0) {
        localStorage.setItem("cart", JSON.stringify(updatedCart))
      } else {
        localStorage.clear()
      }
    } else {
      updateCart(updatedCart) // עדכון השרת
    }
  }

  const addAnother = (number) => {
    const index = number - 1
    const updatedCart = [...cart]
    const item = updatedCart[index]
    const pricePerUnit = roundToTwo(item.price / item.quantity)

    item.quantity++
    item.price = roundToTwo(item.price + pricePerUnit)

    setCart(updatedCart)
    setCartSum(roundToTwo(cartSum + pricePerUnit))

    if (!user) {
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    } else {
      updateCart(updatedCart) // עדכון השרת
    }
  }
  const clearCart = () => {
    setCart([]) // מנקה את העגלה ב-state
    setCartSum(0) // מאפס את הסכום של העגלה

    if (!user) {
      localStorage.removeItem("cart") // אם המשתמש לא מחובר, מסירים את העגלה מ- localStorage
    } else {
      updateCart([]) // אם המשתמש מחובר, שולחים עגלה ריקה לשרת
    }
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        setCategory,
        setSubCategory,
        setTitle,
        addItem,
        cart,
        deletItem,
        addAnother,
        minusAmount,
        cartSum,
        clearCart,
        categories,
        activeMobileCategory,
        setActiveMobileCategory,
        subCategory,
        category,
        title,
        setRate,
        error,
        success,
        setError,
        setSuccess,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
