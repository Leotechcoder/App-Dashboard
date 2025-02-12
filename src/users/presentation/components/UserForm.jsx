"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createUserData, getUserData, toggleOpenForm } from "../../application/userSlice"
import { FiX, FiLoader } from "react-icons/fi"
import Button from "../../../shared/presentation/components/Button"
import Input from "../../../shared/presentation/components/Input"
// import { Label } from "./Label"

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
  const dispatch = useDispatch()

  useEffect(() => {
    if (isOpen) {
      setForm(initialState)
      setErrors({})
    }
  }, [isOpen])

  const handleClose = () => {
    dispatch(toggleOpenForm())
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
        alert("Usuario creado exitosamente")
      } catch (error) {
        alert(error.message || "Ha ocurrido un error al crear el usuario")
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
        >
          <FiX className="h-5 w-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Crear Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {/* <Label htmlFor="username">Nombre de usuario</Label> */}
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleInput}
              placeholder="Nombre de usuario"
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInput}
              placeholder="Correo electrónico"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_">Contraseña</Label>
            <Input
              id="password_"
              name="password_"
              type="password"
              value={form.password_}
              onChange={handleInput}
              placeholder="Contraseña"
              aria-invalid={errors.password_ ? "true" : "false"}
            />
            {errors.password_ && <p className="text-sm text-red-500">{errors.password_}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleInput}
              placeholder="Teléfono"
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleInput}
              placeholder="Dirección"
              aria-invalid={errors.address ? "true" : "false"}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <FiLoader className="mr-2 h-4 w-4 animate-spin inline" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default UserForm

