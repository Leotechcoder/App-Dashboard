
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  ArrowLeft,
  ArrowLeftRight,
  Calendar,
  Clock,
  CreditCard,
  Package,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { fetchCashRegisterOrders } from "@/sales/application/salesThunks"
import { SalesService } from "@/sales/application/SalesService"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"
import { formatDateToArg, formatLocal } from "@/shared/utils/formatDateToArg"

/* ------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------ */

function getDurationLabel(openedAt, closedAt) {
  if (!openedAt || !closedAt) return "—"
  const ms = new Date(closedAt) - new Date(openedAt)
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return `${h}h ${m}m`
}

function DetailField({ label, value, valueClassName = "" }) {
  return (
    <div className="flex min-w-0 gap-2 text-xs leading-5">
      <span className="shrink-0 text-muted-foreground">{label}:</span>
      <span className={`min-w-0 truncate text-foreground/85 ${valueClassName}`}>
        {value || "—"}
      </span>
    </div>
  )
}

const PAYMENT_METHODS = [
  { key: "cash", label: "Efectivo", icon: Wallet, colorClass: "text-green" },
  { key: "debit", label: "Débito", icon: CreditCard, colorClass: "text-blue" },
  { key: "credit", label: "Crédito", icon: CreditCard, colorClass: "text-purple" },
  { key: "transfer", label: "Transferencia", icon: ArrowLeftRight, colorClass: "text-yellow" },
]

/**
 * CashRegisterClosingDetail
 *
 * Detalle completo de un cierre de caja pasado: desglose de ventas por
 * método de pago, diferencia contra lo esperado en efectivo, y listado
 * de las órdenes incluidas en esa sesión.
 *
 * Las órdenes de la caja no se persisten junto al cierre, así que se
 * reconstruyen pidiendo las órdenes cerradas en el rango [openedAt,
 * closedAt] de esa caja (o filtrando por cashRegisterId si el backend
 * ya lo adjunta a la orden) — mismo criterio que usa useSalesData para
 * la caja activa.
 *
 * Props:
 *  - register: CashRegisterEntity (debe tener status "closed")
 *  - onBack: () => void
 */
export function CashRegisterClosingDetail({ register, onBack }) {
  const dispatch = useDispatch()
  const closedOrders = useSelector((state) => state.sales.closingSessionOrders)
  const loading = useSelector((state) => state.sales.loadingClosingSession)

  useEffect(() => {
    if (!register) return
    dispatch(
      fetchCashRegisterOrders({
        startDate: formatLocal(register.openedAt),
        endDate: formatLocal(register.closedAt),
      })
    )
  }, [register, dispatch])

  const sessionOrders = useMemo(() => {
    if (!register) return []

    const byRegisterId = closedOrders.filter(
      (o) => o.cashRegisterId && String(o.cashRegisterId) === String(register.id)
    )

    if (byRegisterId.length > 0) return byRegisterId

    // Fallback: sin cashRegisterId en la orden, filtramos por rango horario
    return SalesService.filterOrdersByTimeRange(closedOrders, register.openedAt, register.closedAt)
  }, [closedOrders, register])

  const paymentSummary = useMemo(
    () => SalesService.calculatePaymentSummary(sessionOrders),
    [sessionOrders]
  )

  const discrepancy = useMemo(
    () =>
      SalesService.calculateDiscrepancy(
        register?.initialAmount,
        register?.finalAmount,
        paymentSummary.cash
      ),
    [register, paymentSummary]
  )

  const analysis = useMemo(() => SalesService.analyzeDiscrepancy(discrepancy), [discrepancy])

  if (!register) return null

  const expectedFinal = Number(register.initialAmount || 0) + paymentSummary.cash

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Volver */}
      <Button variant="ghost" size="sm" onClick={onBack} className="hover:cursor-pointer">
        <ArrowLeft className="h-4 w-4" />
        Volver al historial
      </Button>

      {/* Resumen del cierre */}
      <div className="rounded-xl border border-border bg-bg-unit p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Cierre de Caja #{register.id}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(register.openedAt), "dd MMM yyyy, HH:mm", { locale: es })}
                {" → "}
                {format(new Date(register.closedAt), "dd MMM yyyy, HH:mm", { locale: es })}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {getDurationLabel(register.openedAt, register.closedAt)}
              </span>
            </div>
          </div>

          <Badge
            className={
              analysis.severity === "success"
                ? "bg-green text-primary-foreground"
                : analysis.severity === "warning"
                ? "bg-yellow text-foreground"
                : "bg-destructive text-destructive-foreground"
            }
          >
            {analysis.message}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1 border-y border-border py-3 sm:grid-cols-2">
          <DetailField label="Abierta por" value={register.openedBy} />
          <DetailField label="Cerrada por" value={register.closedBy} />
          <DetailField label="Monto inicial" value={`$${formatCurrency(register.initialAmount)}`} />
          <DetailField
            label="Monto final contado"
            value={`$${formatCurrency(register.finalAmount)}`}
            valueClassName="font-semibold"
          />
        </div>

        {/* Totales */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Total vendido</p>
            <p className="text-xl font-bold text-primary">${formatCurrency(paymentSummary.total)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Efectivo esperado</p>
            <p className="text-xl font-bold text-green">${formatCurrency(expectedFinal)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Órdenes</p>
            <p className="text-xl font-bold text-foreground">{sessionOrders.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Diferencia</p>
            <p
              className={`flex items-center gap-1 text-xl font-bold ${
                discrepancy >= 0 ? "text-green" : "text-destructive"
              }`}
            >
              {discrepancy >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {discrepancy >= 0 ? "+" : ""}${formatCurrency(Math.abs(discrepancy))}
            </p>
          </div>
        </div>

        {/* Desglose por método de pago */}
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ventas por método de pago
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PAYMENT_METHODS.map(({ key, label, icon: Icon, colorClass }) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
                <p className={`text-lg font-semibold ${colorClass}`}>
                  ${formatCurrency(paymentSummary[key] || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Órdenes de la sesión */}
      <div className="rounded-xl border border-border bg-bg-unit">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Package className="h-4 w-4 text-primary" />
            Órdenes de la sesión
          </h3>
          <span className="text-xs text-muted-foreground">
            {sessionOrders.length} {sessionOrders.length === 1 ? "orden" : "órdenes"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    Cargando órdenes...
                  </TableCell>
                </TableRow>
              ) : sessionOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    No se encontraron órdenes para esta sesión
                  </TableCell>
                </TableRow>
              ) : (
                sessionOrders.map((order) => {
                  const amounts = order.paymentInfo?.amounts || order.payment_info?.amounts || {}
                  const methods = Object.keys(amounts).filter((m) => Number(amounts[m]) > 0)

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.orderNumber ?? order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        {format(new Date(order.paidAt || order.createdAt), "dd MMM, HH:mm", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="capitalize">
                        {methods.length > 0 ? methods.join(", ") : "—"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${formatCurrency(order.total)}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  )
}