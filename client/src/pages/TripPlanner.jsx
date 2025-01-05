import React, { useState, useContext } from "react"
import { UserContext } from "../contexts/UserContextpProvider"
import { GoogleMap } from "../components/trip/GoogleMap"
import { WeatherInfo } from "../components/trip/WeatherInfo"
import { TripDetails } from "../components/trip/TripDetails"
import { ShareTrip } from "../components/trip/ShareTrip"
import { NearbyAttractions } from "../components/trip/NearbyAttractions"
import { RecommendedProducts } from "../components/trip/RecommendedProducts"
import axios from "axios"
import { USER_URL } from "../constants/endPoint"
import { useNavigate } from "react-router-dom"

export const TripPlanner = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [selectedLocations, setSelectedLocations] = useState([])
  const [tripDates, setTripDates] = useState({ start: null, end: null })
  const [weatherData, setWeatherData] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [tripName, setTripName] = useState("")
  const [showSaveModal, setShowSaveModal] = useState(false)

  const removeLocation = (indexToRemove) => {
    setSelectedLocations((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    )
    setWeatherData((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSaveTrip = async () => {
    if (!user) {
      navigate("/loginsingup")
      return
    }

    if (!tripName) {
      alert("Please enter a trip name")
      return
    }

    if (!tripDates.start || !tripDates.end) {
      alert("Please select trip dates")
      return
    }

    try {
      // Format weather data before saving
      const formattedWeatherData = selectedLocations.map((location, index) => {
        const weather = weatherData[index]
        return {
          location: location.name,
          forecast: {
            temperature: weather?.temperature || "N/A", // Make sure we capture the temperature
            conditions: weather?.conditions || "No forecast available",
          },
        }
      })

      console.log("Saving weather data:", formattedWeatherData) // Debug log

      await axios.post(`${USER_URL}save-trip`, {
        name: tripName,
        locations: selectedLocations,
        dates: tripDates,
        weatherData: formattedWeatherData,
      })

      setShowSaveModal(false)
      alert("Trip saved successfully!")
    } catch (error) {
      console.error("Error saving trip:", error)
      alert("Error saving trip. Please try again.")
    }
  }

  return (
    <div className="mycontainer py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#2e7d32]">Trip Planner</h1>

      {/* Save Trip Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowSaveModal(true)}
          className="rounded-lg bg-[#2e7d32] px-4 py-2 text-white hover:bg-[#1b5e20]"
          disabled={selectedLocations.length === 0}
        >
          Save Trip
        </button>
      </div>

      {/* Save Trip Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Save Trip</h2>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="Enter trip name"
              className="mb-4 w-full rounded-lg border border-gray-300 p-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrip}
                className="rounded-lg bg-[#2e7d32] px-4 py-2 text-white hover:bg-[#1b5e20]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Map and Recommended Products */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Select Destinations</h2>
            <GoogleMap
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              removeLocation={removeLocation}
            />
          </div>

          {/* Recommended Products - Desktop Position */}
          <div className="hidden lg:block">
            {recommendedProducts.length > 0 && (
              <div className="rounded-lg bg-white p-4 shadow-md">
                <RecommendedProducts products={recommendedProducts} />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Trip Details, Weather, Share, and Nearby Attractions */}
        <div className="space-y-6">
          <TripDetails
            selectedLocations={selectedLocations}
            tripDates={tripDates}
            setTripDates={setTripDates}
            removeLocation={removeLocation}
          />

          <WeatherInfo
            locations={selectedLocations}
            dates={tripDates}
            weatherData={weatherData}
            setWeatherData={setWeatherData}
            setRecommendedProducts={setRecommendedProducts}
          />

          <ShareTrip
            locations={selectedLocations}
            dates={tripDates}
            weatherData={weatherData}
          />

          <NearbyAttractions locations={selectedLocations} />
        </div>

        {/* Recommended Products - Mobile Position */}
        <div className="mx-auto w-[80%] lg:hidden">
          {recommendedProducts.length > 0 && (
            <div className="rounded-lg bg-white p-4 shadow-md">
              <RecommendedProducts products={recommendedProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
