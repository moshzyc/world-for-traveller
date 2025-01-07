import React, { useState, useContext, useEffect } from "react"
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
import { useNavigateWithConfirm } from "../hooks/useNavigateWithConfirm"

export const TripPlanner = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const navigateWithConfirm = useNavigateWithConfirm()
  const [selectedLocations, setSelectedLocations] = useState([])
  const [tripDates, setTripDates] = useState({ start: null, end: null })
  const [weatherData, setWeatherData] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [tripName, setTripName] = useState("")
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (selectedLocations.length > 0 || (tripDates.start && tripDates.end)) {
      setIsDirty(true)
      window.localStorage.setItem("tripPlannerIsDirty", "true")
    } else {
      setIsDirty(false)
      window.localStorage.setItem("tripPlannerIsDirty", "false")
    }
  }, [selectedLocations, tripDates])

  useEffect(() => {
    return () => {
      window.localStorage.removeItem("tripPlannerIsDirty")
    }
  }, [])

  useEffect(() => {
    if (isDirty) {
      console.log("Setting up navigation handlers, isDirty:", isDirty)

      const handleBeforeUnload = (e) => {
        const message =
          "You have unsaved changes. Do you want to leave without saving?"
        e.preventDefault()
        e.returnValue = message
        return message
      }

      const handleNavigation = (e) => {
        if (isDirty) {
          const confirmLeave = window.confirm(
            "You have unsaved changes. Are you sure you want to leave without saving your trip?"
          )
          if (!confirmLeave) {
            e.preventDefault()
            window.history.pushState(null, "", window.location.pathname)
            return false
          }
        }
      }

      const handleClick = (e) => {
        const isNavigationElement = e.target.closest('a, button[type="submit"]')
        if (isNavigationElement && !e.target.closest(".no-confirm")) {
          if (isDirty) {
            const confirmLeave = window.confirm(
              "You have unsaved changes. Are you sure you want to leave without saving your trip?"
            )
            if (!confirmLeave) {
              e.preventDefault()
              e.stopPropagation()
              return false
            }
          }
        }
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      window.addEventListener("popstate", handleNavigation)
      document.addEventListener("click", handleClick, true)

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
        window.removeEventListener("popstate", handleNavigation)
        document.removeEventListener("click", handleClick, true)
      }
    }
  }, [isDirty])

  const removeLocation = (indexToRemove) => {
    setSelectedLocations((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    )
    setWeatherData((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSaveTrip = async () => {
    if (!user) {
      const confirmNavigation = window.confirm(
        "You need to log in to save your trip. Would you like to log in now? (Your trip plan will be preserved)"
      )
      if (!confirmNavigation) {
        window.history.pushState(null, "", window.location.pathname)
        return
      }
      navigateWithConfirm("/loginsingup")
      return
    }

    if (!tripName) {
      alert("Please enter a trip name")
      return
    }

    try {
      const formattedWeatherData = selectedLocations.map((location, index) => {
        const weather = weatherData[index]
        return {
          location: location.name,
          forecast: {
            temperature: weather?.temperature || "N/A",
            conditions: weather?.conditions || "No forecast available",
          },
        }
      })

      await axios.post(`${USER_URL}save-trip`, {
        name: tripName,
        locations: selectedLocations,
        dates: {
          start: tripDates.start || null,
          end: tripDates.end || null,
        },
        weatherData: formattedWeatherData,
      })

      setShowSaveModal(false)
      setIsDirty(false)
      setTripName("")
      setSelectedLocations([])
      setTripDates({ start: null, end: null })
      setWeatherData([])
      alert("Trip saved successfully!")
      window.localStorage.setItem("tripPlannerIsDirty", "false")
    } catch (error) {
      console.error("Error saving trip:", error)
      alert("Error saving trip. Please try again.")
    }
  }

  const handleHomeClick = () => {
    navigateWithConfirm("/")
  }

  const handleNavigation = (e, path) => {
    e.preventDefault()
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave without saving your trip?"
      )
      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.pathname)
        return
      }
    }
    navigate(path)
  }

  return (
    <div className="mycontainer py-8">
      <button
        onClick={handleHomeClick}
        className="mb-4 text-gray-600 hover:text-gray-800"
      >
        <span>← Back to Home</span>
      </button>

      {isDirty && (
        <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-yellow-800">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Don't forget to save your trip!</p>
              <p className="text-sm">
                Your trip plan will be lost if you leave without saving or
                sharing.
              </p>
            </div>
          </div>
        </div>
      )}

      <h1 className="mb-6 text-2xl font-bold text-[#2e7d32]">Trip Planner</h1>

      <div className="mb-6">
        <button
          onClick={() => setShowSaveModal(true)}
          className={`rounded-lg px-4 py-2 text-white transition-all ${
            isDirty
              ? "animate-pulse bg-[#2e7d32] hover:bg-[#1b5e20]"
              : "bg-[#2e7d32] hover:bg-[#1b5e20]"
          }`}
          disabled={selectedLocations.length === 0}
        >
          Save Trip
        </button>
      </div>

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
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Select Destinations</h2>
            <GoogleMap
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              removeLocation={removeLocation}
            />
          </div>

          <div className="hidden lg:block">
            {recommendedProducts.length > 0 && (
              <div className="rounded-lg bg-white p-4 shadow-md">
                <RecommendedProducts products={recommendedProducts} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {(!tripDates.start || !tripDates.end) && (
            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
              <p className="text-sm">
                <span className="font-medium">Note:</span> The start trip dates{" "}
                <span className="text-red-500">*</span> are required for viewing
                weather details.
              </p>
            </div>
          )}

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
