import React, { useContext } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Link,
} from "react-router-dom"
import { MainPage } from "../pages/MainPage"
import {
  UserContextpProvider,
  UserContext,
} from "../contexts/UserContextpProvider"
import { LoginSignup } from "../pages/LoginSignup"
import { Home } from "../pages/Home"
import { Store } from "../pages/Store"
import { StoreContaxtProvider } from "../contexts/StoreContaxtProvider"
import CartPage from "../pages/CartPage"
import { Product } from "../pages/Product"
import { Admin } from "../pages/Admin"
import { UserProfile } from "../components/UserProfile"
import { TripPlanner } from "../pages/TripPlanner"
import { ErrorBoundary } from "../components/ErrorBoundary"
import { VerifyEmail } from "../components/VerifyEmail"
import { Guides } from "../pages/Guides"
import { GuideDetails } from "../pages/GuideDetails"
import { NotFound } from "../components/NotFound"

export const AppRoutes = () => {
  const { user } = useContext(UserContext)

  console.log("Current user:", user)
  console.log("Is admin?:", user?.isAdmin)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "store",
          element: <Store />,
        },
        {
          path: "loginsingup",
          element: user ? <Navigate to="*" /> : <LoginSignup />,
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "product/:id",
          element: <Product />,
        },
        {
          path: "admin",
          element: user?.role === "admin" ? <Admin /> : <Navigate to="*" />,
        },
        {
          path: "user",
          element: user ? (
            <UserProfile fullScreen />
          ) : (
            <Navigate to="/loginsingup" />
          ),
        },
        {
          path: "trip-planner",
          element: <TripPlanner />,
          errorElement: <ErrorBoundary />,
        },
        {
          path: "verify-email/:token",
          element: <VerifyEmail />,
        },
        {
          path: "guides",
          element: <Guides />,
        },
        {
          path: "guides/:id",
          element: <GuideDetails />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ])

  return (
    <StoreContaxtProvider>
      <RouterProvider router={router} />
    </StoreContaxtProvider>
  )
}
