import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "../layouts/RootLayout.jsx"
import Error from "./Error.jsx"
import ErrorUrl from "./ErrorUrl.jsx"
import LoginPage from "../../../users/presentation/pages/LoginPage.jsx"
import Dashboard from "../pages/Home.jsx"
import Contact from "../../../users/presentation/pages/Contact.jsx"
import Products from "../../../products/presentation/pages/ProductsPage.jsx"
import OrdersPage from "../../../orders/presentation/pages/OrdersPage.jsx"
// import VentasPage from "../../../solds/presentation/pages/VentasPage.jsx"
import OrderSheet from "./OrderSheet.jsx"
import UserSheet from "./UserSheet.jsx"
import { SalesDashboardView } from "@/sales/presentation/pages/SalesDashboardView.jsx"



const router = createBrowserRouter([
  {
    path: "/",
        element: <LoginPage />,
        errorElement: <Error />,
  },
  {
    path: "/admin",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { path: "home", element: <Dashboard /> },
      { path: "contact", element: <Contact /> },
      { path: "products", element: <Products /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "ventas", element: <SalesDashboardView /> },
      { path: "*", element: <ErrorUrl /> },
    ],
  },
  
  {path: "ficha_ordenes", element: <UserSheet />},
  { path: "*", element: <ErrorUrl /> },
])


const App = () => {
  return (    
    <RouterProvider router={router} />
  )
}

export default App

