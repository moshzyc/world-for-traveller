import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export const TripDetails = ({
  selectedLocations,
  tripDates,
  setTripDates,
  removeLocation,
}) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Trip Details</h2>

      <div className="space-y-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <label className="block text-gray-700">
            Start Date<span className="text-red-500">*</span>{" "}
          </label>
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
                <li
                  key={index}
                  className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2e7d32] text-sm text-white">
                      {index + 1}
                    </span>
                    <span>{location.name}</span>
                  </div>
                  <button
                    onClick={() => removeLocation(index)}
                    className="text-red-500 transition-colors hover:text-red-700"
                    title="Remove location"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
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
