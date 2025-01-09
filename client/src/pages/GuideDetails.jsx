import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { GET_GUIDE_URL } from "../constants/endPoint"

// דף פרטי מדריך - מציג את כל המידע על מדריך ספציפי //
export const GuideDetails = () => {
  // קבלת מזהה המדריך מה-URL //
  const { id } = useParams()

  // ניהול מצב //
  const [guide, setGuide] = useState(null) // נתוני המדריך
  const [loading, setLoading] = useState(true) // מצב טעינה
  const [error, setError] = useState(null) // הודעות שגיאה

  // טעינת נתוני המדריך בטעינה ראשונית //
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await axios.get(`${GET_GUIDE_URL}/${id}`)
        setGuide(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching guide:", err)
        setError("Failed to load guide")
        setLoading(false)
      }
    }

    fetchGuide()
  }, [id])

  // תצוגת טעינה //
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2e7d32] border-t-transparent"></div>
      </div>
    )
  }

  // תצוגת שגיאה //
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // תצוגת המדריך //
  return (
    <div className="mycontainer py-8">
      <article className="mx-auto max-w-4xl">
        {/* כותרת המדריך */}
        <h1 className="mb-6 text-4xl font-bold text-[#2e7d32]">
          {guide.title}
        </h1>

        {/* תמונה ראשית */}
        <div className="mb-8">
          <img
            src={guide.mainImage}
            alt={guide.title}
            className="h-[400px] w-full rounded-lg object-cover"
          />
        </div>

        {/* תוכן המדריך */}
        <div className="space-y-6">
          <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700">
            {guide.content}
          </p>
        </div>

        {/* גלריית תמונות - מוצגת רק אם יש תמונות נוספות */}
        {guide.images && guide.images.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-[#2e7d32]">
              Gallery
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {guide.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Guide image ${index + 1}`}
                  className="h-48 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
