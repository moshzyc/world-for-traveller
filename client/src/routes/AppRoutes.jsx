import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "../pages/MainPage"
import { UserContextpProvider } from "../contexts/UserContextpProvider"
import { LoginSignup } from "../pages/LoginSignup"
import { Home } from "../pages/Home"
import { StoreContaxtProvider } from "../contexts/StoreContaxtProvider"
import CartPage from "../pages/CartPage"

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      children: [
        {
          path: "",
          element: <Home/>,
        },
        {
          path: "loginsingup",
          element: <LoginSignup />,
        },
        {
          path: "cart",
          element: <CartPage/>
        }
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
