import React from "react"
import {
  GoogleMap as GoogleMapComponent,
  LoadScript,
  Marker,
} from "@react-google-maps/api"

export const GoogleMap = ({ selectedLocations, setSelectedLocations }) => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  }

  const center = {
    lat: 31.0461, // Israel center
    lng: 34.8516,
  }

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      name: "Custom Location", // You can add geocoding here to get location name
    }
    setSelectedLocations([...selectedLocations, newLocation])
  }

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMapComponent
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={8}
        onClick={handleMapClick}
      >
        {selectedLocations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            label={`${index + 1}`}
          />
        ))}
      </GoogleMapComponent>
    </LoadScript>
  )
}
