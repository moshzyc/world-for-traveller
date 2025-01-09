import React from "react"
import { useNavigate } from "react-router-dom"

// קומפוננטת כרטיס מדריך - מציגה תצוגה מקדימה של מדריך //
export const GuideCard = ({ guide }) => {
  const navigate = useNavigate()

  // פונקציה לקיצור התוכן ל-150 תווים והוספת נקודות אם ארוך יותר //
  const renderContent = (content) => {
    return content.substring(0, 150) + (content.length > 150 ? "..." : "")
  }

  return (
    <div
      onClick={() => navigate(`/guides/${guide._id}`)}
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      {/* מיכל התמונה הראשית */}
      <div className="relative h-48 w-full">
        <img
          src={guide.mainImage}
          alt={guide.title}
          className="h-full w-full object-cover"
        />
      </div>
      {/* אזור התוכן */}
      <div className="p-4">
        {/* כותרת המדריך */}
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          {guide.title}
        </h3>
        {/* תקציר התוכן */}
        <p className="whitespace-pre-line text-gray-600">
          {renderContent(guide.content)}
        </p>
      </div>
    </div>
  )
}
