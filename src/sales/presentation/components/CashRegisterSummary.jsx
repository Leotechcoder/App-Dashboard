import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign, Clock, Calendar, TrendingUp, Banknote,
  CreditCard, Wallet, ArrowLeftRight, Package, TrendingDown,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"
import { useEffect, useState } from "react"

/**
 * CashRegisterSummary
 *
 * Muestra el estado de la caja activa (abierta o cerrada).
 * Cambios respecto a la versión anterior:
 *  - Tiempo de sesión actualizado en vivo cada 60s (useInterval interno)
 *  - Diferencia de caja: totalEsperado - montoInicial (solo cuando está abierta)
 *  - Se eliminó el console.log de debug de closedOrders
 *
 * Props:
 *  - cashRegister: object — objeto de caja del slice sales.activeCashRegister
 *  - analysis: object | null — cashRegisterAnalysis del hook useSalesData
 */
export function CashRegisterSummary({ cashRegister, analysis }) {
  if (!cashRegister) return null

  // ── Tiempo de sesión en vivo ──────────────────────────────────────────────
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    // Solo actualizamos si la caja está abierta (sin closedAt)
    if (cashRegister.closedAt) return

    const timer = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(timer)
  }, [cashRegister.closedAt])

  const durationMs = cashRegister.closedAt
    ? new Date(cashRegister.closedAt) - new Date(cashRegister.openedAt)
    : now - new Date(cashRegister.openedAt)

  const hours   = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  const durationLabel = `${hours}h ${minutes}m`

  // ── Diferencia de caja ────────────────────────────────────────────────────
  const isOpen = cashRegister.status === "open"
  const initialAmount = Number(cashRegister.initialAmount) || 0
  const expectedTotal = Number(analysis?.expectedTotal) || 0
  const cashDiff = expectedTotal - initialAmount   // puede ser negativa

  // ── Métodos de pago ───────────────────────────────────────────────────────
  const paymentCards = [
    {
      label: "Efectivo",
      value: analysis?.expectedCashAmount,
      icon: <Wallet className="h-4 w-4 text-[hsl(var(--green))]" />,
      colorClass: "text-[hsl(var(--green))]",
    },
    {
      label: "Débito",
      value: analysis?.expectedDebitAmount,
      icon: <CreditCard className="h-4 w-4 text-[hsl(var(--blue))]" />,
      colorClass: "text-[hsl(var(--blue))]",
    },
    {
      label: "Crédito",
      value: analysis?.expectedCreditAmount,
      icon: <CreditCard className="h-4 w-4 text-[hsl(var(--purpure))]" />,
      colorClass: "text-[hsl(var(--purpure))]",
    },
    {
      label: "Transferencia",
      value: analysis?.expectedTransferAmount,
      icon: <ArrowLeftRight className="h-4 w-4 text-[hsl(var(--yellow))]" />,
      colorClass: "text-[hsl(var(--yellow))]",
    },
  ].filter((m) => m.value && m.value > 0)

  return (
    <Card
      className={
        isOpen
          ? "border-[hsl(var(--green))] bg-[hsl(var(--green)/0.08)] text-[hsl(var(--foreground))]"
          : ""
      }
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Banknote className="h-4 w-4" />
          Estado de Caja
        </CardTitle>
        <Badge
          variant={isOpen ? "default" : "secondary"}
          className={
            isOpen
              ? "bg-[hsl(var(--green))] text-[hsl(var(--primary-foreground))]"
              : ""
          }
        >
          {isOpen ? "Abierta" : "Cerrada"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* ── Totales principales ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Monto inicial */}
          <div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Monto Inicial</p>
            </div>
            <p className="text-xl font-bold text-[hsl(var(--green))]">
              ${formatCurrency(initialAmount.toFixed(1))}
            </p>
          </div>

          {/* Total esperado + órdenes (solo caja abierta) */}
          {isOpen && analysis && (
            <>
              <div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Total Vendido</p>
                </div>
                <p className="text-xl font-bold text-[hsl(var(--primary))]">
                  ${formatCurrency(expectedTotal.toFixed(1))}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Órdenes</p>
                </div>
                <p className="text-xl font-bold text-[hsl(var(--foreground))]">
                  {analysis.ordersCount}
                </p>
              </div>

              {/* Diferencia de caja */}
              <div>
                <div className="flex items-center gap-1.5">
                  {cashDiff >= 0
                    ? <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--green))]" />
                    : <TrendingDown className="h-3.5 w-3.5 text-[hsl(var(--destructive))]" />
                  }
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Diferencia</p>
                </div>
                <p
                  className={`text-xl font-bold ${
                    cashDiff >= 0
                      ? "text-[hsl(var(--green))]"
                      : "text-[hsl(var(--destructive))]"
                  }`}
                >
                  {cashDiff >= 0 ? "+" : ""}${formatCurrency(cashDiff.toFixed(1))}
                </p>
              </div>
            </>
          )}

          {/* Monto final (caja cerrada) */}
          {!isOpen && cashRegister.finalAmount !== null && (
            <div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Monto Final</p>
              </div>
              <p className="text-xl font-bold text-[hsl(var(--green))]">
                ${formatCurrency(Number(cashRegister.finalAmount).toFixed(1))}
              </p>
            </div>
          )}
        </div>

        {/* ── Métodos de pago ───────────────────────────────────────────── */}
        {paymentCards.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-3">
            {paymentCards.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  {m.icon}
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{m.label}</p>
                </div>
                <p className={`text-lg font-semibold ${m.colorClass}`}>
                  ${formatCurrency(m.value.toFixed(1))}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Info temporal ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <div className="flex-1">
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Apertura</p>
              <p className="text-sm font-medium">
                {format(new Date(cashRegister.openedAt), "dd MMM yyyy, HH:mm", { locale: es })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <div className="flex-1">
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {isOpen ? "Duración (en curso)" : "Duración"}
              </p>
              <p className="text-sm font-medium">{durationLabel}</p>
            </div>
          </div>
        </div>

        {cashRegister.closedAt && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Calendar className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <div className="flex-1">
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Cierre</p>
              <p className="text-sm font-medium">
                {format(new Date(cashRegister.closedAt), "dd MMM yyyy, HH:mm", { locale: es })}
              </p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
