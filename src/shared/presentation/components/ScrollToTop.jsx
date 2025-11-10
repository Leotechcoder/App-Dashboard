import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando cambia la ruta, scrollea al inicio
    window.scrollTo({ top: 28, behavior: "smooth" });
  }, [pathname]);

  return null; // No renderiza nada
};

export default ScrollToTop;
