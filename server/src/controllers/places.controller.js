import axios from "axios"

export const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng } = req.query

    console.log("Received request for coordinates:", { lat, lng })
    console.log(
      "Using Google API Key:",
      process.env.GOOGLE_MAPS_API_KEY?.slice(0, 5) + "..."
    )

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key is not configured")
    }

    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    const params = {
      location: `${lat},${lng}`,
      radius: 5000,
      type: "tourist_attraction",
      key: process.env.GOOGLE_MAPS_API_KEY,
      language: "he",
    }

    console.log("Making request to Places API:", url)
    console.log("With params:", { ...params, key: "***" })

    const response = await axios.get(url, { params })

    console.log("Places API response status:", response.status)
    console.log("Places API response data:", {
      results_count: response.data.results?.length,
      status: response.data.status,
      error_message: response.data.error_message,
    })

    if (response.data.status === "REQUEST_DENIED") {
      throw new Error(`Google API Error: ${response.data.error_message}`)
    }

    const results = response.data.results || []
    res.json(results)
  } catch (error) {
    console.error("Error in getNearbyPlaces:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    })

    res.status(500).json({
      error: true,
      message: error.message,
      details: error.response?.data,
    })
  }
}
