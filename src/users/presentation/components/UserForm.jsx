"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserData,
  getUserData,
  toggleOpenForm,
} from "../../application/userSlice";
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
} from "lucide-react";
import Button from "../../../shared/presentation/components/Button";
import Input from "../../../shared/presentation/components/Input";
import Label from "../../../shared/presentation/components/Label";

/* ------------------------------------------
 * Estado inicial del formulario
 * ------------------------------------------ */
const initialState = {
  username: "",
  email: "",
  password_: "",
  phone: "",
  address: "",
};

/* ------------------------------------------
 * Variantes de animación
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
 * Componente principal
 * ------------------------------------------ */
const UserForm = () => {
  const dispatch = useDispatch();
  const { isOpen, loading } = useSelector((state) => state.users);

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  /* --- Efecto apertura --- */
  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setErrors({});
    }
  }, [isOpen]);

  /* --- Cerrar modal --- */
  const handleClose = () => dispatch(toggleOpenForm());

  /* --- Validación --- */
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!form.username.trim())
      newErrors.username = "El nombre de usuario es requerido";
    if (!form.email.trim()) newErrors.email = "El correo electrónico es requerido";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Correo electrónico inválido";
    if (!form.password_.trim())
      newErrors.password_ = "La contraseña es requerida";
    else if (form.password_.length < 6)
      newErrors.password_ = "Debe tener al menos 6 caracteres";
    if (!form.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!form.address.trim()) newErrors.address = "La dirección es requerida";

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

  /* --- Input change --- */
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* --- Si no está abierto, no renderizar --- */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm rounded-lg rounded-s-3xl flex items-center justify-end p-4 z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-gray-100 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative overflow-y-auto max-h-screen no-scrollbar"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Botón cerrar */}
            <button
              onClick={handleClose}
              aria-label="Cerrar formulario"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors hover:cursor-pointer"
            >
              <X size={22} />
            </button>

            {/* Título */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Crear cliente online
            </h2>

            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:gap-4 scale-95"
            >
              {[
                {
                  id: "username",
                  label: "Nombre de usuario",
                  icon: <User />,
                  type: "text",
                },
                {
                  id: "email",
                  label: "Correo electrónico",
                  icon: <Mail />,
                  type: "email",
                },
                {
                  id: "password_",
                  label: "Contraseña",
                  icon: <Lock />,
                  type: "password",
                },
                {
                  id: "phone",
                  label: "Teléfono",
                  icon: <Phone />,
                  type: "text",
                },
                {
                  id: "address",
                  label: "Dirección",
                  icon: <MapPin />,
                  type: "text",
                },
              ].map(({ id, label, icon, type }) => (
                <div key={id} className="space-y-1">
                  <Label
                    htmlFor={id}
                    className="text-gray-700  text-sm sm:text-base"
                  >
                    {label}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                      className="pl-10 w-full rounded-md border-gray-300 text-gray-900 bg-white 
                                  
                                 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 
                                 transition-all duration-200"
                    />
                  </div>
                  {errors[id] && (
                    <p className="text-xs sm:text-sm text-red-500 ">
                      {errors[id]}
                    </p>
                  )}
                </div>
              ))}

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
