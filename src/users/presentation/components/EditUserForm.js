"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { getUserData, updateUserData } from "../state/userSlice"
import { Label } from "./Label"
import { Input } from "./Input"
import { Button } from "./Button"

const EditUserForm = ({ user, setEditModal }) => {
  const [form, setForm] = useState(user)
  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await dispatch(updateUserData(form))
    await dispatch(getUserData())
    setEditModal(false)
  }

  const handleOnCancel = () => {
    setEditModal(false)
  }

  return (
    <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              placeholder="Nombre de usuario"
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleInputChange} placeholder="Teléfono" />
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="Dirección"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={handleOnCancel} className="bg-gray-300 hover:bg-gray-400">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserForm

