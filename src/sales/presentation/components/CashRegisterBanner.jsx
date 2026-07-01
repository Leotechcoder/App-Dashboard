import { useState } from "react"
import { motion } from "framer-motion"
import { Banknote, DollarSign, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

/**
 * CashRegisterBanner
 *
 * Se muestra cuando la caja está CERRADA.
 * Reemplaza el FAB flotante (botón + en esquina) por un bloque visual
 * prominente al inicio de SalesDashboardView, dejando claro que la
 * primera acción del día es abrir la caja.
 *
 * Props:
 *  - onOpen(initialAmount: number) → async — handler de apertura
 *  - loading: boolean — deshabilita el botón mientras despacha
 */
export function CashRegisterBanner({ onOpen, loading = false }) {
  const [initialAmount, setInitialAmount] = useState("")

  const handleSubmit = async () => {
    const amount = parseFloat(initialAmount)

    if (isNaN(amount) || amount < 0) {
      toast.error("Ingresá un monto inicial válido (puede ser $0)")
      return
    }

    await onOpen(amount)
    setInitialAmount("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card
        className="
          border-2 border-[hsl(var(--yellow))]
          bg-[hsl(var(--yellow)/0.08)]
          shadow-sm
        "
      >
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">

            {/* Ícono + texto */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className="
                  rounded-xl p-3
                  bg-[hsl(var(--yellow)/0.15)]
                  text-[hsl(var(--yellow))]
                  shrink-0
                "
              >
                <Banknote className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[hsl(var(--yellow))]" />
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    Caja cerrada
                  </p>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                  Abrí la caja para empezar a registrar ventas del día
                </p>
              </div>
            </div>

            {/* Input monto + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full md:w-auto">
              <div className="space-y-1 w-full sm:w-44">
                <Label
                  htmlFor="banner-initial-amount"
                  className="text-xs text-[hsl(var(--muted-foreground))]"
                >
                  Monto inicial
                </Label>
                <div className="relative">
                  <span
                    className="
                      absolute left-3 top-1/2 -translate-y-1/2
                      text-sm text-[hsl(var(--muted-foreground))]
                    "
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                  </span>
                  <Input
                    id="banner-initial-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="pl-8 h-9 text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="
                  h-9 px-5 w-full sm:w-auto
                  bg-[hsl(var(--yellow))]
                  text-[hsl(var(--foreground))]
                  hover:bg-[hsl(var(--yellow)/0.85)]
                  hover:cursor-pointer
                  font-semibold
                  shrink-0
                "
              >
                {loading ? "Abriendo..." : "Abrir Caja"}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
