import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Banknote,
  Check,
  CreditCard,
  Landmark,
  Wallet,
  ArrowRight,
  AlertCircle,
  Coins,
} from "lucide-react";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";
import { PAYMENT_OPTIONS } from "./ordersTable.constants";

// Las keys tienen que coincidir con las de PAYMENT_OPTIONS
const PAYMENT_ICONS = {
  efectivo: Banknote,
  credito: CreditCard,
  debito: Wallet,
  transferencia: Landmark,
};

const CloseOrderDialog = ({
  order,
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [payments, setPayments] = useState({});
  const [amounts, setAmounts] = useState({});
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (open) {
      setPayments({});
      setAmounts({});
      setWarning(false);
    }
  }, [open, order?.id]);

  const handlePaymentSelect = (method) => {
    setWarning(false);

    setPayments((prev) => {
      const next = { ...prev };

      if (next[method]) {
        delete next[method];

        setAmounts((current) => {
          const nextAmounts = { ...current };
          delete nextAmounts[method];
          return nextAmounts;
        });
      } else {
        next[method] = true;

        setAmounts((current) => ({
          ...current,
          [method]: 0,
        }));
      }

      return next;
    });
  };

  const handleAmountChange = (method, value) => {
  const amount = Number.parseFloat(value);

  setAmounts((prev) => ({
    ...prev,
    [method]: Number.isNaN(amount) ? 0 : Math.max(0, amount),
  }));

  setWarning(false);
};

  const selectedMethods = useMemo(
    () => Object.keys(payments).filter((method) => payments[method]),
    [payments]
  );

  const expectedTotal = Number(order?.totalAmount || 0);

  /**
   * Total de dinero ingresado.
   *
   * Para efectivo puede ser mayor al total de la orden,
   * ya que ese excedente representa el dinero entregado
   * por el cliente para calcular el vuelto.
   */
  const totalEntered = useMemo(
    () =>
      selectedMethods.reduce(
        (sum, method) =>
          sum + (Number.parseFloat(amounts[method]) || 0),
        0
      ),
    [selectedMethods, amounts]
  );

  const cashAmount = Number(amounts.efectivo || 0);

  const nonCashAmount = useMemo(
    () =>
      selectedMethods
        .filter((method) => method !== "efectivo")
        .reduce(
          (sum, method) =>
            sum + (Number.parseFloat(amounts[method]) || 0),
          0
        ),
    [selectedMethods, amounts]
  );

  /**
   * Monto que falta cubrir.
   *
   * Nunca se considera negativo: si ya se cubrió el total,
   * el resto pasa a ser vuelto.
   */
  const remainingAmount = Math.max(
    expectedTotal - totalEntered,
    0
  );

  /**
   * Vuelto:
   *
   * Solo existe cuando hay efectivo y el total ingresado
   * supera el total de la orden.
   */
  const change = useMemo(() => {
    if (!cashAmount || totalEntered <= expectedTotal) {
      return 0;
    }

    return totalEntered - expectedTotal;
  }, [cashAmount, totalEntered, expectedTotal]);

  /**
   * Exceso generado por métodos que NO son efectivo.
   *
   * Esto sí debe considerarse inválido porque una tarjeta,
   * débito o transferencia no deberían registrar más dinero
   * del que corresponde.
   */
  const nonCashExceedsTotal =
    nonCashAmount > expectedTotal + 0.01;

  /**
   * Si no hay efectivo, los métodos no pueden superar
   * el total.
   *
   * Si existe efectivo, el excedente total se interpreta
   * como vuelto.
   */
  const invalidOverpayment =
    nonCashExceedsTotal ||
    (!cashAmount && totalEntered > expectedTotal + 0.01);

  /**
   * El cobro está completo cuando:
   *
   * - Se cubrió exactamente el total, o
   * - Se ingresó más dinero y existe efectivo como vuelto.
   */
  const paymentComplete =
    totalEntered >= expectedTotal - 0.01 &&
    !invalidOverpayment;

  const hasSelectedPayment = selectedMethods.length > 0;

  const canConfirm =
    Boolean(order) &&
    hasSelectedPayment &&
    paymentComplete &&
    expectedTotal > 0;

  const handleConfirm = async () => {
  if (!order || !canConfirm) {
    setWarning(true);
    return;
  }

  const paymentAmounts = { ...amounts };

  if (paymentAmounts.efectivo > expectedTotal) {
    paymentAmounts.efectivo = expectedTotal;
  }

  const paymentInfo = {
    methods: selectedMethods,
    amounts: paymentAmounts,
  };

  await onConfirm?.(
    order.id,
    paymentInfo,
    order.status
  );

  onOpenChange(false);
};

  const renderPaymentOption = ({
    key,
    label,
    icon: OptionIcon,
  }) => {
    const selected = Boolean(payments[key]);
    const Icon = PAYMENT_ICONS[key] || OptionIcon;

    return (
      <button
        key={key}
        type="button"
        onClick={() => handlePaymentSelect(key)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl border p-3 text-left",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
          selected
            ? "border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.08)]"
            : "border-[hsl(var(--border))] bg-[hsl(var(--background-unit)/0.7)] hover:border-[hsl(var(--primary)/0.35)] hover:bg-[hsl(var(--background-unit))]"
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
            "transition-colors duration-200",
            selected
              ? "border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"
              : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-muted-foreground group-hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{label}</p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {selected
              ? "Método seleccionado"
              : "Seleccionar método"}
          </p>
        </div>

        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            selected
              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
              : "border-[hsl(var(--border))]"
          )}
        >
          {selected && <Check className="h-3 w-3" />}
        </div>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          flex
          w-[calc(100%-1.5rem)]
          max-w-3xl
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-2xl
          border-[hsl(var(--border))]
          bg-[hsl(var(--background-unit-2))]
          p-0
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <DialogHeader className="shrink-0 border-b border-[hsl(var(--border))] px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold">
                Finalizar cobro
              </DialogTitle>

              <DialogDescription className="mt-1">
                Orden #{order?.id}
                {order?.userName
                  ? ` · ${order.userName}`
                  : ""}
              </DialogDescription>
            </div>

            {order && (
              <div className="shrink-0 text-right">
                <p className="text-xs text-muted-foreground">
                  Total
                </p>

                <p className="text-2xl font-bold tracking-tight">
                  ${formatCurrency(order.totalAmount)}
                </p>
              </div>
            )}
          </div>
        </DialogHeader>

        {order && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid min-w-0 gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
              {/* =====================================================
                  COLUMNA IZQUIERDA
              ====================================================== */}
              <div className="min-w-0 space-y-5">

                {/* Métodos */}
                <section className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">
                      ¿Cómo recibió el pago?
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Podés combinar varios métodos si es necesario.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {PAYMENT_OPTIONS.map(renderPaymentOption)}
                  </div>
                </section>
              </div>

              {/* =====================================================
                  COLUMNA DERECHA
              ====================================================== */}
              <div className="min-w-0 space-y-5">
                {/* Distribución */}
                {hasSelectedPayment ? (
                  <section className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background-unit)/0.5)] p-4">
                    <div>
                      <p className="text-sm font-semibold">
                        Distribución del cobro
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Indicá cuánto corresponde a cada método.
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      {selectedMethods.map((method) => {
                        const option = PAYMENT_OPTIONS.find(
                          (item) => item.key === method
                        );

                        if (!option) return null;

                        const Icon =
                          PAYMENT_ICONS[method] ||
                          option.icon;

                        const isCash = method === "efectivo";

                        return (
                          <div
                            key={method}
                            className="
                              rounded-lg
                              border
                              border-[hsl(var(--border))]
                              bg-[hsl(var(--background))]
                              p-3
                            "
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--background-unit))] text-muted-foreground">
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium">
                                  {option.label}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {isCash
                                    ? "Dinero recibido"
                                    : "Monto cobrado"}
                                </p>
                              </div>

                              <div className="relative w-28 shrink-0">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                  $
                                </span>

                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  inputMode="decimal"
                                  placeholder="0.00"
                                  value={
                                    amounts[method] ?? ""
                                  }
                                  onChange={(event) =>
                                    handleAmountChange(
                                      method,
                                      event.target.value
                                    )
                                  }
                                  onClick={(event) =>
                                    event.stopPropagation()
                                  }
                                  className="h-10 pl-7 text-right font-medium"
                                />
                              </div>
                            </div>

                            {/* Ayuda específica para efectivo */}
                            {isCash && (
                              <div className="mt-3 flex items-start gap-2 border-t border-[hsl(var(--border))] pt-3">
                                <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                                <p className="text-xs leading-relaxed text-muted-foreground">
                                  Podés ingresar un importe mayor
                                  al total para calcular el vuelto.
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : (
                  <section className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--background-unit)/0.35)] p-6">
                    <div className="max-w-xs text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background-unit))]">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <p className="mt-3 text-sm font-medium">
                        Seleccioná un método de pago
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Una vez seleccionado, vas a poder
                        indicar el importe recibido.
                      </p>
                    </div>
                  </section>
                )}

                {/* =====================================================
                    ESTADO DEL COBRO
                ====================================================== */}
                {hasSelectedPayment && (
                  <section
                    className={cn(
                      "rounded-xl border p-4",
                      invalidOverpayment
                        ? "border-destructive/30 bg-destructive/5"
                        : paymentComplete
                          ? "border-[hsl(var(--green)/0.3)] bg-[hsl(var(--green)/0.08)]"
                          : "border-[hsl(var(--border))] bg-[hsl(var(--background-unit)/0.5)]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            invalidOverpayment
                              ? "bg-destructive"
                              : paymentComplete
                                ? "bg-[hsl(var(--green))]"
                                : "bg-[hsl(var(--yellow))]"
                          )}
                        />

                        <span className="text-sm font-medium">
                          {invalidOverpayment
                            ? "Monto inválido"
                            : paymentComplete
                              ? change > 0
                                ? "Cobro con vuelto"
                                : "Cobro completo"
                              : "Pendiente de completar"}
                        </span>
                      </div>

                      <span className="shrink-0 text-sm font-semibold">
                        ${formatCurrency(totalEntered)}
                        <span className="mx-1 text-muted-foreground">
                          /
                        </span>
                        ${formatCurrency(expectedTotal)}
                      </span>
                    </div>

                    {/* Falta dinero */}
                    {!paymentComplete &&
                      !invalidOverpayment && (
                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[hsl(var(--border))] pt-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 text-[hsl(var(--yellow))]" />

                            <span className="text-xs text-muted-foreground">
                              Falta ingresar
                            </span>
                          </div>

                          <span className="shrink-0 text-sm font-semibold">
                            ${formatCurrency(remainingAmount)}
                          </span>
                        </div>
                      )}

                    {/* Vuelto */}
                    {paymentComplete &&
                      change > 0 &&
                      !invalidOverpayment && (
                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[hsl(var(--green)/0.2)] pt-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <Coins className="h-4 w-4 shrink-0 text-[hsl(var(--green))]" />

                            <span className="text-xs font-medium text-[hsl(var(--green))]">
                              Entregar vuelto
                            </span>
                          </div>

                          <span className="text-sm font-bold text-[hsl(var(--green))]">
                            ${formatCurrency(change)}
                          </span>
                        </div>
                      )}

                    {/* Exceso inválido en medios no efectivo */}
                    {invalidOverpayment && (
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-destructive/20 pt-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />

                          <span className="text-xs text-muted-foreground">
                            El exceso debe corregirse
                          </span>
                        </div>

                        <span className="shrink-0 text-sm font-semibold text-destructive">
                          +${formatCurrency(
                            totalEntered - expectedTotal
                          )}
                        </span>
                      </div>
                    )}
                  </section>
                )}

                {warning && !paymentComplete && (
                  <p className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />

                    {invalidOverpayment
                      ? "Corregí el importe ingresado antes de confirmar."
                      : "El total ingresado todavía no cubre el total de la orden."}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <DialogFooter className="shrink-0 border-t border-[hsl(var(--border))] bg-[hsl(var(--background-unit)/0.45)] px-6 py-4 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="gap-2"
          >
            Confirmar cobro
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseOrderDialog;