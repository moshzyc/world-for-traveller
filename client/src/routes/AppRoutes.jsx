import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "../pages/MainPage"
import { UserContextpProvider } from "../contexts/UserContextpProvider"
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

export const AppRoutes = () => {
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
          element: <LoginSignup />,
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
          element: <Admin />,
        },
        {
          path: "user",
          element: <UserProfile fullScreen />,
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
      ],
    },
  ])
  return (
    <UserContextpProvider>
      <StoreContaxtProvider>
        <RouterProvider router={router} />
      </StoreContaxtProvider>
    </UserContextpProvider>
  )
}
