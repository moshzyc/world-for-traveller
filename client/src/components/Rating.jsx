import React, { useState, useEffect, useContext } from "react"
import { FaStar } from "react-icons/fa"
import axios from "axios"
import {
  PRODUCTS_URL,
  POSTS_URL,
  GET_POST_BY_ID_URL,
} from "../constants/endPoint"
import { UserContext } from "../contexts/UserContextpProvider"
import { StoreContext } from "../contexts/StoreContaxtProvider"

// קומפוננטת דירוג - מאפשרת למשתמשים לדרג מוצרים ופוסטים //
export const Rating = ({
  productId,
  rating,
  onRatingUpdate,
  showUserRating = true,
  isPost = false,
}) => {
  // ניהול מצב הדירוג //
  const [hover, setHover] = useState(null) // מצב ריחוף העכבר
  const [userRating, setUserRating] = useState(0) // דירוג המשתמש הנוכחי
  const { user } = useContext(UserContext) // פרטי המשתמש מהקונטקסט
  const { setRate } = useContext(StoreContext) // עדכון הדירוג בסטור

  // טעינת דירוג המשתמש הקיים //
  useEffect(() => {
    if (user && rating.userRatings) {
      const existingRating = rating.userRatings.find(
        (r) => r.userId === user._id
      )
      if (existingRating) {
        setUserRating(existingRating.rating)
      }
    }
  }, [user, rating])

  // טיפול בדירוג חדש //
  const handleRating = async (currentRating) => {
    // בדיקת התחברות משתמש //
    if (!user) {
      alert("Please login to rate")
      return
    }

    try {
      // בחירת נקודת קצה בהתאם לסוג הפריט (פוסט או מוצר) //
      const endpoint = isPost
        ? `${POSTS_URL}/rate/${productId}`
        : `${PRODUCTS_URL}/rate/${productId}`

      // שליחת הדירוג לשרת //
      await axios.post(endpoint, {
        rating: currentRating,
      })

      // קבלת נתונים מעודכנים //
      const { data } = await axios.get(
        isPost
          ? `${GET_POST_BY_ID_URL}/${productId}`
          : `${PRODUCTS_URL}/product/${productId}`
      )

      // עדכון הדירוג בממשק //
      if (onRatingUpdate) {
        onRatingUpdate(data.rating)
      }
      setUserRating(currentRating)
    } catch (error) {
      console.error("Error rating:", error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* תצוגת כוכבי הדירוג */}
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1

          return (
            <button
              key={index}
              className="cursor-pointer border-none bg-transparent p-0"
              onClick={() => {
                handleRating(ratingValue)
                setRate(ratingValue)
              }}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            >
              <FaStar
                className="transition-colors"
                size={20}
                color={
                  ratingValue <= (hover || userRating || rating.rate)
                    ? "#ffc107" // צבע כוכב מלא
                    : "#e4e5e9" // צבע כוכב ריק
                }
              />
            </button>
          )
        })}
      </div>

      {/* תצוגת מידע על הדירוג */}
      <div className="flex items-center gap-2">
        {/* דירוג ממוצע */}
        <span className="text-sm font-medium">{rating.rate.toFixed(1)}</span>
        {/* מספר דירוגים */}
        <span className="text-sm text-gray-600">
          ({rating.count} {rating.count === 1 ? "rating" : "ratings"})
        </span>
        {/* הצגת הדירוג של המשתמש */}
        {showUserRating && userRating > 0 && (
          <span className="text-sm text-green-600">
            (You rated: {userRating})
          </span>
        )}
      </div>
    </div>
  )
}
