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
      if (!formLog.password)
        nuevosErrores.password = "La contraseña es requerida";
    } else {
      if (!formReg.username)
        nuevosErrores.username = "El nombre de usuario es requerido";
      if (!formReg.email) nuevosErrores.email = "El correo es requerido";
      if (!formReg.password)
        nuevosErrores.password = "La contraseña es requerida";
      if (formReg.password.length < 6)
        nuevosErrores.password =
          "La contraseña debe tener al menos 6 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    if (esInicioSesion) {
      dispatch(setClosedSession(false));
      dispatch(loginUser(formLog));
    } else {
      dispatch(registerUser(formReg));
      cambiarFormulario();
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
      <h2 className="text-2xl font-bold text-center text-[hsl(var(--foreground))] mb-6">
        {esInicioSesion ? "Iniciar Sesión" : "Registrarse"}
      </h2>

      <form onSubmit={manejarEnvio} className="space-y-4">
        {!esInicioSesion && (
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
              Nombre de usuario
            </label>
            <div className="relative">
              <input
                name="username"
                type="text"
                value={formReg.username}
                onChange={manejarInput}
                onFocus={handleInputFocus}
                className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm
                  bg-[hsl(var(--background-unit))]
                  text-[hsl(var(--foreground))]
                  placeholder:text-[hsl(var(--login-placeholder))]
                  ${
                    errores.username
                      ? "border-[hsl(var(--destructive))]"
                      : "border-[hsl(var(--border))]"
                  }`}
                placeholder="JohnDoe123"
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            {errores.username && (
              <p className="mt-1 text-xs text-[hsl(var(--destructive))]">
                {errores.username}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
            Correo electrónico
          </label>
          <div className="relative">
            <input
              name="email"
              type="email"
              value={esInicioSesion ? formLog.email : formReg.email}
              onChange={manejarInput}
              onFocus={handleInputFocus}
              className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm
                bg-[hsl(var(--background-unit))]
                text-[hsl(var(--foreground))]
                placeholder:text-[hsl(var(--login-placeholder))]
                ${
                  errores.email
                    ? "border-[hsl(var(--destructive))]"
                    : "border-[hsl(var(--border))]"
                }`}
              placeholder="correo@ejemplo.com"
            />
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
          {errores.email && (
            <p className="mt-1 text-xs text-[hsl(var(--destructive))]">
              {errores.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              name="password"
              type={mostrarPassword ? "text" : "password"}
              value={esInicioSesion ? formLog.password : formReg.password}
              onChange={manejarInput}
              onFocus={handleInputFocus}
              className={`w-full pl-10 pr-10 py-2 border rounded-md shadow-sm
                bg-[hsl(var(--background-unit))]
                text-[hsl(var(--foreground))]
                placeholder:text-[hsl(var(--login-placeholder))]
                ${
                  errores.password
                    ? "border-[hsl(var(--destructive))]"
                    : "border-[hsl(var(--border))]"
                }`}
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[hsl(var(--primary))]" />

            <button
              type="button"
              onClick={() => setMostrarPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(var(--primary))]"
            >
              {mostrarPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errores.password && (
            <p className="mt-1 text-xs text-[hsl(var(--login-error))]">
              {errores.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full font-bold py-2 px-4 rounded-md transition
            bg-[hsl(var(--primary))]
            text-[hsl(var(--primary-foreground))]
            hover:bg-[hsl(var(--primary))]/90
            hover:cursor-pointer"
        >
          {esInicioSesion ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>

      {esInicioSesion && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(var(--primary))]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] rounded-sm">
                O continúa con
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleLoginGoogle}
              className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 rounded-md shadow-sm border
                bg-[hsl(var(--background-unit))]
                border-[hsl(var(--border))]
                text-[hsl(var(--foreground))]/85
                hover:bg-[hsl(var(--yellow))]/90
                hover:cursor-pointer"
            >
              <Github className="h-5 w-5" />
              Google
            </button>

            <button
              onClick={handleLoginFacebook}
              className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 rounded-md shadow-sm border
                bg-[hsl(var(--background-unit))]
                border-[hsl(var(--border))]
                text-[hsl(var(--foreground))]/85
                hover:bg-[hsl(var(--blue))]/90
                hover:cursor-pointer"
            >
              <Facebook className="h-5 w-5" />
              Facebook
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={cambiarFormulario}
          className="text-sm transition text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 hover:cursor-pointer"
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
