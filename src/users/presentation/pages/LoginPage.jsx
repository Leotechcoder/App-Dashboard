

import Logo from "../../../shared/presentation/components/Logo"
import { FormLogin } from "../components/FormLogin"
import LoadingScreen from "../../../shared/presentation/components/LoadingScreen"
import { useState, useCallback, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { removeMessage } from "../../application/userSlice.js"
import { Toaster, toast } from "sonner"
import { useNavigate } from "react-router-dom"

export const LoginPage = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  
  // Referencia para el toast de carga
  const toastId = useRef(null)
//Estados segun respuesta del servidor
  const { loading, message, error } = useSelector((store) => store.users)
  const dispatch  = useDispatch()
  const navigate = useNavigate() // 👈 para redirigir

  // Manejar redirección al dashboard después del login
  useEffect(() => {
    let timer
    if (!loading && message && message === "Sesión iniciada exitosamente!") {
      timer = setTimeout(() => {
        navigate("/admin/home", { replace: true })
      }, 2000) // <- 2 segundos
    }
    return () => clearTimeout(timer)
  }, [message, loading, navigate])

  // Manejar la expansion del formulario en pantallas pequeñas
  const handleFormExpand = useCallback((expanded) => {
    const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches
    if (isSmallScreen) {
      setIsFormExpanded(expanded)
      if (expanded) {
        window.history.pushState({ formExpanded: true }, "")
      }
    }
  }, [])
// Cerrar el formulario expandido
  const closeExpandedForm = useCallback(() => {
    setIsFormExpanded(false)
    if (window.history.state && window.history.state.formExpanded) {
      window.history.back()
    }
  }, [])

  // Escuchar cambios en el historial para cerrar el formulario expandido
  useEffect(() => {
    const handlePopState = () => {
      if (isFormExpanded) {
        setIsFormExpanded(false)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [isFormExpanded])

  // 👇 Manejar loading y mensajes con Sonner
useEffect(() => {
  let timer;

  if (loading) {
    if (!toastId.current) {
      toastId.current = toast.loading("Cargando...");
    }
  } else {
    timer = setTimeout(() => {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }

      if (message && message === "Sesión cerrada exitosamente!") {
          toast.success(message);
        // Limpio el mensaje con un poco de delay para que sí se vea
        setTimeout(() => {
          dispatch(removeMessage());
        }, 2000);
      }

      if (error) {
        toast.error(error);
      }
    }, 600);
  }

  return () => clearTimeout(timer);
}, [loading, message, error, dispatch]);

if(message === "Sesión iniciada exitosamente!"){
  return <LoadingScreen />
}

 return (
  <>
    <Toaster richColors position="top-right" />
      <div
        className="min-h-screen flex flex-col lg:flex-row bg-no-repeat relative"
        style={{ 
          backgroundImage: "url('/imagen-paredon.jpg')",
          backgroundSize: '100% 100%'
        }}
      >
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
   
  </>
)

}

export default LoginPage
