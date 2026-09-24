import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  Landmark,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { SalesService } from "@/sales/application/SalesService"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

const PAYMENT_CONFIG = {
  cash: {
    label: "Efectivo",
    icon: Banknote,
    color:
      "text-[hsl(var(--green))]",
    iconBackground:
      "bg-[hsl(var(--green)/0.08)]",
  },
  credit: {
    label: "Crédito",
    icon: CreditCard,
    color:
      "text-[hsl(var(--primary))]",
    iconBackground:
      "bg-[hsl(var(--primary)/0.08)]",
  },
  debit: {
    label: "Débito",
    icon: CreditCard,
    color:
      "text-[hsl(var(--blue))]",
    iconBackground:
      "bg-[hsl(var(--blue)/0.08)]",
  },
  transfer: {
    label: "Transferencia",
    icon: Landmark,
    color:
      "text-[hsl(var(--yellow))]",
    iconBackground:
      "bg-[hsl(var(--yellow)/0.08)]",
  },
}

function PaymentSummaryRow({ method, amount }) {
  const config = PAYMENT_CONFIG[method]

  if (!config) return null

  const Icon = config.icon

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className={`
            flex h-8 w-8 shrink-0 items-center justify-center
            rounded-lg
            ${config.iconBackground}
            ${config.color}
          `}
        >
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-sm font-medium">
          {config.label}
        </span>
      </div>

      <span className="text-sm font-semibold tabular-nums">
        {formatCurrency(amount)}
      </span>
    </div>
  )
}

