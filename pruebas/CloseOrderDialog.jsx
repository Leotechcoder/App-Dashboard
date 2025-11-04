"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DollarSign,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useState, useEffect } from "react";

const CloseOrderDialog = ({ open, onClose, onConfirm, order }) => {
  const [payments, setPayments] = useState({});
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    if (open) {
      setPayments({
        efectivo: false,
        credito: false,
        debito: false,
        transferencia: false,
      });
      setAmounts({
        efectivo: "",
        credito: "",
        debito: "",
        transferencia: "",
      });
    }
  }, [open]);

  const paymentOptions = [
    { key: "efectivo", label: "Efectivo", icon: DollarSign },
    { key: "credito", label: "Crédito", icon: CreditCard },
    { key: "debito", label: "Débito", icon: Smartphone },
    { key: "transferencia", label: "Transferencia", icon: Smartphone },
  ];

  const handleConfirm = () => {
    const paymentInfo = {
      methods: Object.keys(payments).filter((m) => payments[m]),
      amounts,
    };
    onConfirm(order, paymentInfo);
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cerrar Orden</DialogTitle>
          <DialogDescription>
            Seleccioná los métodos de pago para la orden{" "}
            <b>{order.orderNumber}</b>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Cliente:</span>
              <b>{order.customerName}</b>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <b>${order.total.toFixed(2)}</b>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Métodos de Pago</Label>
            {paymentOptions.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={payments[key]}
                    onCheckedChange={() =>
                      setPayments((p) => ({ ...p, [key]: !p[key] }))
                    }
                  />
                  <Label htmlFor={key} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" /> {label}
                  </Label>
                </div>
                {payments[key] && (
                  <Input
                    type="number"
                    placeholder="Monto"
                    value={amounts[key]}
                    onChange={(e) =>
                      setAmounts((a) => ({ ...a, [key]: e.target.value }))
                    }
                    className="w-28"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseOrderDialog;
