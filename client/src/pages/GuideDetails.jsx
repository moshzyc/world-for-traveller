import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { GET_GUIDE_URL } from "../constants/endPoint"

export const GuideDetails = () => {
  const { id } = useParams()
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2e7d32] border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="mycontainer py-8">
      <article className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold text-[#2e7d32]">
          {guide.title}
        </h1>

        <div className="mb-8">
          <img
            src={guide.mainImage}
            alt={guide.title}
            className="h-[400px] w-full rounded-lg object-cover"
          />
        </div>

        <div className="space-y-6">
          {guide.content.map((paragraph, index) => (
            <p key={index} className="text-lg leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>

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
