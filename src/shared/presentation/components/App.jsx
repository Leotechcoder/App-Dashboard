import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "../layouts/RootLayout.jsx"
import Error from "./Error.jsx"
import ErrorUrl from "./ErrorUrl.jsx"
import LoginPage from "../../../users/presentation/pages/LoginPage.jsx"
import Dashboard from "../pages/Home.jsx"
import Contact from "../../../users/presentation/pages/Contact.jsx"
import Products from "../../../products/presentation/pages/ProductsPage.jsx"
import { SalesDashboardView } from "@/sales/presentation/pages/SalesDashboardView.jsx"
import PreviewPage from "@/../pruebas/PreviewPage.jsx"
import ProtectedRoute from "@/shared/middleware/ProtectedRoutes.jsx"
import WorkComponent from "./WorkComponent.jsx"



const router = createBrowserRouter([
  {
    path: "/",
        element: <LoginPage />,
        errorElement: <Error />,
  },
  { element: <ProtectedRoute />, // Protegemos las rutas hijas
    children: [ 
      {
        path: "/admin",
        element: <RootLayout />,
        errorElement: <Error />,
        children: [
          { path: "home", element: <Dashboard/> },
          { path: "contact", element: <Contact /> },
          { path: "products", element: <Products /> },
          { path: "ventas", element: <SalesDashboardView /> },
          { path: "pruebas", element: <PreviewPage /> },
          { path: "*", element: <ErrorUrl /> },
        ],
      },
      { path: "*", element: <ErrorUrl /> },
    ],
  }
  
])


const App = () => {
  return (    
    <RouterProvider router={router} />
  )
}

export default App

