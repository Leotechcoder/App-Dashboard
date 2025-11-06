import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getUserAuth } from "@/users/application/userSlice";
import LoadingScreen from "../presentation/components/LoadingScreen.jsx";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { user, username } = useSelector((store) => store.users);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      // Si no hay usuario en redux, intentamos obtenerlo del backend
      if (!user || !username) {
        try {
          const result = await dispatch(getUserAuth()).unwrap(); // suponiendo que retorna user si está logueado
          if (result && result.username) {
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
        } catch (error) {
          setIsAuth(false);
        }
      } else {
        // Si ya hay usuario en redux
        setIsAuth(true);
      }
      setLoading(false);
    };

    verifyUser();
  }, [user, username, dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, redirige
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  // Si está logueado, renderiza las rutas internas
  return <Outlet />;
};

export default ProtectedRoute;
