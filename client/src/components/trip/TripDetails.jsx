import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export const TripDetails = ({ selectedLocations, tripDates, setTripDates }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Trip Details</h2>

      <div className="space-y-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <label className="block text-gray-700">Start Date</label>
          <DatePicker
            selected={tripDates.start}
            onChange={(date) => setTripDates({ ...tripDates, start: date })}
            className="w-full rounded-lg border border-gray-300 p-2"
            minDate={new Date()}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">End Date</label>
          <DatePicker
            selected={tripDates.end}
            onChange={(date) => setTripDates({ ...tripDates, end: date })}
            className="w-full rounded-lg border border-gray-300 p-2"
            minDate={tripDates.start || new Date()}
          />
        </div>

        {/* Selected Locations List */}
        <div>
          <h3 className="mb-2 font-medium text-gray-700">
            Selected Locations:
          </h3>
          {selectedLocations.length > 0 ? (
            <ul className="space-y-2">
              {selectedLocations.map((location, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2e7d32] text-sm text-white">
                    {index + 1}
                  </span>
                  <span>{location.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No locations selected</p>
          )}
        </div>
      </div>
    </div>
  )
}
