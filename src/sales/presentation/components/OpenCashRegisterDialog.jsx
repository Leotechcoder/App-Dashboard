
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"
import { useCashRegister } from "../hooks/useCashRegister"
import { toast } from "sonner"

export function OpenCashRegisterDialog({ open, onOpenChange }) {
  const [initialAmount, setInitialAmount] = useState("")
  const { handleOpenCashRegister, loading } = useCashRegister()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const amount = Number.parseFloat(initialAmount)
    if (isNaN(amount) || amount < 0) {
      toast.error( "Por favor ingresa un monto válido")
      return
    }

    const result = await handleOpenCashRegister(amount)

    if (result.type.includes("fulfilled")) {
      toast.info( `Caja abierta con $${amount.toFixed(2)}`)
      setInitialAmount("")
      onOpenChange(false)
    } else {
      toast.error( "No se pudo abrir la caja")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Abrir Caja
          </DialogTitle>
          <DialogDescription>Ingresa el monto inicial con el que abres la caja</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="initialAmount">Monto Inicial</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="initialAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Abriendo..." : "Abrir Caja"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
