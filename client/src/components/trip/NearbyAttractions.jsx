import React, { useState, useEffect } from "react"
import axios from "axios"
import { PLACES_URL } from "../../constants/endPoint"

export const NearbyAttractions = ({ locations }) => {
  const [attractions, setAttractions] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAttractions = async () => {
      setLoading(true)
      const newAttractions = {}

      console.log("Fetching attractions for locations:", locations)

      for (const location of locations) {
        try {
          console.log("Fetching for location:", {
            name: location.name,
            lat: location.lat,
            lng: location.lng,
          })

          const { data } = await axios.get(PLACES_URL, {
            params: {
              lat: location.lat,
              lng: location.lng,
            },
          })

          if (!data) {
            throw new Error("No data received from server");
          }

          console.log("Response for", location.name, ":", data)

          if (Array.isArray(data)) {
            newAttractions[location.name] = data.slice(0, 3)
          } else if (data.error) {
            console.error(
              "Server error for",
              location.name,
              ":",
              data.message || "Unknown error"
            )
            newAttractions[location.name] = []
          } else {
            console.error(
              "Unexpected data format for",
              location.name,
              ":",
              data
            )
            newAttractions[location.name] = []
          }
        } catch (error) {
          console.error(
            "Error fetching attractions for",
            location.name,
            ":",
            error.response?.data || error.message
          )
          newAttractions[location.name] = []
        }
      }

      console.log("Final attractions data:", newAttractions)
      setAttractions(newAttractions)
      setLoading(false)
    }

    if (locations.length > 0) {
      fetchAttractions()
    }
  }, [locations])

  if (!locations.length) return null

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Nearby Attractions</h2>

      {loading ? (
        <div className="py-4 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#2e7d32]"></div>
          <p className="mt-2 text-gray-600">Loading attractions...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {locations.map((location, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2e7d32] text-sm text-white">
                  {index + 1}
                </span>
                <h3 className="font-medium">{location.name}</h3>
              </div>
              {Array.isArray(attractions[location.name]) &&
              attractions[location.name].length > 0 ? (
                <div className="space-y-2">
                  {attractions[location.name].map((attraction, i) => (
                    <div key={i} className="rounded-lg bg-gray-50 p-3">
                      <p className="font-medium">{attraction.name}</p>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                        {attraction.rating && (
                          <span>Rating: {attraction.rating} ⭐</span>
                        )}
                        {attraction.user_ratings_total && (
                          <span>({attraction.user_ratings_total} reviews)</span>
                        )}
                      </div>
                      {attraction.vicinity && (
                        <p className="mt-1 text-sm text-gray-500">
                          {attraction.vicinity}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No attractions found nearby</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
