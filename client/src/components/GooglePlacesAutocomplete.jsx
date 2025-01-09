import React, { useState } from "react"

// קומפוננטת חיפוש מיקומים עם השלמה אוטומטית //
export const LocationSearchInput = ({ onPlaceSelect, className }) => {
  // סטייט עבור ערך החיפוש והצעות המיקומים //
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])

  // טיפול בחיפוש מיקומים //
  const handleSearch = async (value) => {
    setSearchTerm(value)
    // בדיקה שהערך מכיל לפחות 3 תווים //
    if (value.length > 2) {
      try {
        // שליחת בקשה ל-API של OpenStreetMap //
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
        )
        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        console.error("Error fetching locations:", error)
      }
    } else {
      setSuggestions([])
    }
  }

  // טיפול בבחירת מיקום מהרשימה //
  const handleSelect = (place) => {
    setSearchTerm(place.display_name)
    setSuggestions([])
    // העברת המידע לקומפוננטה האב //
    onPlaceSelect({
      formatted_address: place.display_name,
      geometry: {
        location: {
          lat: () => parseFloat(place.lat),
          lng: () => parseFloat(place.lon),
        },
      },
    })
  }

  return (
    <div className="relative w-full">
      {/* שדה קלט החיפוש */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for a location..."
        className={`h-10 w-full rounded-lg border border-gray-300 px-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 ${className}`}
      />
      {/* רשימת ההצעות */}
      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg">
          {suggestions.map((place) => (
            <div
              key={place.place_id}
              className="cursor-pointer border-b border-gray-100 px-4 py-3 text-sm hover:bg-gray-50"
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
