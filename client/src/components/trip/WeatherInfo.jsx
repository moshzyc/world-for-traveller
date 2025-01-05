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
    <div className="space-y-6">
      {/* Weather Information */}
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
                  <p className="text-gray-600">
                    {Math.round(data.temperature)}°C
                  </p>
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
    </div>
  )
}
