"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign, CreditCard, Smartphone, CheckCircle2 } from "lucide-react"

export function PendingOrdersTable({ orders, onCloseOrder }) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [payments, setPayments] = useState({
    efectivo: false,
    credito: false,
    debito: false,
  })

  const [amounts, setAmounts] = useState({
    efectivo: "",
    credito: "",
    debito: "",
  })

  const handleOpenDialog = (order) => {
    setSelectedOrder(order)
    setPayments({ efectivo: false, credito: false, debito: false })
    setAmounts({ efectivo: "", credito: "", debito: "" })
    setIsDialogOpen(true)
  }

  const handleCheckboxChange = (method) => {
    setPayments((prev) => ({ ...prev, [method]: !prev[method] }))
  }

  const handleAmountChange = (method, value) => {
    setAmounts((prev) => ({ ...prev, [method]: value }))
  }

  const handleCloseOrder = () => {
    if (selectedOrder) {
      const paymentInfo = {
        methods: Object.keys(payments).filter((m) => payments[m]),
        amounts,
      }
      onCloseOrder(selectedOrder.id, paymentInfo)
      setIsDialogOpen(false)
      setSelectedOrder(null)
    }
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay órdenes pendientes</p>
      </div>
    )
  }

  const paymentOptions = [
    { key: "efectivo", label: "Efectivo", icon: DollarSign },
    { key: "credito", label: "Crédito", icon: CreditCard },
    { key: "debito", label: "Débito", icon: Smartphone },
  ]

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString("es-AR")}</TableCell>
                <TableCell className="text-right font-semibold">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Pendiente</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => handleOpenDialog(order)} className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Cerrar Orden
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para seleccionar pagos */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cerrar Orden</DialogTitle>
            <DialogDescription>
              Selecciona los métodos de pago y sus montos para cerrar la orden {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-medium">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Métodos de Pago</Label>
                <div className="space-y-2">
                  {paymentOptions.map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={key}
                          checked={payments[key]}
                          onCheckedChange={() => handleCheckboxChange(key)}
                        />
                        <Label htmlFor={key} className="flex items-center gap-2 cursor-pointer">
                          <Icon className="h-4 w-4" />
                          {label}
                        </Label>
                      </div>
                      {payments[key] && (
                        <Input
                          type="number"
                          placeholder="Monto"
                          value={amounts[key]}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCloseOrder}>Confirmar Cierre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
