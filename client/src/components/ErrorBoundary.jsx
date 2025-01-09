// ייבוא הספריות הנדרשות
import React from "react"
// ייבוא הוק לטיפול בשגיאות ניתוב
import { useRouteError } from "react-router-dom"

// קומפוננטת ErrorBoundary - מטפלת בשגיאות ומציגה הודעת שגיאה ידידותית למשתמש
export const ErrorBoundary = () => {
  // שימוש בהוק useRouteError כדי לקבל את פרטי השגיאה מהראוטר
  const error = useRouteError()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        {/* כותרת השגיאה בצבע אדום */}
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Oops! Something went wrong
        </h2>
        {/* הודעת השגיאה - מציג את הודעת השגיאה אם קיימת, אחרת מציג הודעה כללית */}
        <p className="mb-4 text-gray-600">
          {error?.message || "An unexpected error occurred"}
        </p>
        {/* כפתור לטעינה מחדש של העמוד */}
        <button onClick={() => window.location.reload()} className="blackBtn">
          Try Again
        </button>
      </div>
    </div>
  )
}
