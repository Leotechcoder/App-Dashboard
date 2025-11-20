import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getUserAuth } from "@/users/application/userSlice";
import { initializeAppData } from "@/shared/application/slices/appSlice.js";
import LoadingScreen from "../presentation/components/LoadingScreen.jsx";

const ProtectedRoute = () => {
  const dispatch = useDispatch();

  const { user, username, sessionClosed } = useSelector((store) => store.users);
  const { initialized } = useSelector((store) => store.app);

  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      // 🛑 1. Evitar llamadas si sabemos que la sesión fue cerrada manualmente
      if (sessionClosed) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        let authenticated = false;

        // 🟡 2. Si no hay datos en redux, recién ahí llama al backend
        if (!user || !username) {
          const result = await dispatch(getUserAuth()).unwrap();
          authenticated = !!result?.username;
        } else {
          authenticated = true;
        }

        // 🟢 3. Si está autenticado
        if (authenticated) {
          setIsAuth(true);

          // Inicializar datos globales solo si no se hizo antes
          if (!initialized) {
            await dispatch(initializeAppData());
          }
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [user, username, sessionClosed, initialized, dispatch]);

  if (loading) return <LoadingScreen />;

  if (!isAuth) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
