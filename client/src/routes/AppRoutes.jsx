import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "../pages/MainPage"
import { Test } from "../components/Test"
import { UserContextpProvider } from "../contexts/UserContextpProvider"

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      children: [
        {
          path: "",
          element: <Test />,
        },
      ],
    },
  ])
  return (
    <UserContextpProvider>
      <RouterProvider router={router} />
    </UserContextpProvider>
  )
}
