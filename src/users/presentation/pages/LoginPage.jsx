"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { removeMessage } from "../../application/userSlice.js";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../../shared/presentation/components/LoadingScreen";
import { FormLogin } from "../components/FormLogin";
import Logo from "@/shared/presentation/components/Logo.jsx";

const BG_IMAGE =
  "https://res.cloudinary.com/dp7cugael/image/upload/v1763185852/imagen-paredon_uayvic.jpg";

export const LoginPage = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);

  const toastId = useRef(null);

  const { username, loading, error } = useSelector((s) => s.users);
  const { message } = useSelector((s) => s.app);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ======================
// Text Motion Variants
// ======================
const textParent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.6 },
  },
};

const textChild = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.8,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

  // ANIMACIONES
  const depthFade = {
    hidden: { opacity: 0, scale: 0.7, y: 20, filter: "blur(8px)" },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  // ===========================
  // 1️⃣ LOADING + CARGA DE IMAGEN
  // ===========================
  useEffect(() => {
    const img = new Image();
    img.src = BG_IMAGE;
    img.onload = () => setBgLoaded(true);
  }, []);

  useEffect(() => {
    if (!bgLoaded) return;
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, [bgLoaded]);

  // ===========================
  // 2️⃣ REDIRECCIÓN POST LOGIN
  // ===========================
  useEffect(() => {
    if (!loading && username) {
      const timer = setTimeout(() => {
        navigate("/admin/home", { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [username, loading, navigate]);

  // ===========================
  // 3️⃣ EXPANSIÓN FORM
  // ===========================
  const handleFormExpand = useCallback((expanded) => {
    if (window.innerWidth <= 1024) {
      setIsFormExpanded(expanded);
      if (expanded) window.history.pushState({ formExpanded: true }, "");
    }
  }, []);

  const closeExpandedForm = useCallback(() => {
    setIsFormExpanded(false);
    if (window.history.state?.formExpanded) window.history.back();
  }, []);

  useEffect(() => {
    const handler = () => setIsFormExpanded(false);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // ===========================
  // 4️⃣ TOASTS ESTABLES
  // ===========================
  useEffect(() => {
    if (loading) {
      if (!toastId.current) {
        toastId.current = toast.loading("Cargando...");
      }
    } else {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }
    }
  }, [loading]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      setTimeout(() => dispatch(removeMessage()), 200);
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // ===========================
  // 5️⃣ RENDER
  // ===========================
  if (initialLoading) return <LoadingScreen />;

  return (
    <>
      <Toaster richColors position="top-right" />

      <div
        className="min-h-screen flex flex-col lg:flex-row bg-no-repeat relative"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "100% 100%",
        }}
      >
        <div className="absolute inset-0 bg-white/30"></div>

        {/* LEFT SIDE */}
        <motion.div
          variants={textParent}
          initial="hidden"
          animate="visible"
          className={`lg:flex-1 lg:scale-95 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10 ${
            isFormExpanded ? "hidden lg:flex" : ""
          }`}
        >
          <Logo />

          <motion.h1
            variants={textChild}
            className="text-6xl font-semibold text-gray-800 mb-3 text-center"
          >
            Cangre Burger
          </motion.h1>

          <motion.h2
            variants={textChild}
            className="text-2xl font-medium text-gray-800 mb-4 text-center"
          >
            Web Dashboard
          </motion.h2>

          <motion.p
            variants={textChild}
            className="p-4 text-xl text-center text-gray-800 mb-8 max-w-md"
          >
            Descubre la mejor experiencia en control y gestión de ventas
          </motion.p>
        </motion.div>

        {/* FORM */}
        <div
          className={`lg:flex-1 lg:scale-90 flex justify-center items-center p-8 lg:p-12 transition-all duration-300 ease-in-out relative z-10
          ${isFormExpanded ? "fixed inset-0 z-50 bg-white" : ""}`}
        >
          <motion.div
            variants={depthFade}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.75 }}
            className={`bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out
              ${isFormExpanded ? "w-[85vw] h-[85vh]" : "w-full max-w-md"}`}
          >
            <div className="p-8 h-full overflow-y-auto">
              <FormLogin
                onExpandChange={handleFormExpand}
                isExpanded={isFormExpanded}
              />
            </div>
          </motion.div>
        </div>

        {/* CLOSE BUTTON */}
        {isFormExpanded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-full lg:hidden cursor-pointer hover:bg-gray-700 transition"
            onClick={closeExpandedForm}
          >
            <X className="h-6 w-6" />
          </motion.button>
        )}
      </div>
    </>
  );
};

export default LoginPage;
