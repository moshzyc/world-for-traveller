import React, { useState, useEffect } from "react"
import {
  GoogleMap as GoogleMapComponent,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api"

export const GoogleMap = ({
  selectedLocations,
  setSelectedLocations,
  removeLocation,
}) => {
  const [searchBox, setSearchBox] = useState(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    // Cleanup any existing pac-container when component mounts
    const existingPacContainer = document.querySelector(".pac-container")
    if (existingPacContainer) {
      existingPacContainer.remove()
    }

    const observer = new MutationObserver((mutations) => {
      const pacContainer = document.querySelector(".pac-container")
      if (pacContainer) {
        const inputElement = document.querySelector(
          '.google-map-container input[type="text"]'
        )
        const modalContent = document.querySelector(".modal-content")

        if (inputElement && modalContent) {
          const inputRect = inputElement.getBoundingClientRect()

          Object.assign(pacContainer.style, {
            zIndex: "99999",
            maxHeight: "400px",
            overflowY: "auto",
            width: `${inputRect.width}px`,
            position: "fixed",
            top: `${inputRect.bottom}px`,
            left: `${inputRect.left}px`,
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            fontSize: "16px",
            lineHeight: "1.5",
            visibility: "visible",
            opacity: "1",
          })

          const googleLogo = pacContainer.querySelector(".pac-logo")
          if (googleLogo) {
            Object.assign(googleLogo.style, {
              height: "20px",
              padding: "2px",
              opacity: "0.7",
            })
          }

          if (pacContainer.parentElement === document.body) {
            modalContent.appendChild(pacContainer)
          }
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    })

    return () => {
      observer.disconnect()
      // Also cleanup when component unmounts
      const pacContainer = document.querySelector(".pac-container")
      if (pacContainer) {
        pacContainer.remove()
      }
    }
  }, [])

  return (
    <div className="google-map-container space-y-4">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <div className="relative">
          <Autocomplete
            onLoad={(ref) => setSearchBox(ref)}
            onPlaceChanged={() => {
              const place = searchBox?.getPlace()
              if (place?.geometry) {
                const newLocation = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  name: place.name || place.formatted_address,
                }
                setSelectedLocations([...selectedLocations, newLocation])
                map?.panTo(place.geometry.location)
              }
            }}
          >
            <input
              type="text"
              placeholder="Search for a location..."
              className="w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </Autocomplete>
        </div>

        <GoogleMapComponent
          mapContainerStyle={{
            width: "100%",
            height: "400px",
          }}
          center={{
            lat: 31.0461,
            lng: 34.8516,
          }}
          zoom={8}
          onClick={(event) => {
            const newLocation = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
              name: "Custom Location",
            }
            setSelectedLocations([...selectedLocations, newLocation])
          }}
          onLoad={(map) => setMap(map)}
        >
          {selectedLocations.map((location, index) => (
            <Marker
              key={`${location.lat}-${location.lng}-${index}`}
              position={{ lat: location.lat, lng: location.lng }}
              label={`${index + 1}`}
              onClick={() => {
                if (window.confirm(`Remove ${location.name} from your trip?`)) {
                  removeLocation(index)
                }
              }}
            />
          ))}
        </GoogleMapComponent>
      </LoadScript>
    </div>
  )
}
