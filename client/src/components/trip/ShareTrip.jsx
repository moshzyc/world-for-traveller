import React from "react"

export const ShareTrip = ({ locations, dates, weatherData }) => {
  const handleEmailShare = () => {
    const subject = "My Trip Plan"
    const mapUrl = `https://www.google.com/maps/dir/${locations
      .map((loc) => `${loc.lat},${loc.lng}`)
      .join("/")}`

    const body = `
Trip Details:
Dates: ${dates.start?.toLocaleDateString()} - ${dates.end?.toLocaleDateString()}

Locations:
${locations.map((loc, i) => `${i + 1}. ${loc.name}`).join("\n")}

Weather Forecast:
${locations.map((loc, i) => `${loc.name}: ${weatherData[i]?.temp}°C, ${weatherData[i]?.conditions}`).join("\n")}

View route on Google Maps:
${mapUrl}
    `

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleWhatsAppShare = () => {
    const mapUrl = `https://www.google.com/maps/dir/${locations
      .map((loc) => `${loc.lat},${loc.lng}`)
      .join("/")}`

    const text = `
Check out my trip plan!
Dates: ${dates.start?.toLocaleDateString()} - ${dates.end?.toLocaleDateString()}
${locations.map((loc, i) => `${i + 1}. ${loc.name}`).join("\n")}

View route on Google Maps:
${mapUrl}
    `
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  const handleAddToCalendar = () => {
    const event = {
      title: "My Trip",
      start: dates.start,
      end: dates.end,
      description: locations
        .map((loc, i) => `${i + 1}. ${loc.name}`)
        .join("\n"),
    }

    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start?.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${event.end?.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(event.description)}`

    window.open(googleCalendarUrl)
  }

  // Create the map URL with location markers
  const mapUrl = `https://www.google.com/maps/dir/${locations
    .map((loc) => `${loc.lat},${loc.lng}`)
    .join("/")}`

  const shareTitle = "Check out my trip itinerary!"
  const shareDescription = `My trip includes stops at: ${locations
    .map((loc) => loc.name)
    .join(", ")}\n\nView route on Google Maps: ${mapUrl}`

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Share Trip</h2>

      <div className="space-y-3">
        <button onClick={handleEmailShare} className="blackBtn w-full">
          Share via Email
        </button>

        <button onClick={handleWhatsAppShare} className="whiteBtn w-full">
          Share via WhatsApp
        </button>

        <button onClick={handleAddToCalendar} className="whiteBtn w-full">
          Add to Google Calendar
        </button>
      </div>
    </div>
  )
}
