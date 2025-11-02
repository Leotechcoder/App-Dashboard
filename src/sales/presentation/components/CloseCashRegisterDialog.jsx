"use client"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, DollarSign, TrendingDown, TrendingUp, Banknote } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { SalesService } from "@/sales/application/salesService"

export function CloseCashRegisterDialog({ open, onOpenChange, onConfirm, cashRegister, orders = [] }) {
  const [finalAmount, setFinalAmount] = useState("")
  const [showSummary, setShowSummary] = useState(false)

  const handleConfirm = () => {
    const amount = Number.parseFloat(finalAmount)
    if (isNaN(amount) || amount < 0) return

    setShowSummary(true)
  }

  const handleFinalConfirm = () => {
    const amount = Number.parseFloat(finalAmount)
    onConfirm(amount)
    setFinalAmount("")
    setShowSummary(false)
  }

  const handleCancel = () => {
    setFinalAmount("")
    setShowSummary(false)
    onOpenChange(false)
  }

  if (!cashRegister) return null

  const initialAmount = cashRegister.initialAmount || 0
  const cashOrdersTotal = SalesService.calculateTotalCashAmount(orders)
  const expectedFinalAmount = initialAmount + cashOrdersTotal
  const actualFinalAmount = Number.parseFloat(finalAmount) || 0
  const difference = actualFinalAmount - expectedFinalAmount
  const hasDifference = Math.abs(difference) >= 0.01

  const duration = cashRegister.openedAt ? Math.floor((new Date() - new Date(cashRegister.openedAt)) / 1000 / 60) : 0
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle>Cerrar Caja</DialogTitle>
                <DialogDescription>Ingresa el monto final en efectivo para cerrar la sesión</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Banknote className="h-4 w-4" />
                      Información de la Sesión
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Apertura:</span>
                        <p className="font-medium">
                          {format(new Date(cashRegister.openedAt), "dd MMM yyyy, HH:mm", { locale: es })}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duración:</span>
                        <p className="font-medium">
                          {hours}h {minutes}m
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monto Inicial:</span>
                        <span className="font-bold">${initialAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ventas en Efectivo:</span>
                        <span className="font-bold text-green-600">+${cashOrdersTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Órdenes en Efectivo:</span>
                        <span className="font-medium">{orders.length}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total Esperado:</span>
                        <span className="font-bold text-lg">${expectedFinalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="finalAmount" className="text-base font-semibold">
                    Monto Final en Caja (Efectivo)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cuenta todo el efectivo en la caja y registra el monto total
                  </p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="finalAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={finalAmount}
                      onChange={(e) => setFinalAmount(e.target.value)}
                      className="pl-10 text-lg h-12"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirm} disabled={!finalAmount || Number.parseFloat(finalAmount) < 0}>
                  Continuar al Resumen
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle>Resumen de Cierre de Caja</DialogTitle>
                <DialogDescription>Revisa los detalles antes de confirmar el cierre</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Card
                  className={
                    hasDifference
                      ? difference > 0
                        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                        : "border-red-500 bg-red-50 dark:bg-red-950"
                      : "border-green-500 bg-green-50 dark:bg-green-950"
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {hasDifference ? (
                        <>
                          <AlertCircle className={`h-5 w-5 ${difference > 0 ? "text-yellow-600" : "text-red-600"}`} />
                          {difference > 0 ? "Sobrante Detectado" : "Faltante Detectado"}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Caja Cuadrada Perfectamente
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 p-3 rounded-lg bg-background">
                        <p className="text-xs text-muted-foreground">Monto Inicial</p>
                        <p className="text-2xl font-bold">${initialAmount.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1 p-3 rounded-lg bg-background">
                        <p className="text-xs text-muted-foreground">Ventas en Efectivo</p>
                        <p className="text-2xl font-bold text-green-600">+${cashOrdersTotal.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1 p-3 rounded-lg bg-background">
                        <p className="text-xs text-muted-foreground">Total Esperado</p>
                        <p className="text-2xl font-bold text-blue-600">${expectedFinalAmount.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1 p-3 rounded-lg bg-background">
                        <p className="text-xs text-muted-foreground">Monto Final Real</p>
                        <p className="text-2xl font-bold">${actualFinalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {hasDifference && (
                      <div
                        className={`flex items-start gap-3 rounded-lg p-4 ${
                          difference > 0 ? "bg-yellow-100 dark:bg-yellow-900" : "bg-red-100 dark:bg-red-900"
                        }`}
                      >
                        {difference > 0 ? (
                          <TrendingUp className="h-6 w-6 text-yellow-700 dark:text-yellow-300 flex-shrink-0 mt-0.5" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-red-700 dark:text-red-300 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p
                            className={`font-bold text-lg ${
                              difference > 0 ? "text-yellow-900 dark:text-yellow-100" : "text-red-900 dark:text-red-100"
                            }`}
                          >
                            {difference > 0 ? "Sobrante" : "Faltante"}: ${Math.abs(difference).toFixed(2)}
                          </p>
                          <p
                            className={`text-sm mt-1 ${
                              difference > 0 ? "text-yellow-700 dark:text-yellow-300" : "text-red-700 dark:text-red-300"
                            }`}
                          >
                            {difference > 0
                              ? "Hay más dinero del esperado en caja. Verifica si hubo propinas o errores en el registro."
                              : "Falta dinero en caja. Revisa las transacciones y verifica si hay errores de conteo."}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {orders.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Órdenes en Efectivo de esta Sesión</span>
                        <Badge variant="secondary">{orders.length} órdenes</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-64 overflow-y-auto rounded-md border">
                        <Table>
                          <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Cliente</TableHead>
                              <TableHead>Hora</TableHead>
                              <TableHead>Método</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{format(new Date(order.createdAt), "HH:mm", { locale: es })}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="gap-1">
                                    <Banknote className="h-3 w-3" />
                                    Efectivo
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-semibold">${order.total.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSummary(false)}>
                  Volver a Editar
                </Button>
                <Button
                  onClick={handleFinalConfirm}
                  variant={hasDifference && difference < 0 ? "destructive" : "default"}
                >
                  {hasDifference && difference < 0 ? "Confirmar con Faltante" : "Confirmar Cierre"}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
