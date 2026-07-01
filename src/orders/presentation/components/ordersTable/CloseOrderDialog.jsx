import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";
import { PAYMENT_OPTIONS } from "./ordersTable.constants";

/**
 * Dialog autocontenido para cerrar una orden: elige métodos de pago,
 * ingresa montos y valida que el total coincida antes de confirmar.
 * Todo el estado de cobro vive acá adentro; el padre solo controla
 * `open` y recibe el resultado en `onConfirm(orderId, paymentInfo)`.
 */
const CloseOrderDialog = ({ order, open, onOpenChange, onConfirm }) => {
  const [payments, setPayments] = useState({});
  const [amounts, setAmounts] = useState({});
  const [warning, setWarning] = useState(false);

  // Reinicia el formulario cada vez que se abre para una orden nueva
  useEffect(() => {
    if (open) {
      setPayments({});
      setAmounts({});
      setWarning(false);
    }
  }, [open, order?.id]);

  const handleCheckboxChange = (method) => {
    setPayments((prev) => ({ ...prev, [method]: !prev[method] }));
    if (!payments[method]) setAmounts((prev) => ({ ...prev, [method]: 0 }));
  };

  const handleAmountChange = (method, value) => {
    const n = parseFloat(value);
    setAmounts((prev) => ({ ...prev, [method]: isNaN(n) ? 0 : n }));
  };

  const totalEntered = useMemo(
    () =>
      Object.keys(payments)
        .filter((m) => payments[m])
        .reduce((sum, key) => sum + (parseFloat(amounts[key]) || 0), 0),
    [payments, amounts]
  );

  const totalsMatch = useMemo(() => {
    const expected = Number(order?.totalAmount || 0);
    return Math.abs(expected - totalEntered) < 0.01;
  }, [totalEntered, order]);

  const handleConfirm = async () => {
    if (!order || !totalsMatch) {
      setWarning(true);
      return;
    }
    const paymentInfo = {
      methods: Object.keys(payments).filter((m) => payments[m]),
      amounts,
    };
    await onConfirm?.(order.id, paymentInfo);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cerrar Orden #{order?.id}</DialogTitle>
          <DialogDescription>
            Seleccioná los métodos de pago para cerrar la orden de{" "}
            <strong>{order?.userName}</strong>
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total a cobrar:</span>
                <span className="text-lg font-bold">
                  ${formatCurrency(order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Total ingresado:</span>
                <span className={`font-bold ${totalsMatch ? "text-green" : "text-destructive"}`}>
                  ${formatCurrency(totalEntered)}
                </span>
              </div>
              {!totalsMatch && warning && (
                <p className="text-xs text-destructive">
                  El total ingresado no coincide con el total de la orden
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Métodos de Pago</Label>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={key}
                        checked={payments[key] || false}
                        onCheckedChange={() => handleCheckboxChange(key)}
                      />
                      <Label htmlFor={key} className="flex cursor-pointer items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </Label>
                    </div>
                    {payments[key] && (
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={amounts[key] || ""}
                        onChange={(e) => handleAmountChange(key, e.target.value)}
                        className="w-28"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!totalsMatch}>
            Confirmar Cierre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseOrderDialog;
