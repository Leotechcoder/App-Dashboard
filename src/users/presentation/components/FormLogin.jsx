import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  loginUserFacebook,
  loginUserGoogle,
  registerUser,
  setClosedSession,
} from "../../application/userSlice.js";
import { Eye, EyeOff, Mail, Lock, User, Facebook, Github } from "lucide-react";

const estadoInicialLog = { email: "", password: "" };
const initialState = { username: "", email: "", password: "" };

export const FormLogin = ({ onExpandChange, isExpanded }) => {
  const { error } = useSelector((store) => store.users);

  const [formLog, setFormLog] = useState(estadoInicialLog);
  const [formReg, setFormReg] = useState(initialState);
  const [esInicioSesion, setEsInicioSesion] = useState(true);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errores, setErrores] = useState({});

  const dispatch = useDispatch();

  // Mostrar errores del servidor
  useEffect(() => {
    if (error) {
      setErrores((prev) => ({ ...prev, general: error }));
    }
  }, [error]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (esInicioSesion) {
      if (!formLog.email) nuevosErrores.email = "El correo es requerido";
      if (!formLog.password) nuevosErrores.password = "La contraseña es requerida";
    } else {
      if (!formReg.username) nuevosErrores.username = "El nombre de usuario es requerido";
      if (!formReg.email) nuevosErrores.email = "El correo es requerido";
      if (!formReg.password) nuevosErrores.password = "La contraseña es requerida";
      if (formReg.password.length < 6)
        nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    if (esInicioSesion) {
      dispatch(setClosedSession())
      dispatch(loginUser(formLog));
    } else {
      dispatch(registerUser(formReg));
    }

    setFormLog(estadoInicialLog);
    setFormReg(initialState);
  };

  const manejarInput = (e) => {
    const { name, value } = e.target;

    if (esInicioSesion) {
      setFormLog((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormReg((prev) => ({ ...prev, [name]: value }));
    }

    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const cambiarFormulario = () => {
    setEsInicioSesion((prev) => !prev);
    setErrores({});
  };

  const handleLoginGoogle = () => dispatch(loginUserGoogle());
  const handleLoginFacebook = () => dispatch(loginUserFacebook());

  // Expansión móvil solo cuando hace falta
  const handleInputFocus = () => {
    if (!isExpanded && window.innerWidth <= 1024) {
      onExpandChange(true);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {esInicioSesion ? "Iniciar Sesión" : "Registrarse"}
      </h2>

      <form onSubmit={manejarEnvio} className="space-y-4">
        {!esInicioSesion && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <div className="relative">
              <input
                name="username"
                type="text"
                value={formReg.username}
                onChange={manejarInput}
                onFocus={handleInputFocus}
                className={`w-full pl-10 pr-3 py-2 border ${
                  errores.username ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
                placeholder="JohnDoe123"
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {errores.username && (
              <p className="mt-1 text-xs text-red-500">{errores.username}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <div className="relative">
            <input
              name="email"
              type="email"
              value={esInicioSesion ? formLog.email : formReg.email}
              onChange={manejarInput}
              onFocus={handleInputFocus}
              className={`w-full pl-10 pr-3 py-2 border ${
                errores.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
              placeholder="correo@ejemplo.com"
            />
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errores.email && (
            <p className="mt-1 text-xs text-red-500">{errores.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              name="password"
              type={mostrarPassword ? "text" : "password"}
              value={esInicioSesion ? formLog.password : formReg.password}
              onChange={manejarInput}
              onFocus={handleInputFocus}
              className={`w-full pl-10 pr-10 py-2 border ${
                errores.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <button
              type="button"
              onClick={() => setMostrarPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {mostrarPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errores.password && (
            <p className="mt-1 text-xs text-red-500">{errores.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {esInicioSesion ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>

      {esInicioSesion && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleLoginGoogle}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
              <Github className="h-5 w-5" />
              <span className="ml-2">Google</span>
            </button>

            <button
              onClick={handleLoginFacebook}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span className="ml-2">Facebook</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={cambiarFormulario}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          {esInicioSesion
            ? "¿No tienes una cuenta? Regístrate"
            : "¿Ya tienes una cuenta? Inicia sesión"}
        </button>
      </div>
    </div>
  );
};

export default FormLogin;
