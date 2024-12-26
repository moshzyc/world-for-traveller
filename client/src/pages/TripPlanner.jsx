import React, { useState } from "react"
import { GoogleMap } from "../components/trip/GoogleMap"
import { WeatherInfo } from "../components/trip/WeatherInfo"
import { TripDetails } from "../components/trip/TripDetails"
import { ShareTrip } from "../components/trip/ShareTrip"

export const TripPlanner = () => {
  const [selectedLocations, setSelectedLocations] = useState([])
  const [tripDates, setTripDates] = useState({ start: null, end: null })
  const [weatherData, setWeatherData] = useState([])

  return (
    <div className="mycontainer py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#2e7d32]">Trip Planner</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Select Destinations</h2>
            <GoogleMap
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
            />
          </div>
        </div>

        {/* Trip Details Section */}
        <div className="space-y-6">
          <TripDetails
            selectedLocations={selectedLocations}
            tripDates={tripDates}
            setTripDates={setTripDates}
          />

          <WeatherInfo
            locations={selectedLocations}
            dates={tripDates}
            weatherData={weatherData}
            setWeatherData={setWeatherData}
          />

          <ShareTrip
            locations={selectedLocations}
            dates={tripDates}
            weatherData={weatherData}
          />
        </div>
      </div>
    </div>
  )
}
