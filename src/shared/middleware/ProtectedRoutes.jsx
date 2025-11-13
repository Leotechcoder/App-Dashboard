import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getUserAuth } from "@/users/application/userSlice";
import { initializeAppData } from "@/shared/application/slices/appSlice.js";
import LoadingScreen from "../presentation/components/LoadingScreen.jsx";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { user, username } = useSelector((store) => store.users);
  const { initialized } = useSelector((store) => store.app);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        let authenticated = false;

        // Si no hay usuario en redux, intentamos obtenerlo del backend
        if (!user || !username) {
          const result = await dispatch(getUserAuth()).unwrap();
          authenticated = !!result?.username;
        } else {
          authenticated = true;
        }

        if (authenticated) {
          setIsAuth(true);
          // 👇 Cargar datos globales solo si no están inicializados
          if (!initialized) {
            await dispatch(initializeAppData());
          }
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [user, username, initialized, dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
