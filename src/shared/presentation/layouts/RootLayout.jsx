import Sidebar from "../components/Sidebar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "../../../users/application/userSlice.js";
import { Toaster, toast } from "sonner";
import ScrollToTop from "../components/ScrollToTop.jsx";

const RootLayout = () => {
  const { loading, message, error } = useSelector((store) => store.users);
  const dispatch = useDispatch();
  const toastId = useRef(null);
  const shownMessageRef = useRef("");

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
      <ScrollToTop />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 p-4 bg-white shadow-md shrink-0">
          <Sidebar/>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Este contenedor fuerza que el main tenga siempre altura suficiente */}
          <div className="flex flex-col">
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer fijo al fondo del scroll, no visible hasta scrollear */}
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default RootLayout;
