import Sidebar from "../components/Sidebar.jsx"
import { Outlet, useNavigate } from "react-router-dom"
import Footer from "../components/Footer.jsx"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeMessage } from "../../../users/application/userSlice.js"
import { Toaster, toast } from "sonner"
import LoadingScreen from "../components/LoadingScreen.jsx"

const RootLayout = () => {
  const { loading, message, error } = useSelector((store) => store.users)
  const [logOutUser, setLogOutUser] = useState(false)
  const dispatch = useDispatch()
  const toastId = useRef(null)
  const navigate = useNavigate() // 👈 para redirigir
  const shownMessageRef = useRef("");

  // Manejar redirección al dashboard después del logout
  useEffect(() => {
    let timer
    if (logOutUser) {
      timer = setTimeout(() => {
        navigate("/", { replace: true })
      }, 2000) // <- 2 segundos
    }
    return () => clearTimeout(timer)
  }, [logOutUser, navigate])

  useEffect(() => {
    let timer

    if (loading && message !== "Sesión iniciada exitosamente!") {
      // Mostrar toast de carga
      if (!toastId.current) {
        toastId.current = toast.loading("Cargando...")
      }
    } else {
    timer = setTimeout(() => {      
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }

      if (message && message !== "Sesión cerrada exitosamente!" && shownMessageRef.current !== message) {
          toast.success(message);
          shownMessageRef.current = message;
        // Limpio el mensaje con un poco de delay para que sí se vea
        setTimeout(() => {
          dispatch(removeMessage());
          shownMessageRef.current = "";
        }, 2000);
      }

      if (error) {
        toast.error(error);
      }
    }, 600);
    }

    return () => clearTimeout(timer)
  }, [loading, message, error, dispatch])

  if(logOutUser){
    return <LoadingScreen />
  }

  return (
    <>
      {/* 🔥 Toaster global */}
      <Toaster richColors position="top-right" />

      <div className="flex flex-col lg:flex-row min-h-screen">
  {/* Sidebar */}
  <div className="w-64 p-4">
    <Sidebar setLogOutUser={setLogOutUser} />
  </div>

  {/* Main Content */}
  <div className="flex-1 ms-8 bg-gray-200 min-h-screen flex flex-col justify-between">
    <div
      style={{
        transform: "scale(0.9)",
        transformOrigin: "center left",
        width: "111.111%",
        height: "100%"
      }}
    >
      <Outlet />
    </div>
    <Footer />
  </div>
</div>

    </>
  )
}

export default RootLayout
