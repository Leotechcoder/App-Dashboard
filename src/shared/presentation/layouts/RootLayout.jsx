import Sidebar from "../components/Sidebar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "../../../users/application/userSlice.js";
import { Toaster, toast } from "sonner";

const RootLayout = () => {
  const { loading, message, error } = useSelector((store) => store.users);
  const [logOutUser, setLogOutUser] = useState(false);
  const dispatch = useDispatch();
  const toastId = useRef(null);
  const navigate = useNavigate();
  const shownMessageRef = useRef("");

  // 🔁 Redirección tras logout
  useEffect(() => {
    if (logOutUser) {
      const timer = setTimeout(() => navigate("/", { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [logOutUser, navigate]);

  // ⚙️ Control de mensajes y toasts
  useEffect(() => {
    let timer;
    if (loading && message !== "Sesión iniciada exitosamente!") {
      if (!toastId.current) toastId.current = toast.loading("Cargando...");
    } else {
      timer = setTimeout(() => {
        if (toastId.current) {
          toast.dismiss(toastId.current);
          toastId.current = null;
        }

        if (
          message &&
          message !== "Sesión cerrada exitosamente!" &&
          shownMessageRef.current !== message
        ) {
          toast.success(message);
          shownMessageRef.current = message;
          setTimeout(() => {
            dispatch(removeMessage());
            shownMessageRef.current = "";
          }, 2000);
        }

        if (error) toast.error(error);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [loading, message, error, dispatch]);

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 p-4 bg-white shadow-md flex-shrink-0">
          <Sidebar setLogOutUser={setLogOutUser} />
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Este contenedor fuerza que el main tenga siempre altura suficiente */}
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto">
              <div className="min-h-[calc(100vh-100px)] p-4">
                {/* Ajustá 100px según la altura de tu footer */}
                <Outlet />
              </div>
            </main>

            {/* Footer fijo al fondo del scroll, no visible hasta scrollear */}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default RootLayout;
