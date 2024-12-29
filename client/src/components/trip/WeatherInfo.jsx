import React, { useEffect, useState } from "react"
import axios from "axios"

export const WeatherInfo = ({
  locations,
  dates,
  weatherData,
  setWeatherData,
}) => {
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (locations.length > 0 && dates.start) {
        setIsLoading(true)
        setError(null)
        try {
          const weatherPromises = locations.map((location) =>
            axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
              params: {
                lat: location.lat,
                lon: location.lng,
                appid: WEATHER_API_KEY,
                units: "metric",
              },
              withCredentials: false,
              headers: {
                "Content-Type": "application/json",
              },
            })
          )

          const results = await Promise.all(weatherPromises)
          const processedData = results.map((res) => ({
            temp: res.data.list[0].main.temp,
            conditions: res.data.list[0].weather[0].main,
            icon: res.data.list[0].weather[0].icon,
          }))

          setWeatherData(processedData)
        } catch (error) {
          setError(
            error.response?.data?.message ||
              "Failed to fetch weather data. Please try again later."
          )
          console.error("Error fetching weather data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchWeatherData()
  }, [locations, dates.start])

  if (error) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Weather Forecast</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Weather Forecast</h2>

      {isLoading ? (
        <div className="py-4 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#2e7d32]"></div>
          <p className="mt-2 text-gray-600">Loading weather data...</p>
        </div>
      ) : weatherData.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {weatherData.map((data, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 rounded-lg bg-gray-50 p-4"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2e7d32] text-sm text-white">
                {index + 1}
              </span>
              <img
                src={`http://openweathermap.org/img/wn/${data.icon}@2x.png`}
                alt={data.conditions}
                className="h-12 w-12"
              />
              <div>
                <h3 className="font-medium">{locations[index].name}</h3>
                <p className="text-gray-600">{Math.round(data.temp)}°C</p>
                <p className="text-gray-600">{data.conditions}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          Select locations and dates to see weather forecast
        </p>
      )}
    </div>
  )
}
