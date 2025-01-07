import React from "react"
import { useNavigate } from "react-router-dom"

export const GuideCard = ({ guide }) => {
  const navigate = useNavigate()

  const renderContent = (content) => {
    return content.substring(0, 150) + (content.length > 150 ? "..." : "")
  }

  return (
    <div
      onClick={() => navigate(`/guides/${guide._id}`)}
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 w-full">
        <img
          src={guide.mainImage}
          alt={guide.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          {guide.title}
        </h3>
        <p className="whitespace-pre-line text-gray-600">
          {renderContent(guide.content)}
        </p>
      </div>
    </div>
  )
}
