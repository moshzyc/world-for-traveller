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

export const Rating = ({
  productId,
  rating,
  onRatingUpdate,
  showUserRating = true,
  isPost = false,
}) => {
  const [hover, setHover] = useState(null)
  const [userRating, setUserRating] = useState(0)
  const { user } = useContext(UserContext)
  const { setRate } = useContext(StoreContext)

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

  const handleRating = async (currentRating) => {
    if (!user) {
      alert("Please login to rate")
      return
    }

    try {
      const endpoint = isPost
        ? `${POSTS_URL}/rate/${productId}`
        : `${PRODUCTS_URL}/rate/${productId}`

      await axios.post(endpoint, {
        rating: currentRating,
      })

      // Fetch updated data
      const { data } = await axios.get(
        isPost
          ? `${GET_POST_BY_ID_URL}/${productId}`
          : `${PRODUCTS_URL}/product/${productId}`
      )

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
                    ? "#ffc107"
                    : "#e4e5e9"
                }
              />
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{rating.rate.toFixed(1)}</span>
        <span className="text-sm text-gray-600">
          ({rating.count} {rating.count === 1 ? "rating" : "ratings"})
        </span>
        {showUserRating && userRating > 0 && (
          <span className="text-sm text-green-600">
            (You rated: {userRating})
          </span>
        )}
      </div>
    </div>
  )
}
