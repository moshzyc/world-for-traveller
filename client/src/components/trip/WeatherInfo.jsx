import React, { useEffect, useState } from "react"
import axios from "axios"
import { PRODUCTS_RECOMMENDATIONS_URL } from "../../constants/endPoint"
import { RecommendedProducts } from "./RecommendedProducts"

export const WeatherInfo = ({
  locations,
  dates,
  weatherData,
  setWeatherData,
  setRecommendedProducts,
}) => {
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Add null checks and default values
  const safeLocations = locations || []
  const safeWeatherData = weatherData || []

  useEffect(() => {
    const fetchWeatherAndProducts = async () => {
      if (locations.length > 0 && dates.start) {
        setIsLoading(true)
        setError(null)
        try {
          // Fetch weather data with updated configuration
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
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            })
          )

          const results = await Promise.all(weatherPromises)
          const processedData = results.map((res) => ({
            temperature: res.data.list[0].main.temp,
            conditions: res.data.list[0].weather[0].main,
            icon: res.data.list[0].weather[0].icon,
          }))

          setWeatherData(processedData)

          // Get weather conditions for product recommendations
          const weatherConditions = processedData.map((data) => {
            const temp = data.temperature
            if (temp >= 25) return "hot"
            if (temp <= 15) return "cold"
            return "neutral"
          })

          // Fetch recommended products
          const { data: recommendedProductsData } = await axios.get(
            PRODUCTS_RECOMMENDATIONS_URL,
            {
              params: { weatherConditions },
              paramsSerializer: (params) => {
                return params.weatherConditions
                  .map((condition) => `weatherConditions=${condition}`)
                  .join("&")
              },
              withCredentials: true,
            }
          )

          setRecommendedProducts(recommendedProductsData)
        } catch (error) {
          console.error("Error fetching data:", error)
          setError(
            error.response?.data?.message ||
              "Failed to fetch data. Please try again later."
          )
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchWeatherAndProducts()
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
      <h2 className="mb-4 text-xl font-semibold">Weather Information</h2>
      {!dates?.start ? (
        <p className="text-gray-500">
          Please select trip dates to see weather information
        </p>
      ) : safeLocations.length === 0 ? (
        <p className="text-gray-500">No locations selected</p>
      ) : (
        <div className="space-y-4">
          {safeLocations.map((location, index) => (
            <div key={index} className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-medium">
                {location?.name || "Unknown Location"}
              </h3>
              {safeWeatherData[index] ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Temperature:</span>{" "}
                    {safeWeatherData[index].temperature !== "N/A"
                      ? `${safeWeatherData[index].temperature}°C`
                      : "Not available"}
                  </div>
                  <div>
                    <span className="font-medium">Conditions:</span>{" "}
                    {safeWeatherData[index].conditions || "Not available"}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Loading weather data...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
