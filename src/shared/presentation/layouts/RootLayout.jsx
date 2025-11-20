import Sidebar from "../components/side-bar.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useEffect, useRef } from "react";
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
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [loading, message, error, dispatch]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <ScrollToTop />

      <div className="flex h-screen bg-background">
        {/* Sidebar fijo */}
        <aside className="w-36 shrink-0 border-r border-border bg-sidebar">
          <Sidebar />
        </aside>

        {/* Área principal con scroll interno */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>

          {/* Footer opcional */}
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default RootLayout;
