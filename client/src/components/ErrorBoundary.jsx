import React from "react"
import { useRouteError } from "react-router-dom"

export const ErrorBoundary = () => {
  const error = useRouteError()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Oops! Something went wrong
        </h2>
        <p className="mb-4 text-gray-600">
          {error?.message || "An unexpected error occurred"}
        </p>
        <button onClick={() => window.location.reload()} className="blackBtn">
          Try Again
        </button>
      </div>
    </div>
  )
}