export function CloseCashRegisterDialog({
  open,
  onOpenChange,
  onConfirm,
  cashRegister,
  orders = [],
}) {
  const [finalAmount, setFinalAmount] = useState("")
  const [showSummary, setShowSummary] = useState(false)
  const [warning, setWarning] = useState("")

  useEffect(() => {
    if (!open) return

    setFinalAmount("")
    setShowSummary(false)
    setWarning("")
  }, [open])

  const initialAmount = Number(
    cashRegister?.initialAmount ??
      cashRegister?.initial_amount ??
      0
  )

  /**
   * Única fuente de verdad para los medios de pago.
   *
   * cash representa solamente el importe aplicado
   * a las ventas, no el efectivo recibido del cliente.
   */
  const paymentSummary = useMemo(
    () => SalesService.calculatePaymentSummary(orders),
    [orders]
  )

  const cashSalesTotal = paymentSummary.cash

  /**
   * El efectivo esperado físicamente en caja:
   *
   * monto inicial + efectivo cobrado
   */
  const expectedFinalAmount =
    initialAmount + cashSalesTotal

  const actualFinalAmount =
    Number.parseFloat(finalAmount) || 0

  const difference =
    actualFinalAmount - expectedFinalAmount

  const hasDifference =
    Math.abs(difference) >= 0.01

  const hasShortage =
    difference < -0.01

  const hasSurplus =
    difference > 0.01

  const duration = cashRegister?.openedAt
    ? Math.floor(
        (new Date() -
          new Date(cashRegister.openedAt)) /
          1000 /
          60
      )
    : 0

  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  const handleConfirm = () => {
    const amount = Number.parseFloat(finalAmount)

    if (Number.isNaN(amount) || amount < 0) {
      setWarning(
        "Ingresá un monto válido para continuar."
      )
      return
    }

    setWarning("")
    setShowSummary(true)
  }

  const handleFinalConfirm = () => {
    const amount = Number.parseFloat(finalAmount)

    if (Number.isNaN(amount) || amount < 0) {
      return
    }

    onConfirm(amount)

    setFinalAmount("")
    setShowSummary(false)
    setWarning("")
  }

  const handleCancel = () => {
    setFinalAmount("")
    setShowSummary(false)
    setWarning("")
    onOpenChange(false)
  }

  if (!cashRegister) return null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          flex
          w-[calc(100%-1.5rem)]
          max-w-3xl
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-2xl
          border-border/60
          bg-[hsl(var(--background-unit-2))]
          p-0
        "
      >
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key="input"
              initial={{
                opacity: 0,
                x: -12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 12,
              }}
              transition={{
                duration: 0.18,
              }}
              className="
                flex
                min-h-0
                flex-1
                flex-col
              "
            >
              {/* Header */}
              <DialogHeader
                className="
                  border-b
                  border-border/50
                  px-6
                  py-4
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[hsl(var(--primary)/0.25)]
                      bg-[hsl(var(--primary)/0.10)]
                      text-[hsl(var(--primary))]
                    "
                  >
                    <Banknote className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <DialogTitle className="text-base font-semibold">
                      Cerrar caja
                    </DialogTitle>

                    <DialogDescription className="mt-0.5 text-sm">
                      Registrá el efectivo contado y
                      verificá los cobros de la sesión.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Body */}
              <div
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  px-6
                  py-5
                "
              >
                <div className="space-y-5">
                  {/* Expected cash */}
                  <section
                    className="
                      rounded-xl
                      border
                      border-[hsl(var(--primary)/0.18)]
                      bg-[hsl(var(--primary)/0.06)]
                      p-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Efectivo esperado
                        </p>

                        <p
                          className="
                            mt-1
                            text-2xl
                            font-bold
                            tracking-tight
                          "
                        >
                          {formatCurrency(
                            expectedFinalAmount
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[hsl(var(--primary)/0.10)]
                          text-[hsl(var(--primary))]
                        "
                      >
                        <Banknote className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Monto inicial + efectivo cobrado
                      durante la sesión.
                    </p>
                  </section>

                  {/* Cash input */}
                  <section className="space-y-2">
                    <Label
                      htmlFor="finalAmount"
                      className="text-sm font-semibold"
                    >
                      Efectivo contado
                    </Label>

                    <p className="text-sm text-muted-foreground">
                      Contá todo el efectivo disponible
                      físicamente en la caja.
                    </p>

                    <div className="relative">
                      <Banknote
                        className="
                          absolute
                          left-3
                          top-1/2
                          h-5
                          w-5
                          -translate-y-1/2
                          text-muted-foreground
                        "
                      />

                      <Input
                        id="finalAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={finalAmount}
                        onChange={(event) => {
                          setFinalAmount(
                            event.target.value
                          )
                          setWarning("")
                        }}
                        className="
                          h-12
                          pl-10
                          text-lg
                          font-semibold
                        "
                        autoFocus
                      />
                    </div>

                    {warning && (
                      <div
                        className="
                          flex
                          items-start
                          gap-2
                          rounded-lg
                          border
                          border-[hsl(var(--destructive)/0.25)]
                          bg-[hsl(var(--destructive)/0.06)]
                          px-3
                          py-2.5
                          text-sm
                          text-[hsl(var(--destructive))]
                        "
                      >
                        <AlertCircle
                          className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                          "
                        />

                        <span>{warning}</span>
                      </div>
                    )}
                  </section>

                  {/* Payment summary */}
                  <section
                    className="
                      rounded-xl
                      border
                      border-border/50
                      bg-[hsl(var(--background-unit)/0.45)]
                    "
                  >
                    <div
                      className="
                        border-b
                        border-border/40
                        px-4
                        py-3
                      "
                    >
                      <div>
                        <h3 className="text-sm font-semibold">
                          Resumen de cobros
                        </h3>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Importes registrados durante
                          la sesión.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 p-4">
                      <PaymentSummaryRow
                        method="cash"
                        amount={paymentSummary.cash}
                      />

                      <PaymentSummaryRow
                        method="credit"
                        amount={paymentSummary.credit}
                      />

                      <PaymentSummaryRow
                        method="debit"
                        amount={paymentSummary.debit}
                      />

                      <PaymentSummaryRow
                        method="transfer"
                        amount={paymentSummary.transfer}
                      />

                      {paymentSummary.other > 0 && (
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            border-t
                            border-border/40
                            pt-3
                          "
                        >
                          <span className="text-sm text-muted-foreground">
                            Otros medios
                          </span>

                          <span className="text-sm font-semibold">
                            {formatCurrency(
                              paymentSummary.other
                            )}
                          </span>
                        </div>
                      )}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          border-t
                          border-border/50
                          pt-3
                        "
                      >
                        <span className="text-sm font-semibold">
                          Total cobrado
                        </span>

                        <span className="text-base font-bold">
                          {formatCurrency(
                            paymentSummary.total
                          )}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Session details */}
                  <section
                    className="
                      rounded-xl
                      border
                      border-border/50
                      bg-[hsl(var(--background-unit)/0.45)]
                    "
                  >
                    <div
                      className="
                        border-b
                        border-border/40
                        px-4
                        py-3
                      "
                    >
                      <div className="flex items-center gap-2">
                        <Clock3
                          className="
                            h-4
                            w-4
                            text-muted-foreground
                          "
                        />

                        <h3 className="text-sm font-semibold">
                          Detalle de la sesión
                        </h3>
                      </div>
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-x-6
                        gap-y-4
                        p-4
                        sm:grid-cols-4
                      "
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Apertura
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {format(
                            new Date(
                              cashRegister.openedAt
                            ),
                            "dd MMM, HH:mm",
                            { locale: es }
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duración
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {hours}h {minutes}m
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Monto inicial
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {formatCurrency(
                            initialAmount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total cobrado
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[hsl(var(--green))]">
                          {formatCurrency(
                            paymentSummary.total
                          )}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer */}
              <DialogFooter
                className="
                  border-t
                  border-border/50
                  bg-[hsl(var(--background-unit)/0.45)]
                  px-6
                  py-4
                  sm:justify-between
                "
              >
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={handleConfirm}
                  disabled={
                    !finalAmount ||
                    Number.parseFloat(finalAmount) < 0
                  }
                  className="gap-2"
                >
                  Revisar cierre
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{
                opacity: 0,
                x: 12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -12,
              }}
              transition={{
                duration: 0.18,
              }}
              className="
                flex
                min-h-0
                flex-1
                flex-col
              "
            >
              {/* Header */}
              <DialogHeader
                className="
                  border-b
                  border-border/50
                  px-6
                  py-4
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      ${
                        hasShortage
                          ? "border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.08)] text-[hsl(var(--destructive))]"
                          : hasSurplus
                            ? "border-[hsl(var(--yellow)/0.25)] bg-[hsl(var(--yellow)/0.08)] text-[hsl(var(--yellow))]"
                            : "border-[hsl(var(--green)/0.25)] bg-[hsl(var(--green)/0.08)] text-[hsl(var(--green))]"
                      }
                    `}
                  >
                    {hasShortage ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : hasSurplus ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <DialogTitle className="text-base font-semibold">
                      Revisar cierre
                    </DialogTitle>

                    <DialogDescription className="mt-0.5 text-sm">
                      Verificá el efectivo y el resumen
                      de cobros antes de cerrar la caja.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Body */}
              <div
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  px-6
                  py-5
                "
              >
                <div className="space-y-5">
                  {/* Cash result */}
                  <section
                    className={`
                      rounded-xl
                      border
                      p-4
                      ${
                        hasShortage
                          ? "border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.06)]"
                          : hasSurplus
                            ? "border-[hsl(var(--yellow)/0.25)] bg-[hsl(var(--yellow)/0.06)]"
                            : "border-[hsl(var(--green)/0.25)] bg-[hsl(var(--green)/0.06)]"
                      }
                    `}
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <div className="flex items-center gap-2">
                        {hasShortage ? (
                          <TrendingDown
                            className="
                              h-4
                              w-4
                              text-[hsl(var(--destructive))]
                            "
                          />
                        ) : hasSurplus ? (
                          <TrendingUp
                            className="
                              h-4
                              w-4
                              text-[hsl(var(--yellow))]
                            "
                          />
                        ) : (
                          <CheckCircle2
                            className="
                              h-4
                              w-4
                              text-[hsl(var(--green))]
                            "
                          />
                        )}

                        <span className="text-sm font-semibold">
                          {hasShortage
                            ? "Faltante detectado"
                            : hasSurplus
                              ? "Sobrante detectado"
                              : "Caja cuadrada"}
                        </span>
                      </div>

                      {!hasDifference && (
                        <Badge
                          variant="outline"
                          className="
                            border-[hsl(var(--green)/0.25)]
                            bg-[hsl(var(--green)/0.08)]
                            text-[hsl(var(--green))]
                          "
                        >
                          Sin diferencia
                        </Badge>
                      )}
                    </div>

                    <div
                      className="
                        mt-4
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-3
                      "
                    >
                      <div
                        className="
                          rounded-lg
                          border
                          border-border/40
                          bg-background/50
                          p-3
                        "
                      >
                        <p className="text-xs text-muted-foreground">
                          Efectivo esperado
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          {formatCurrency(
                            expectedFinalAmount
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          rounded-lg
                          border
                          border-border/40
                          bg-background/50
                          p-3
                        "
                      >
                        <p className="text-xs text-muted-foreground">
                          Efectivo contado
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          {formatCurrency(
                            actualFinalAmount
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          rounded-lg
                          border
                          border-border/40
                          bg-background/50
                          p-3
                        "
                      >
                        <p className="text-xs text-muted-foreground">
                          Diferencia
                        </p>

                        <p
                          className={`
                            mt-1
                            text-lg
                            font-bold
                            ${
                              hasShortage
                                ? "text-[hsl(var(--destructive))]"
                                : hasSurplus
                                  ? "text-[hsl(var(--yellow))]"
                                  : "text-[hsl(var(--green))]"
                            }
                          `}
                        >
                          {difference > 0
                            ? "+"
                            : ""}
                          {formatCurrency(
                            difference
                          )}
                        </p>
                      </div>
                    </div>

                    {hasDifference && (
                      <div
                        className={`
                          mt-4
                          rounded-lg
                          border
                          px-3
                          py-3
                          text-sm
                          ${
                            hasShortage
                              ? "border-[hsl(var(--destructive)/0.20)] text-[hsl(var(--destructive))]"
                              : "border-[hsl(var(--yellow)/0.20)] text-[hsl(var(--yellow))]"
                          }
                        `}
                      >
                        {hasShortage
                          ? "El efectivo contado es inferior al monto esperado. Revisá las operaciones antes de confirmar."
                          : "Hay más efectivo del esperado. Verificá el conteo y los movimientos registrados antes de confirmar."}
                      </div>
                    )}
                  </section>

                  {/* Payment summary */}
                  <section
                    className="
                      rounded-xl
                      border
                      border-border/50
                      bg-[hsl(var(--background-unit)/0.45)]
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-b
                        border-border/40
                        px-4
                        py-3
                      "
                    >
                      <div>
                        <h3 className="text-sm font-semibold">
                          Resumen de cobros
                        </h3>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Total registrado por medio de
                          pago.
                        </p>
                      </div>

                      <Badge variant="secondary">
                        {orders.length}{" "}
                        {orders.length === 1
                          ? "orden"
                          : "órdenes"}
                      </Badge>
                    </div>

                    <div className="space-y-3 p-4">
                      <PaymentSummaryRow
                        method="cash"
                        amount={paymentSummary.cash}
                      />

                      <PaymentSummaryRow
                        method="credit"
                        amount={paymentSummary.credit}
                      />

                      <PaymentSummaryRow
                        method="debit"
                        amount={paymentSummary.debit}
                      />

                      <PaymentSummaryRow
                        method="transfer"
                        amount={paymentSummary.transfer}
                      />

                      {paymentSummary.other > 0 && (
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            border-t
                            border-border/40
                            pt-3
                          "
                        >
                          <span className="text-sm text-muted-foreground">
                            Otros medios
                          </span>

                          <span className="text-sm font-semibold tabular-nums">
                            {formatCurrency(
                              paymentSummary.other
                            )}
                          </span>
                        </div>
                      )}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          border-t
                          border-border/50
                          pt-3
                        "
                      >
                        <span className="text-sm font-semibold">
                          Total cobrado
                        </span>

                        <span className="text-base font-bold tabular-nums">
                          {formatCurrency(
                            paymentSummary.total
                          )}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Session summary */}
                  <section
                    className="
                      rounded-xl
                      border
                      border-border/50
                      bg-[hsl(var(--background-unit)/0.45)]
                    "
                  >
                    <div
                      className="
                        border-b
                        border-border/40
                        px-4
                        py-3
                      "
                    >
                      <h3 className="text-sm font-semibold">
                        Resumen de la sesión
                      </h3>
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-4
                        p-4
                        sm:grid-cols-4
                      "
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Monto inicial
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {formatCurrency(
                            initialAmount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Efectivo cobrado
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[hsl(var(--green))]">
                          +{formatCurrency(
                            paymentSummary.cash
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Apertura
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {format(
                            new Date(
                              cashRegister.openedAt
                            ),
                            "dd MMM, HH:mm",
                            { locale: es }
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duración
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {hours}h {minutes}m
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Orders */}
                  {orders.length > 0 && (
                    <section
                      className="
                        rounded-xl
                        border
                        border-border/50
                        bg-[hsl(var(--background-unit)/0.45)]
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          border-b
                          border-border/40
                          px-4
                          py-3
                        "
                      >
                        <div>
                          <h3 className="text-sm font-semibold">
                            Órdenes de la sesión
                          </h3>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Operaciones consideradas
                            para este cierre.
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {orders.length}{" "}
                          {orders.length === 1
                            ? "orden"
                            : "órdenes"}
                        </Badge>
                      </div>

                      <div className="max-h-56 overflow-y-auto">
                        <Table>
                          <TableHeader
                            className="
                              sticky
                              top-0
                              bg-[hsl(var(--background-unit-2))]
                            "
                          >
                            <TableRow className="hover:bg-transparent">
                              <TableHead>ID</TableHead>
                              <TableHead>Cliente</TableHead>
                              <TableHead>Hora</TableHead>
                              <TableHead>Pago</TableHead>
                              <TableHead className="text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {orders.map((order) => {
                              const paymentAmounts =
                                SalesService.getPaymentAmounts(
                                  order
                                )

                              const paymentMethods =
                                Object.entries(
                                  paymentAmounts
                                )
                                  .filter(
                                    ([, amount]) =>
                                      Number(amount) > 0
                                  )
                                  .map(
                                    ([method]) =>
                                      SalesService.normalizePaymentMethod(
                                        method
                                      )
                                  )

                              const uniqueMethods = [
                                ...new Set(
                                  paymentMethods
                                ),
                              ]

                              return (
                                <TableRow
                                  key={order.id}
                                >
                                  <TableCell className="font-medium">
                                    #
                                    {order.orderNumber ||
                                      order.id}
                                  </TableCell>

                                  <TableCell>
                                    {order.customerName ||
                                      "—"}
                                  </TableCell>

                                  <TableCell>
                                    {format(
                                      new Date(
                                        order.paidAt ??
                                          order.paid_at ??
                                          order.createdAt ??
                                          order.created_at
                                      ),
                                      "HH:mm",
                                      { locale: es }
                                    )}
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {uniqueMethods.map(
                                        (method) => {
                                          const config =
                                            PAYMENT_CONFIG[
                                              method
                                            ]

                                          if (!config) {
                                            return null
                                          }

                                          const Icon =
                                            config.icon

                                          return (
                                            <Badge
                                              key={method}
                                              variant="outline"
                                              className={`
                                                gap-1
                                                ${config.color}
                                              `}
                                            >
                                              <Icon className="h-3 w-3" />
                                              {
                                                config.label
                                              }
                                            </Badge>
                                          )
                                        }
                                      )}
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-right font-semibold tabular-nums">
                                    {formatCurrency(
                                      order.total ??
                                        order.totalAmount ??
                                        0
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* Footer */}
              <DialogFooter
                className="
                  border-t
                  border-border/50
                  bg-[hsl(var(--background-unit)/0.45)]
                  px-6
                  py-4
                  sm:justify-between
                "
              >
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowSummary(false)
                  }
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a editar
                </Button>

                <Button
                  onClick={handleFinalConfirm}
                  variant={
                    hasShortage
                      ? "destructive"
                      : "default"
                  }
                  className="gap-2"
                >
                  {hasShortage
                    ? "Confirmar cierre con faltante"
                    : "Confirmar cierre"}

                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}