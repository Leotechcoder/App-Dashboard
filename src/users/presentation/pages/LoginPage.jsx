"use client"

// import { Logo } from "../../../shared/presentation/components/Logo"
import Logo from "../../../shared/presentation/components/Logo"
import { FormLogin } from "../components/FormLogin"
import LoadingScreen from "../../../shared/presentation/components/LoadingScreen.jsx"
import { useState, useCallback, useEffect } from "react"
import { X } from "lucide-react"
import { useSelector } from "react-redux"

export const LoginPage = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const { loading } = useSelector((store) => store.users);

  const handleFormExpand = useCallback((expanded) => {
    const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches
    if (isSmallScreen) {
      setIsFormExpanded(expanded)
      if (expanded) {
        window.history.pushState({ formExpanded: true }, "")
      }
    }
  }, [])

  const closeExpandedForm = useCallback(() => {
    setIsFormExpanded(false)
    if (window.history.state && window.history.state.formExpanded) {
      window.history.back()
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      if (isFormExpanded) {
        setIsFormExpanded(false)
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [isFormExpanded])

  
  if(loading) return <LoadingScreen />

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row bg-no-repeat relative"
      style={{ 
        backgroundImage: "url('/imagen-paredon.jpg')",
        backgroundSize: '100% 100%'
      }}
    >
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-none"></div>

      <div
        className={`lg:flex-1 lg:scale-95 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10 ${
          isFormExpanded ? "hidden lg:flex" : ""
        }`}
      >
        <Logo />
        <h1 className="text-6xl font-semibold text-gray-800 mb-3 text-center">
          Cangre Burger
        </h1>
        <h1 className="text-2xl font-medium text-gray-800 mb-4 text-center">
          Web Dashboard
        </h1>
        <p className="text-xl text-gray-800 mb-8 text-center max-w-md">
          Descubre la mejor experiencia en comida rápida y gestión de restaurantes
        </p>
      </div>

      <div
        className={`lg:flex-1 lg:scale-90 flex justify-center items-center p-8 lg:p-12 transition-all duration-300 ease-in-out relative z-10 ${
          isFormExpanded ? "fixed inset-0 z-50 bg-white" : ""
        }`}
      >
        <div
          className={`bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out ${
            isFormExpanded ? "w-[85vw] h-[85vh] max-w-none" : "w-full max-w-md"
          }`}
        >
          <div className="p-8 h-full overflow-y-auto">
            <FormLogin onExpandChange={handleFormExpand} isExpanded={isFormExpanded} />
          </div>
        </div>
      </div>

      {isFormExpanded && (
        <button
          className="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-full lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
          onClick={closeExpandedForm}
          aria-label="Cerrar formulario"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

export default LoginPage

