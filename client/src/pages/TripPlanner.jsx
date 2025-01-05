import React, { useState } from "react"
import { GoogleMap } from "../components/trip/GoogleMap"
import { WeatherInfo } from "../components/trip/WeatherInfo"
import { TripDetails } from "../components/trip/TripDetails"
import { ShareTrip } from "../components/trip/ShareTrip"
import { NearbyAttractions } from "../components/trip/NearbyAttractions"
import { RecommendedProducts } from "../components/trip/RecommendedProducts"

export const TripPlanner = () => {
  const [selectedLocations, setSelectedLocations] = useState([])
  const [tripDates, setTripDates] = useState({ start: null, end: null })
  const [weatherData, setWeatherData] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])

  const removeLocation = (indexToRemove) => {
    setSelectedLocations((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    )
    setWeatherData((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="mycontainer py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#2e7d32]">Trip Planner</h1>

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
