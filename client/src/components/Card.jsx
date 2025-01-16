/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import css from "../css/store.module.css"
import { useNavigate } from "react-router-dom"
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  TelegramShareButton,
  LinkedinShareButton,
} from "react-share"
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaTelegram,
  FaLinkedin,
  FaShare,
  FaLink,
} from "react-icons/fa"
import { Rating } from "./Rating"
import axios from "axios"
import { USER_URL } from "../constants/endPoint"

export const Card = ({ item, onFavoriteUpdate }) => {
  // שימוש בקונטקסט החנות והוק ניווט
  const { addItem } = useContext(StoreContext)
  const navigate = useNavigate()

  // ניהול מצבי תצוגה ומועדפים
  const [showShareMenu, setShowShareMenu] = useState(false) // תפריט שיתוף
  const [copySuccess, setCopySuccess] = useState(false) // הצלחת העתקת קישור
  const [isFavorite, setIsFavorite] = useState(false) // סטטוס מועדפים

  // בדיקת סטטוס מועדפים בטעינה
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const { data } = await axios.get(`${USER_URL}favorites`)
        const isFavorited = data.some((fav) => fav._id === item._id)
        setIsFavorite(isFavorited)
      } catch (error) {
        console.error("Error checking favorite status:", error)
      }
    }

    checkFavoriteStatus()
  }, [item._id])

  // יצירת נתוני שיתוף
  const shareUrl = `${window.location.origin}/product/${item._id}`
  const shareTitle = `Check out ${item.title}!`
  const shareDescription = item.description || "Great product from our store!"

  // העתקת קישור ללוח
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  // הוספה/הסרה ממועדפים
  const toggleFavorite = async (e) => {
    e.stopPropagation()
    try {
      const { data } = await axios.post(`${USER_URL}toggle-favorite`, {
        productId: item._id,
      })
      setIsFavorite(data.isFavorite)
      onFavoriteUpdate?.()
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  return (
    <div className={`${css.card} m-auto`}>
      {/* תיבת תמונה */}
      <div className={css.imgBox}>
        <img
          src={Array.isArray(item.images) ? item.images[0] : item.images}
          alt={item.title}
          className={css.img}
          onClick={() => navigate(`/product/${item._id}`)}
        />
      </div>

      {/* תוכן הכרטיס */}
      <div className={css.content}>
        <h3
          onClick={() => navigate(`/product/${item._id}`)}
          className={css.title}
        >
          {item.title}
        </h3>

        {/* רכיב דירוג */}
        <Rating
          productId={item._id}
          rating={item.rating}
          showUserRating={false}
          onRatingUpdate={(newRating) => {
            // אופציונלי: עדכון מצב מקומי אם נדרש
          }}
        />

        <p className={css.description}>{item.description}</p>

        {/* אזור מחיר וכפתורים */}
        <div className={css.priceBox}>
          <span className={css.price}>{item.price} ILS</span>
          <div className="flex items-center gap-2">
            {/* כפתור הוספה לעגלה */}
            <button
              data-add-to-cart
              onClick={() => addItem(item)}
              className={css.btn}
            >
              Add to Cart
            </button>

            {/* כפתור שיתוף */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="rounded-full bg-[#f0f7f0] p-2 text-[#2e7d32] transition-colors hover:bg-[#2e7d32] hover:text-white"
                aria-label="Share"
              >
                <FaShare className="text-sm" />
              </button>

              {/* תפריט שיתוף */}
              {showShareMenu && (
                <div className="absolute bottom-full right-0 z-50 mb-2 flex flex-row-reverse gap-2 rounded-lg bg-white p-2 shadow-lg">
                  {/* כפתור העתקת קישור */}
                  <button
                    onClick={handleCopyLink}
                    className="transition-transform hover:scale-110"
                  >
                    <div className="relative rounded-full p-1.5 hover:bg-gray-100">
                      <FaLink className="text-base text-gray-600" />
                      {copySuccess && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                          Link copied!
                        </div>
                      )}
                    </div>
                  </button>

                  {/* כפתורי שיתוף לרשתות חברתיות */}
                  <WhatsappShareButton url={shareUrl} title={shareTitle}>
                    <div className="rounded-full p-1.5 hover:bg-gray-100">
                      <FaWhatsapp className="text-base text-[#25D366]" />
                    </div>
                  </WhatsappShareButton>

                  <FacebookShareButton url={shareUrl} quote={shareTitle}>
                    <div className="rounded-full p-1.5 hover:bg-gray-100">
                      <FaFacebook className="text-base text-[#1877F2]" />
                    </div>
                  </FacebookShareButton>

                  <TwitterShareButton url={shareUrl} title={shareTitle}>
                    <div className="rounded-full p-1.5 hover:bg-gray-100">
                      <FaTwitter className="text-base text-[#1DA1F2]" />
                    </div>
                  </TwitterShareButton>

                  <EmailShareButton
                    url={shareUrl}
                    subject={shareTitle}
                    body={shareDescription}
                  >
                    <div className="rounded-full p-1.5 hover:bg-gray-100">
                      <FaEnvelope className="text-base text-gray-600" />
                    </div>
                  </EmailShareButton>
                </div>
              )}
            </div>

            {/* כפתור מועדפים */}
            <button
              onClick={toggleFavorite}
              className={`rounded-full p-2 transition-colors ${
                isFavorite
                  ? "bg-red-100 text-red-500 hover:bg-red-200"
                  : "bg-[#f0f7f0] text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white"
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
