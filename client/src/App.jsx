import { useState } from "react"
import "./App.css"
import { AppRoutes } from "./routes/AppRoutes"
import { TripPlanner } from "./pages/TripPlanner"
import {
  UserContextpProvider,
  UserContext,
} from "./contexts/UserContextpProvider"
function App() {
  return (
    <UserContextpProvider>
      <AppRoutes />
    </UserContextpProvider>
  )
}

export default App
