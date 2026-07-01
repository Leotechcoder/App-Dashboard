
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { getUserData, updateUserData } from "../../application/userSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save } from "lucide-react"

const EditUserForm = ({ user, setEditModal }) => {
  const [form, setForm] = useState(user)
  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const refactorForm = {
      id: form.id,
      username: form.username,
      phone: form.phone,
      address: form.address,
    }
    await dispatch(updateUserData(refactorForm))
    dispatch(getUserData())
    setEditModal(false)
  }

  const handleOnCancel = () => setEditModal(false)

  return (
    <AnimatePresence>
      <motion.div
        key="edit-user-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="
          fixed inset-0 z-50 flex items-center justify-center
          bg-[hsl(var(--dialog-overlay))]
          backdrop-blur-sm  supports-backdrop-filter:backdrop-blur-sm
          py-6 pl-32
        "
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="w-full max-w-lg rounded-2xl"
        >
          <Card
            className="
              rounded-2xl overflow-hidden shadow-lg
              bg-bg-unit
              border border-border
            "
          >
            <CardHeader className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-4 w-full">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleOnCancel}
                  className="
                    text-muted-foreground
                    hover:text-primary
                    hover:cursor-pointer
                    transition-colors
                  "
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                  Editar Perfil
                </CardTitle>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-6 py-6">
                <div className="grid gap-2">
                  <Label
                    htmlFor="username"
                    className="text-muted-foreground"
                  >
                    Nombre de Usuario
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    placeholder="Nombre de usuario"
                    className="
                      bg-input
                      text-foreground
                      border-border
                      focus:ring-2 focus:ring-primary
                    "
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="phone"
                    className="text-muted-foreground"
                  >
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                    className="
                      bg-input
                      text-foreground
                      border-border
                      focus:ring-2 focus:ring-primary
                    "
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="address"
                    className="text-muted-foreground"
                  >
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder="Dirección"
                    className="
                      bg-input
                      text-foreground
                      border-border
                      focus:ring-2 focus:ring-primary
                    "
                  />
                </div>
              </CardContent>

              <Separator className="bg-border" />

              <CardFooter className="flex justify-end gap-3 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOnCancel}
                  className="
                    bg-secondary
                    text-secondary-foreground
                    hover:bg-secondary/80
                    hover:cursor-pointer
                  "
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  className="
                    flex items-center gap-2
                  "
                >
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EditUserForm
