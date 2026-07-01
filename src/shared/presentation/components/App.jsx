import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "../layouts/RootLayout.jsx"
import Error from "./Error.jsx"
import ErrorUrl from "./ErrorUrl.jsx"
import LoginPage from "../pages/LoginPage.jsx"
import Dashboard from "../pages/Home.jsx"
import Contact from "@/users/presentation/pages/Contact.jsx"
import Products from "@/products/presentation/pages/ProductsPage.jsx"
import { SalesDashboardView } from "@/sales/presentation/pages/SalesDashboardView.jsx"
import { AnalyticsDashboard } from "@/analytics/presentation/pages/AnalyticsDashboard.jsx"
import ProtectedRoute from "@/shared/middleware/ProtectedRoutes.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <Error />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <RootLayout />,
        errorElement: <Error />,
        children: [
          { path: "home",      element: <Dashboard /> },
          { path: "contact",   element: <Contact /> },
          { path: "products",  element: <Products /> },
          { path: "ventas",    element: <SalesDashboardView /> },
          { path: "analytics", element: <AnalyticsDashboard /> },
          { path: "*",         element: <ErrorUrl /> },
        ],
      },
      { path: "*", element: <ErrorUrl /> },
    ],
  },
])

const App = () => <RouterProvider router={router} />

export default App
