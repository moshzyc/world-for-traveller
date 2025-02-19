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
          const processedData = results.map((res) => {
            const forecastList = res.data.list
            const tripStartDate = new Date(dates.start)
            const tripEndDate = new Date(dates.end)
            tripEndDate.setHours(23, 59, 59, 999)

            // Get the last available forecast date
            const maxForecastDate = new Date(
              forecastList[forecastList.length - 1].dt * 1000
            )

            // Get current weather for dates beyond forecast
            const currentWeather = forecastList[0]

            // Create an array of all dates in the trip
            const tripDates = []
            let currentDate = new Date(tripStartDate)
            while (currentDate <= tripEndDate) {
              const dateKey = currentDate.toISOString().split("T")[0]

              // If date is beyond forecast range, use current weather
              if (currentDate > maxForecastDate) {
                tripDates.push({
                  date: new Date(currentDate),
                  temperature: currentWeather.main.temp,
                  conditions: currentWeather.weather[0].main,
                  icon: currentWeather.weather[0].icon,
                  isBeyondForecast: true,
                })
              } else {
                // Find forecast for this date
                const dateForecast = forecastList.find((f) => {
                  const forecastDate = new Date(f.dt * 1000)
                  return forecastDate.toISOString().split("T")[0] === dateKey
                })

                if (dateForecast) {
                  tripDates.push({
                    date: new Date(currentDate),
                    temperature: dateForecast.main.temp,
                    conditions: dateForecast.weather[0].main,
                    icon: dateForecast.weather[0].icon,
                    isBeyondForecast: false,
                  })
                }
              }

              currentDate.setDate(currentDate.getDate() + 1)
            }

            return {
              forecasts: tripDates.reduce((acc, forecast) => {
                const dateKey = forecast.date.toISOString().split("T")[0]
                acc[dateKey] = forecast
                return acc
              }, {}),
              maxForecastDate,
            }
          })

          setWeatherData(processedData)

          // Get weather conditions for product recommendations
          const weatherConditions = processedData.map((data) => {
            const temp =
              data.forecasts[Object.keys(data.forecasts)[0]].temperature
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
  }, [locations, dates.start, dates.end])

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
                <details className="weather-details">
                  <summary className="mb-2 cursor-pointer font-medium">
                    View weather forecast
                  </summary>
                  <div className="space-y-2">
                    {Object.entries(safeWeatherData[index].forecasts).map(
                      ([dateKey, forecast]) => {
                        return (
                          <div key={dateKey} className="rounded bg-white p-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="font-medium">Date:</span>{" "}
                                {new Date(dateKey).toLocaleDateString()}
                                {forecast.isBeyondForecast && (
                                  <span className="block text-sm text-amber-600">
                                    Forecast not available - showing today's
                                    weather
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Temperature:
                                </span>{" "}
                                {`${forecast.temperature}°C`}
                              </div>
                              <div>
                                <span className="font-medium">Conditions:</span>{" "}
                                {forecast.conditions}
                              </div>
                            </div>
                          </div>
                        )
                      }
                    )}
                  </div>
                </details>
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
