import { useContext, useEffect } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import styles from "../css/notifications.module.css"

export const Notifications = () => {
  const { error, success, setError, setSuccess } = useContext(StoreContext)

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  // Don't show notifications for critical errors (those are handled by ErrorBoundary)
  if (!error && !success) return null
  if (error?.fatal) return null // Skip fatal errors

  return (
    <div
      className="fixed right-4 top-4 z-50 flex flex-col gap-2"
      aria-live="polite"
    >
      {error && (
        <div
          className={`${styles.slideIn} flex items-center gap-2 rounded-lg bg-red-100 px-4 py-3 text-red-700 shadow-md`}
        >
          <svg
            className="h-5 w-5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
      {success && (
        <div
          className={`${styles.slideIn} flex items-center gap-2 rounded-lg bg-green-100 px-4 py-3 text-green-700 shadow-md`}
        >
          <svg
            className="h-5 w-5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-700 hover:text-green-900"
            aria-label="Dismiss success message"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
