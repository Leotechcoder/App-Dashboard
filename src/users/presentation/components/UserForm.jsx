"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserData,
  getUserData,
  toggleOpenForm,
} from "@/users/application/userSlice";
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ------------------------------------------
 * Estado inicial
 * ------------------------------------------ */
const initialState = {
  username: "",
  email: "",
  password_: "",
  phone: "",
  address: "",
};

/* ------------------------------------------
 * Animaciones
 * ------------------------------------------ */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const formVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

/* ------------------------------------------
 * Componente
 * ------------------------------------------ */
const UserForm = () => {
  const dispatch = useDispatch();
  const { isOpen, loading } = useSelector((state) => state.users);

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setErrors({});
    }
  }, [isOpen]);

  const handleClose = () => dispatch(toggleOpenForm());

  /* --- Validación --- */
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!form.username.trim())
      newErrors.username = "El nombre de usuario es requerido";

    if (!form.email.trim())
      newErrors.email = "El correo electrónico es requerido";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Correo electrónico inválido";

    if (!form.password_.trim())
      newErrors.password_ = "La contraseña es requerida";
    else if (form.password_.length < 6)
      newErrors.password_ = "Debe tener al menos 6 caracteres";

    if (!form.phone.trim())
      newErrors.phone = "El teléfono es requerido";

    if (!form.address.trim())
      newErrors.address = "La dirección es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* --- Submit --- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(createUserData(form)).unwrap();
      dispatch(getUserData());
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  /* --- Input --- */
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end p-4
                     backdrop-blur-sm
                     bg-background/60"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="relative w-full max-w-md p-6 sm:p-8
                       rounded-2xl shadow-2xl
                       bg-bg-unit
                       border border-border
                       overflow-y-auto max-h-screen no-scrollbar"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              aria-label="Cerrar formulario"
              className="absolute top-4 right-4
                         text-primary
                         hover:text-primary/60 transition
                         hover:cursor-pointer"
            >
              <X size={22} />
            </button>

            {/* Title */}
            <h2 className="mb-4 text-xl sm:text-2xl font-bold
                           text-foreground">
              Crear cliente online
            </h2>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:gap-4 scale-95"
            >
              {[
                { id: "username", label: "Nombre de usuario", icon: <User className="h-4 w-4" />, type: "text" },
                { id: "email", label: "Correo electrónico", icon: <Mail className="h-4 w-4" />, type: "email" },
                { id: "password_", label: "Contraseña", icon: <Lock className="h-4 w-4" />, type: "password" },
                { id: "phone", label: "Teléfono", icon: <Phone className="h-4 w-4" />, type: "text" },
                { id: "address", label: "Dirección", icon: <MapPin className="h-4 w-4" />, type: "text" },
              ].map(({ id, label, icon, type }) => (
                <div key={id} className="space-y-1">
                  <Label
                    htmlFor={id}
                    className="text-sm sm:text-base text-muted-foreground"
                  >
                    {label}
                  </Label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                      {icon}
                    </span>

                    <Input
                      id={id}
                      name={id}
                      type={type}
                      value={form[id]}
                      onChange={handleInput}
                      placeholder={label}
                      aria-invalid={!!errors[id]}
                      className={cn(
                        "pl-10 w-full rounded-md bg-input text-foreground border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-all",
                        errors[id] && "border-destructive focus:border-destructive focus:ring-destructive"
                      )}
                    />
                  </div>

                  {errors[id] && (
                    <p className="text-xs sm:text-sm text-destructive mt-1">
                      {errors[id]}
                    </p>
                  )}
                </div>
              ))}

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-bold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition hover:cursor-pointer"
              >
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserForm;