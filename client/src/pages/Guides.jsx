import React, { useState, useEffect } from "react"
import axios from "axios"
import { GET_GUIDE_URL } from "../constants/endPoint"
import { GuideCard } from "../components/GuideCard"

// דף מדריכי טיולים - מציג את כל המדריכים הזמינים //
export const Guides = () => {
  // ניהול מצב //
  const [guides, setGuides] = useState([]) // רשימת המדריכים
  const [loading, setLoading] = useState(true) // מצב טעינה
  const [error, setError] = useState(null) // הודעות שגיאה

  // טעינת המדריכים בטעינה ראשונית //
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get(GET_GUIDE_URL)
        setGuides(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching guides:", err)
        setError("Failed to load guides")
        setLoading(false)
      }
    }

    fetchGuides()
  }, [])

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

  // תצוגת רשימת המדריכים //
  return (
    <div className="mycontainer py-8">
      {/* כותרת הדף */}
      <h1 className="mb-8 text-3xl font-bold text-[#2e7d32]">Travel Guides</h1>

      {/* רשת כרטיסי מדריכים */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide._id} guide={guide} />
        ))}
      </div>
    </div>
  )
}
