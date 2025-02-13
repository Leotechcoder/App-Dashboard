"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createUserData, getUserData, toggleOpenForm } from "../../application/userSlice"
import { X, Loader2, CheckCircle, AlertCircle, User, Mail, Lock, Phone, MapPin } from "lucide-react"
import Button from "../../../shared/presentation/components/Button"
import Input from "../../../shared/presentation/components/Input"
import Label from "../../../shared/presentation/components/Label"

const initialState = {
  username: "",
  email: "",
  password_: "",
  phone: "",
  address: "",
}

const UserForm = () => {
  const { isOpen, isLoading, error } = useSelector((store) => store.users)
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState(null)
  const [animate, setAnimate] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isOpen) {
      setForm(initialState)
      setErrors({})
      setTimeout(() => setAnimate(true), 10)
    } else {
      setAnimate(false)
    }
  }, [isOpen])

  const handleClose = () => {
    setAnimate(false)
    setTimeout(() => dispatch(toggleOpenForm()), 300)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.username.trim()) newErrors.username = "El nombre de usuario es requerido"
    if (!form.email.trim()) newErrors.email = "El correo electrónico es requerido"
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Correo electrónico inválido"
    if (!form.password_.trim()) newErrors.password_ = "La contraseña es requerida"
    else if (form.password_.length < 6) newErrors.password_ = "La contraseña debe tener al menos 6 caracteres"
    if (!form.phone.trim()) newErrors.phone = "El teléfono es requerido"
    if (!form.address.trim()) newErrors.address = "La dirección es requerida"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        await dispatch(createUserData(form)).unwrap()
        dispatch(getUserData())
        setForm(initialState)
        handleClose()
        showNotification("Usuario creado exitosamente", "success")
      } catch (error) {
        showNotification(error.message || "Ha ocurrido un error al crear el usuario", "error")
      }
    }
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-end p-4 z-50">
     <div
        className={`bg-gray-200 dark:bg-gray-600 rounded-lg shadow-xl w-full max-w-md p-6 relative transition-transform duration-300 transform ${
          animate ? "translate-x-0" : "translate-x-full"
        } max-h-[100vh] overflow-y-auto no-scrollbar`}
      >

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">Crear Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-6 scale-90">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 dark:text-gray-200">
              Nombre de usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleInput}
                placeholder="Nombre de usuario"
                aria-invalid={errors.username ? "true" : "false"}
                className="pl-10 w-full rounded-md border-gray-300 text-gray-900 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>
            {errors.username && <p className="text-sm text-red-500 dark:text-red-400">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
              Correo electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInput}
                placeholder="Correo electrónico"
                aria-invalid={errors.email ? "true" : "false"}
                className="pl-10 w-full rounded-md border-gray-300 text-gray-900 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>
            {errors.email && <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_" className="text-gray-700 dark:text-gray-200">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="password_"
                name="password_"
                type="password"
                value={form.password_}
                onChange={handleInput}
                placeholder="Contraseña"
                aria-invalid={errors.password_ ? "true" : "false"}
                className="pl-10 w-full rounded-md border-gray-300 text-gray-900 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>
            {errors.password_ && <p className="text-sm text-red-500 dark:text-red-400">{errors.password_}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-200">
              Teléfono
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleInput}
                placeholder="Teléfono"
                aria-invalid={errors.phone ? "true" : "false"}
                className="pl-10 w-full rounded-md border-gray-300 text-gray-900 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>
            {errors.phone && <p className="text-sm text-red-500 dark:text-red-400">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700 dark:text-gray-200">
              Dirección
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleInput}
                placeholder="Dirección"
                aria-invalid={errors.address ? "true" : "false"}
                className="pl-10 w-full rounded-md border-gray-300 text-gray-900 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>
            {errors.address && <p className="text-sm text-red-500 dark:text-red-400">{errors.address}</p>}
          </div>

          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </form>

        {notification && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white flex items-center transition-all duration-300 transform translate-y-0`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="mr-2" size={20} />
            ) : (
              <AlertCircle className="mr-2" size={20} />
            )}
            {notification.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserForm

