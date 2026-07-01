import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  loginUserFacebook,
  loginUserGoogle,
  registerUser,
  setClosedSession,
} from "../../application/userSlice.js";
import { Eye, EyeOff, Mail, Lock, User, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...props}>
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.89c2.28-2.1 3.53-5.2 3.53-8.8z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.89-2.98c-1.08.72-2.45 1.16-4.04 1.16-3.11 0-5.74-2.1-6.68-4.92H1.31v3.09C3.28 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.32 14.34c-.24-.72-.38-1.49-.38-2.34s.14-1.62.38-2.34V6.57H1.31A11.97 11.97 0 000 12c0 1.93.46 3.76 1.31 5.43l4.01-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.94 1.19 15.24 0 12 0 7.31 0 3.28 2.7 1.31 6.57l4.01 3.09c.94-2.82 3.57-4.91 6.68-4.91z"
    />
  </svg>
);

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
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">
        {esInicioSesion ? "Iniciar Sesión" : "Registrarse"}
      </h2>

      <form onSubmit={manejarEnvio} className="space-y-4">
        {!esInicioSesion && (
          <div className="space-y-1">
            <Label htmlFor="username" className="text-muted-foreground">
              Nombre de usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                id="username"
                name="username"
                type="text"
                value={formReg.username}
                onChange={manejarInput}
                onFocus={handleInputFocus}
                aria-invalid={!!errores.username}
                placeholder="JohnDoe123"
                className={cn(
                  "pl-10 bg-bg-unit text-foreground placeholder:text-input-placeholder",
                  errores.username ? "border-destructive" : "border-border"
                )}
              />
            </div>
            {errores.username && (
              <p className="text-xs text-destructive">{errores.username}</p>
            )}
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="email" className="text-muted-foreground">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              id="email"
              name="email"
              type="email"
              value={esInicioSesion ? formLog.email : formReg.email}
              onChange={manejarInput}
              onFocus={handleInputFocus}
              aria-invalid={!!errores.email}
              placeholder="correo@ejemplo.com"
              className={cn(
                "pl-10 bg-bg-unit text-foreground placeholder:text-input-placeholder",
                errores.email ? "border-destructive" : "border-border"
              )}
            />
          </div>
          {errores.email && (
            <p className="text-xs text-destructive">{errores.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-muted-foreground">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              id="password"
              name="password"
              type={mostrarPassword ? "text" : "password"}
              value={esInicioSesion ? formLog.password : formReg.password}
              onChange={manejarInput}
              onFocus={handleInputFocus}
              aria-invalid={!!errores.password}
              placeholder="••••••••"
              className={cn(
                "pl-10 pr-10 bg-bg-unit text-foreground placeholder:text-input-placeholder",
                errores.password ? "border-destructive" : "border-border"
              )}
            />
            <button
              type="button"
              onClick={() => setMostrarPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:cursor-pointer"
            >
              {mostrarPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errores.password && (
            <p className="text-xs text-destructive">{errores.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full font-bold hover:cursor-pointer"
        >
          {esInicioSesion ? "Iniciar Sesión" : "Registrarse"}
        </Button>
      </form>

      {esInicioSesion && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-primary" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground rounded-sm">
                O continúa con
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleLoginGoogle}
              className="w-full bg-bg-unit border-border text-foreground/85 transition-colors hover:bg-bg-unit hover:border-yellow hover:text-yellow hover:cursor-pointer"
            >
              <GoogleIcon />
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleLoginFacebook}
              className="w-full bg-bg-unit border-border text-foreground/85 transition-colors hover:bg-bg-unit hover:border-blue hover:text-blue hover:cursor-pointer"
            >
              <Facebook className="h-5 w-5" />
              Facebook
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={cambiarFormulario}
          className="text-sm transition text-primary hover:text-primary/80 hover:cursor-pointer"
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