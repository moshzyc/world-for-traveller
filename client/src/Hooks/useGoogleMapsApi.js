import { useState, useEffect } from "react"

export const useGoogleMapsApi = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if the API is already loaded
    if (window.google) {
      setIsLoaded(true)
      return
    }

    // Create script element
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true

    // Handle script load
    script.addEventListener("load", () => {
      setIsLoaded(true)
    })

    // Add script to document
    document.head.appendChild(script)

    // Cleanup
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return isLoaded
}
