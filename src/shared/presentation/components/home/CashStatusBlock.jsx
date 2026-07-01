import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Banknote, ArrowRight, Clock } from "lucide-react"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"
import { useEffect, useState } from "react"

/**
 * CashStatusBlock
 * Bloque del OperationCenter que muestra el estado actual de la caja.
 * Lee directamente del slice sales — sin nuevas llamadas API.
 */
export function CashStatusBlock() {
  const navigate = useNavigate()
  const activeCashRegister = useSelector((state) => state.sales.activeCashRegister)

  const isOpen = activeCashRegister?.status === "open"

  // Duración en vivo (actualiza cada 60s si está abierta)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!isOpen) return
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [isOpen])

  const durationLabel = (() => {
    if (!activeCashRegister?.openedAt) return "—"
    const ms = (activeCashRegister.closedAt ? new Date(activeCashRegister.closedAt) : now)
      - new Date(activeCashRegister.openedAt)
    const h = Math.floor(ms / 3_600_000)
    const m = Math.floor((ms % 3_600_000) / 60_000)
    return `${h}h ${m}m`
  })()

  return (
    <Card className={`h-full ${isOpen
      ? "border-[hsl(var(--green))] bg-[hsl(var(--green)/0.07)]"
      : "border-[hsl(var(--yellow))] bg-[hsl(var(--yellow)/0.06)]"}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Banknote className="h-4 w-4" />
          Estado de Caja
        </CardTitle>
        <Badge className={isOpen
          ? "bg-[hsl(var(--green))] text-white"
          : "bg-[hsl(var(--yellow))] text-[hsl(var(--foreground))]"}
        >
          {isOpen ? "Abierta" : "Cerrada"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {isOpen && activeCashRegister ? (
          <>
            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Monto inicial</p>
              <p className="text-2xl font-bold text-[hsl(var(--green))]">
                ${formatCurrency(Number(activeCashRegister.initialAmount).toFixed(0))}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              <Clock className="h-3.5 w-3.5" />
              <span>Sesión: {durationLabel}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            La caja no está abierta todavía. Abrila desde Ventas para empezar a registrar.
          </p>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 gap-1.5 hover:cursor-pointer"
          onClick={() => navigate("/admin/ventas")}
        >
          Ir a Ventas <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  )
}