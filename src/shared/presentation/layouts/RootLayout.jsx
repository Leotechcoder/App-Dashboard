import Sidebar from "../components/side-bar.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "../../../users/application/userSlice.js";
import { Toaster, toast } from "sonner";
import ScrollToTop from "../components/utils/ScrollToTop.jsx";
import { useSocket } from "@/context/SocketContext.jsx";
import { addOrderFromSocket } from "@/orders/application/orderSlice.js";
import { addPendingOrderFromSocket } from "@/sales/application/salesSlice.js";
import { getData } from "@/orders/application/itemSlice.js";

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

  // Actualizaciones de ordenes desde socket
    const socket = useSocket();
  
    useEffect(() => {
      if (!socket) return;
  
      const handleNewOrder = (order) => {
        dispatch(addOrderFromSocket(order));
        dispatch(addPendingOrderFromSocket(order));
        dispatch(getData())
      };
  
      socket.on("order:new", handleNewOrder);
  
      return () => {
        socket.off("order:new", handleNewOrder);
      };
    }, [socket, dispatch]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <ScrollToTop />

      <div className="flex h-screen bg-background">
        {/* Sidebar fijo */}
          <Sidebar />
        

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
