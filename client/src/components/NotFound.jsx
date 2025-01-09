import { Link } from "react-router-dom"

export const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {/* כותרת הודעת השגיאה */}
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>

      {/* הסבר למשתמש */}
      <p className="text-center text-gray-600">
        The page you're looking for doesn't exist or you don't have permission
        to access it.
      </p>

      {/* כפתור חזרה לדף הבית */}
      <Link
        to="/"
        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Go Home
      </Link>
    </div>
  )
}
