import React, { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import {
  CART_URL,
  GET_CATEGORIES_URL,
  PRODUCTS_URL,
} from "../constants/endPoint"
import { UserContext } from "../contexts/UserContextpProvider"
export const StoreContext = createContext()

// קונטקסט לניהול החנות - מנהל את המוצרים, העגלה והקטגוריות //
export const StoreContaxtProvider = ({ children }) => {
  // משתני מצב לניהול החנות //
  const { user } = useContext(UserContext)
  const [cart, setCart] = useState([]) // עגלת קניות
  const [cartSum, setCartSum] = useState(0) // סכום העגלה
  const [products, setProducts] = useState([]) // מוצרים מסוננים
  const [allProducts, setAllProducts] = useState([]) // כל המוצרים
  const [category, setCategory] = useState("") // קטגוריה נבחרת
  const [subCategory, setSubCategory] = useState("") // תת-קטגוריה
  const [title, setTitle] = useState("") // חיפוש לפי כותרת
  const [categories, setCategories] = useState([]) // רשימת קטגוריות
  const [activeMobileCategory, setActiveMobileCategory] = useState(null) // קטגוריה פעילה במובייל
  const [rate, setRate] = useState(0) // דירוג
  const [error, setError] = useState(null) // הודעות שגיאה
  const [success, setSuccess] = useState(null) // הודעות הצלחה

  // טעינת מוצרים מסוננים בעת שינוי פילטרים //
  useEffect(() => {
    getProductsFilterd()
  }, [category, subCategory, title, rate])

  // טעינת קטגוריות בטעינה ראשונית //
  useEffect(() => {
    getCategories()
  }, [])

  // פונקציה לטעינת קטגוריות //
  const getCategories = async () => {
    try {
      const { data } = await axios.get(GET_CATEGORIES_URL)
      setCategories(data)
      setError(null)
    } catch (error) {
      setError("Failed to fetch categories")
      console.error(error)
    }
  }

  // פונקציה לטעינת מוצרים מסוננים //
  const getProductsFilterd = async () => {
    try {
      const { data } = await axios.get(
        `${PRODUCTS_URL}?cat=${category}&sCat=${subCategory}&title=${title}`
      )
      setProducts(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch products")
      console.error(err)
    }
  }

  // פונקציה לעיגול מספרים לשתי ספרות אחרי הנקודה //
  const roundToTwo = (num) => {
    return Math.round(num * 100) / 100
  }

  // טעינת עגלת קניות בהתאם למצב המשתמש //
  useEffect(() => {
    if (!user) {
      // טעינה מהסשן אם המשתמש לא מחובר
      const sortedData = sessionStorage.getItem("cart")
      const itemsArrey = sortedData ? JSON.parse(sortedData) : []
      setCart(itemsArrey)
      const totalSum = itemsArrey.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      )
      setCartSum(totalSum)
    } else {
      // טעינה מהשרת אם המשתמש מחובר
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
      console.error(error)
      setError("Failed to fetch cart")
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
      sessionStorage.setItem("cart", JSON.stringify(updatedCart))
    } else {
      updateCart(updatedCart)
    }
  }

  // מחיקת פריט מהעגלה //
  const deletItem = (number) => {
    const updatedCart = cart.filter((item, index) => index + 1 !== number)
    const removedItem = cart[number - 1]

    // עדכון cartSum לפני שליחת הבקשה לשרת
    const updatedSum = roundToTwo(cartSum - removedItem.price)
    setCartSum(updatedSum) // עדכון הסכום

    setCart(updatedCart) // עדכון העגלה ב-state

    if (!user) {
      if (updatedCart.length > 0) {
        sessionStorage.setItem("cart", JSON.stringify(updatedCart))
      } else {
        sessionStorage.clear()
      }
    } else {
      updateCart(updatedCart) // שליחה לשרת
    }
  }

  // הפחתת כמות פריט //
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
        sessionStorage.setItem("cart", JSON.stringify(updatedCart))
      } else {
        sessionStorage.clear()
      }
    } else {
      updateCart(updatedCart) // עדכון השרת
    }
  }

  // הוספת כמות לפריט //
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
      sessionStorage.setItem("cart", JSON.stringify(updatedCart))
    } else {
      updateCart(updatedCart) // עדכון השרת
    }
  }

  // ניקוי העגלה //
  const clearCart = () => {
    setCart([])
    setCartSum(0)

    if (!user) {
      sessionStorage.removeItem("cart") // אם המשתמש לא מחובר, מסירים את העגלה מ- sessionStorage
    } else {
      updateCart([]) // אם המשתמש מחובר, שולחים עגלה ריקה לשרת
    }
  }

  // עדכון העגלה בעת התחברות //
  const updateCartOnLogin = async () => {
    try {
      // מיזוג עגלה מקומית עם עגלת שרת
      const { data } = await axios.get(CART_URL)
      let formattedData = data.map((item) => ({
        productId: item.productId,
        title: item.title,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
      }))

      // Add quantities for existing items and add new items
      cart.forEach((stateItem) => {
        const existingItem = formattedData.find(
          (serverItem) => serverItem.productId === stateItem.productId
        )

        if (existingItem) {
          // If item exists in server cart, add quantities
          existingItem.quantity += stateItem.quantity
          existingItem.price = roundToTwo(
            (existingItem.price / existingItem.quantity) * existingItem.quantity
          )
        } else {
          // If item doesn't exist in server cart, add it
          formattedData.push(stateItem)
        }
      })

      // Update server with merged cart
      await updateCart(formattedData)

      // Update local state
      setCart(formattedData)
      const totalSum = formattedData.reduce((sum, item) => sum + item.price, 0)
      setCartSum(totalSum)
    } catch (error) {
      console.error("Error merging carts:", error)
      setError("Failed to sync cart with server")
    }
  }

  // העברת ערכים לקונטקסט //
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
        updateCart,
        updateCartOnLogin,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
