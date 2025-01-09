import axios from "axios"

export const getNearbyPlaces = async (req, res) => {
  try {
    // קבלת קואורדינטות מהבקשה
    const { lat, lng } = req.query

    // תיעוד הקואורדינטות שהתקבלו
    console.log("Received request for coordinates:", { lat, lng })
    console.log(
      "Using Google API Key:",
      process.env.GOOGLE_MAPS_API_KEY?.slice(0, 5) + "..."
    )

    // בדיקה שמפתח ה-API של גוגל מוגדר
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key is not configured")
    }

    // הגדרת כתובת ה-API ופרמטרים לבקשה
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    const params = {
      location: `${lat},${lng}`, // מיקום גיאוגרפי
      radius: 5000, // רדיוס חיפוש במטרים
      type: "tourist_attraction", // סוג המקומות לחיפוש
      key: process.env.GOOGLE_MAPS_API_KEY,
      language: "he", // שפת התוצאות
    }

    // תיעוד הבקשה ל-API
    console.log("Making request to Places API:", url)
    console.log("With params:", { ...params, key: "***" })

    // שליחת הבקשה ל-API של גוגל
    const response = await axios.get(url, { params })

    // תיעוד התשובה שהתקבלה
    console.log("Places API response status:", response.status)
    console.log("Places API response data:", {
      results_count: response.data.results?.length,
      status: response.data.status,
      error_message: response.data.error_message,
    })

    // בדיקה אם הבקשה נדחתה
    if (response.data.status === "REQUEST_DENIED") {
      throw new Error(`Google API Error: ${response.data.error_message}`)
    }

    // החזרת התוצאות או מערך ריק אם אין תוצאות
    const results = response.data.results || []
    res.json(results)
  } catch (error) {
    // תיעוד מפורט של השגיאה
    console.error("Error in getNearbyPlaces:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    })

    // הגדרת קוד השגיאה וההודעה
    const statusCode = error.response?.status || 500
    const errorMessage = error.response?.data?.error_message || error.message

    // החזרת תשובת שגיאה מפורטת
    res.status(statusCode).json({
      error: true,
      message: errorMessage,
      details: error.response?.data,
      code: error.code,
    })
  }
}
