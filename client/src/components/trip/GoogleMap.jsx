import React, { useState } from "react"
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

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  }

  const center = {
    lat: 31.0461,
    lng: 34.8516,
  }

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      name: "Custom Location",
    }
    setSelectedLocations([...selectedLocations, newLocation])
  }

  const handlePlaceSelect = () => {
    const place = searchBox.getPlace()
    if (place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.name || place.formatted_address,
      }
      setSelectedLocations([...selectedLocations, newLocation])
      map.panTo(place.geometry.location)
    }
  }

  return (
    <div className="space-y-4">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <div className="relative">
          <Autocomplete
            onLoad={(ref) => setSearchBox(ref)}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              placeholder="Search for a location..."
              className="w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </Autocomplete>
        </div>

        <GoogleMapComponent
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={8}
          onClick={handleMapClick}
          onLoad={(map) => setMap(map)}
        >
          {selectedLocations.map((location, index) => (
            <Marker
              key={index}
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
