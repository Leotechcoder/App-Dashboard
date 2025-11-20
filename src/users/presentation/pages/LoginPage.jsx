"use client";

import Logo from "../../../shared/presentation/components/Logo";
import { FormLogin } from "../components/FormLogin";
import LoadingScreen from "../../../shared/presentation/components/LoadingScreen";
import { useState, useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "../../application/userSlice.js";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BG_IMAGE =
  "https://res.cloudinary.com/dp7cugael/image/upload/v1763185852/imagen-paredon_uayvic.jpg";

export const LoginPage = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);

  const toastId = useRef(null);

  const { username, loading } = useSelector((s) => s.users);
  const { message, error } = useSelector((s) => s.app);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ===========================
  // 1️⃣ LOADING ANTES DE CARGAR LA PÁGINA + IMAGEN
  // ===========================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (bgLoaded) setInitialLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [bgLoaded]);

  useEffect(() => {
    const img = new Image();
    img.src = BG_IMAGE;
    img.onload = () => setBgLoaded(true);
  }, []);

  // ===========================
  // 2️⃣ REDIRECCIÓN POST-LOGIN
  // ===========================
  useEffect(() => {
    if (!loading && username) {
      const timer = setTimeout(() => {
        navigate("/admin/home", { replace: true });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [username, loading]);

  // ===========================
  // 3️⃣ EXPANSIÓN FORM RESPONSIVE
  // ===========================
  const handleFormExpand = useCallback((expanded) => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setIsFormExpanded(expanded);
      if (expanded) window.history.pushState({ formExpanded: true }, "");
    }
  }, []);

  const closeExpandedForm = useCallback(() => {
    setIsFormExpanded(false);
    if (window.history.state?.formExpanded) window.history.back();
  }, []);

  useEffect(() => {
    const handler = () => isFormExpanded && setIsFormExpanded(false);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [isFormExpanded]);

  // ===========================
  // 4️⃣ TOASTS & MENSAJES
  // ===========================
  useEffect(() => {
    let timer;

    if (loading) {
      if (!toastId.current) {
        toastId.current = toast.loading("Cargando...");
      }
      return;
    }

    // limpiar toast cuando termina de cargar
    if (toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }

    timer = setTimeout(() => {
      const storedMessage = sessionStorage.getItem("logoutMessage");

      if (storedMessage) {
        toast.success(storedMessage);
        sessionStorage.removeItem("logoutMessage");
      } else if (message) {
        toast.success(message);
        dispatch(removeMessage());
      }

      if (error) {
        toast.error(error?.message || "Error desconocido");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [loading, message, error]);

  // ===========================
  // 5️⃣ RENDER
  // ===========================
  if (initialLoading) return <LoadingScreen />;

  return (
    <>
      <Toaster richColors position="top-right" />

      <div
        className="min-h-screen flex flex-col lg:flex-row bg-no-repeat relative transition-opacity"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "100% 100%",
        }}
      >
        <div className="absolute inset-0 bg-white/30"></div>

        {/* LEFT SIDE */}
        <div
          className={`lg:flex-1 lg:scale-95 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10
            ${isFormExpanded ? "hidden lg:flex" : ""}`}
        >
          <Logo />
          <h1 className="text-6xl font-semibold text-gray-800 mb-3 text-center">
            Cangre Burger
          </h1>
          <h1 className="text-2xl font-medium text-gray-800 mb-4 text-center">
            Web Dashboard
          </h1>
          <p className="p-4 text-xl text-center text-gray-800 mb-8 max-w-md">
            Descubre la mejor experiencia en control y gestión de ventas
          </p>
        </div>

        {/* FORM */}
        <div
          className={`lg:flex-1 lg:scale-90 flex justify-center items-center p-8 lg:p-12 transition-all duration-300 ease-in-out relative z-10
           ${isFormExpanded ? "fixed inset-0 z-50 bg-white" : ""}`}
        >
          <div
            className={`bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out
          ${isFormExpanded ? "w-[85vw] h-[85vh]" : "w-full max-w-md"}`}
          >
            <div className="p-8 h-full overflow-y-auto">
              <FormLogin
                onExpandChange={handleFormExpand}
                isExpanded={isFormExpanded}
              />
            </div>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        {isFormExpanded && (
          <button
            className="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-full lg:hidden cursor-pointer hover:bg-gray-700 transition"
            onClick={closeExpandedForm}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
    </>
  );
};

export default LoginPage;
