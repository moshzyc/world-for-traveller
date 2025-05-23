import { useContext } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom"
import { MainPage } from "../pages/MainPage"
import {
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
import { UserPosts } from "../pages/UserPosts"
import { AddUserPost } from "../components/AddUserPost"
import { EditUserPost } from "../components/EditUserPost"
import { PostDetails } from "../components/PostDetails"
import { Notifications } from "../components/Notifications"
import ScrollToTop from "../components/ScrollToTop"

export const AppRoutes = () => {
  const { user } = useContext(UserContext)
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <MainPage />
          <ScrollToTop />
        </>
      ),
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
          element: user ? <NotFound /> : <LoginSignup />,
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
          element: user?.role === "admin" ? <Admin /> : <NotFound />,
        },
        {
          path: "user",
          element: user ? <UserProfile fullScreen /> : <NotFound />,
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
          path: "community",
          element: <UserPosts />,
        },
        {
          path: "community/add",
          element: user ? <AddUserPost /> : <Navigate to="/loginsingup" />,
        },
        {
          path: "community/post/:id",
          element: <PostDetails />,
        },
        {
          path: "community/edit/:id",
          element: user ? <EditUserPost /> : <Navigate to="/loginsingup" />,
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
      <Notifications />
      <RouterProvider router={router} />
    </StoreContaxtProvider>
  )
}
