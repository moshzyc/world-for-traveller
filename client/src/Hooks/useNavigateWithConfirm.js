import { useNavigate } from "react-router-dom"

export const useNavigateWithConfirm = () => {
  const originalNavigate = useNavigate()

  const navigate = (...args) => {
    // Check if we're on the TripPlanner page
    if (window.location.pathname === "/trip-planner") {
      // Check for isDirty state instead of the banner
      const isDirty =
        window.localStorage.getItem("tripPlannerIsDirty") === "true"

      if (isDirty) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave without saving your trip?"
        )
        if (!confirmLeave) {
          window.history.pushState(null, "", window.location.pathname)
          return false
        }
      }
    }
    return originalNavigate(...args)
  }

  return navigate
}
