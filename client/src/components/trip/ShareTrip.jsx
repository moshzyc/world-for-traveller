import React from "react"

export const ShareTrip = ({ locations, dates, weatherData, onClose }) => {
  const createGoogleMapsUrl = (locations) => {
    if (!locations || locations.length === 0) return ""

    const waypoints = locations.map((loc) => `${loc.lat},${loc.lng}`).join("/")
    return `https://www.google.com/maps/dir/${waypoints}`
  }

  const formatWeatherData = (weatherData) => {
    if (!weatherData || weatherData.length === 0) return ""

    return weatherData
      .map((w) => {
        // Handle both direct temperature/conditions and nested forecast structure
        const temperature = w.temperature || w.forecast?.temperature
        const conditions = w.conditions || w.forecast?.conditions
        const location = w.location || locations[weatherData.indexOf(w)]?.name

        return `${location}: ${temperature}°C, ${conditions}`
      })
      .join("\n")
  }

  const handleWhatsAppShare = () => {
    // Convert string dates to Date objects if needed
    const startDate =
      dates.start instanceof Date ? dates.start : new Date(dates.start)

    const endDate = dates.end instanceof Date ? dates.end : new Date(dates.end)

    const locationsList = locations
      .map((loc, index) => `${index + 1}. ${loc.name}`)
      .join("\n")

    const weatherInfo = formatWeatherData(weatherData)

    const message =
      `Check out my trip plan!\n\n` +
      `Dates: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n\n` +
      `${locationsList}\n\n` +
      `View route on Google Maps:\n${createGoogleMapsUrl(locations)}\n\n` +
      (weatherInfo ? `Weather:\n${weatherInfo}` : "")

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
  }

  const handleEmailShare = () => {
    // Convert string dates to Date objects if needed
    const startDate =
      dates.start instanceof Date ? dates.start : new Date(dates.start)

    const endDate = dates.end instanceof Date ? dates.end : new Date(dates.end)

    const locationsList = locations
      .map((loc, index) => `${index + 1}. ${loc.name}`)
      .join("\n")

    const weatherInfo = formatWeatherData(weatherData)

    const subject = "Check out my trip plan!"
    const body =
      `Trip Details:\n\n` +
      `Dates: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n\n` +
      `${locationsList}\n\n` +
      `View route on Google Maps:\n${createGoogleMapsUrl(locations)}\n\n` +
      (weatherInfo ? `Weather:\n${weatherInfo}` : "")

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share via WhatsApp
        </button>
        <button
          onClick={handleEmailShare}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          Share via Email
        </button>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Close
        </button>
      )}
    </div>
  )
}
