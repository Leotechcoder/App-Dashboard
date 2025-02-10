"use client"

import { Logo } from "../../../shared/presentation/components/Logo"
import { FormLogin } from "../components/FormLogin"
import { useState, useCallback, useEffect } from "react"
import { X } from "lucide-react"

export const LoginPage = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col lg:flex-row">
      <div
        className={`lg:flex-1 lg:scale-95 flex flex-col justify-center items-center p-8 lg:p-12 ${
          isFormExpanded ? "hidden lg:flex" : ""
        }`}
      >
        <Logo className="h-16 w-auto mb-8" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Bienvenido a Cangre Burger</h1>
        <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
          Descubre la mejor experiencia en comida rápida y gestión de restaurantes
        </p>
        <img
          src="/placeholder.svg?height=400&width=600"
          alt="Imagen de bienvenida"
          className="rounded-lg shadow-xl max-w-full h-auto"
        />
      </div>

      <div
        className={`lg:flex-1 lg:scale-90 flex justify-center items-center p-8 lg:p-12 transition-all duration-300 ease-in-out ${
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

