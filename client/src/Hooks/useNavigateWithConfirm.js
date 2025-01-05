import { useNavigate } from "react-router-dom"

export const useNavigateWithConfirm = () => {
  const originalNavigate = useNavigate()

  // Override navigate to include confirmation
  const navigate = (...args) => {
    // Check if we're on the TripPlanner page
    if (window.location.pathname === "/trip-planner") {
      // Check for unsaved changes using isDirty indicator
      const warningBanner = document.querySelector(".bg-yellow-50")

      if (warningBanner) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave without saving your trip?"
        )
        if (!confirmLeave) {
          window.history.pushState(null, "", window.location.pathname)
          return false
        }
      }
    }
    // Use the original navigate function with all arguments
    return originalNavigate(...args)
  }

  return navigate
}
