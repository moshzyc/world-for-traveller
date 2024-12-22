import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "../pages/MainPage"
import { UserContextpProvider } from "../contexts/UserContextpProvider"
import { LoginSignup } from "../pages/LoginSignup"
import { Home } from "../pages/Home"
import { StoreContaxtProvider } from "../contexts/StoreContaxtProvider"
import CartPage from "../pages/CartPage"
import { Product } from "../pages/Product"
import { Admin } from "../pages/Admin"

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      children: [
        {
          path: "",
          element: <Home />,
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
          path: 'admin',
          element: <Admin/>
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
