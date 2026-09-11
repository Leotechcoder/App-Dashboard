
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { validateTable } from "@/tables/domain/Table"

/**
 * Sirve tanto para crear como para editar.
 * Si recibe `table`, funciona en modo edición.
 */
export function TableFormModal({
  table,
  open,
  onOpenChange,
  onSubmit,
}) {
  const [values, setValues] = useState({
    number: 1,
    shape: "round",
    capacity: 4,
  })

  const [error, setError] = useState("")

  // Sincroniza el formulario cuando cambia la mesa
  // o cuando se abre en modo creación.
  useEffect(() => {
    if (table) {
      setValues({
        number: table.number,
        shape: table.shape,
        capacity: table.capacity,
      })
    } else {
      setValues({
        number: 1,
        shape: "round",
        capacity: 4,
      })
    }

    setError("")
  }, [table, open])

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateTable(values)

    if (Object.keys(errors).length) {
      setError(Object.values(errors)[0])
      return
    }

    setError("")
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-md
          max-h-[90vh]
          overflow-hidden
        "
      >
        <DialogHeader>
          <DialogTitle>
            {table ? `Editar Mesa ${table.number}` : "Nueva mesa"}
          </DialogTitle>

          <DialogDescription>
            Configurá la mesa para tu salón.
          </DialogDescription>
        </DialogHeader>

        <form
          id="table-form"
          onSubmit={handleSubmit}
          className="
            space-y-4
            overflow-y-auto
            pr-1
          "
        >
          <div className="space-y-2">
            <Label htmlFor="number">
              Número
            </Label>

            <Input
              id="number"
              type="number"
              min="1"
              autoFocus
              value={values.number}
              onChange={(e) =>
                setValues({
                  ...values,
                  number: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shape">
              Forma
            </Label>

            <Select
              value={values.shape}
              onValueChange={(value) =>
                setValues({
                  ...values,
                  shape: value,
                })
              }
            >
              <SelectTrigger id="shape">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="round">
                  Redonda
                </SelectItem>

                <SelectItem value="square">
                  Cuadrada
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">
              Capacidad
            </Label>

            <Input
              id="capacity"
              type="number"
              min="1"
              value={values.capacity}
              onChange={(e) =>
                setValues({
                  ...values,
                  capacity: Number(e.target.value),
                })
              }
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>

        <DialogFooter className="shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form="table-form"
          >
            {table ? "Guardar cambios" : "Agregar mesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

