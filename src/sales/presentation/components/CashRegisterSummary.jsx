"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Clock, Calendar, TrendingUp, Banknote, Package } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function CashRegisterSummary({ cashRegister, analysis }) {
  if (!cashRegister) return null

  const duration = cashRegister.closedAt
    ? new Date(cashRegister.closedAt) - new Date(cashRegister.openedAt)
    : Date.now() - new Date(cashRegister.openedAt)

  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

  const isOpen = cashRegister.status === "open"

  return (
    <Card className={isOpen ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Banknote className="h-4 w-4" />
          Estado de Caja
        </CardTitle>
        <Badge variant={isOpen ? "default" : "secondary"} className={isOpen ? "bg-green-600" : ""}>
          {isOpen ? "Abierta" : "Cerrada"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Monto Inicial</p>
            </div>
            <p className="text-xl font-bold">${cashRegister.initialAmount.toFixed(2)}</p>
          </div>

          {analysis && isOpen && (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-muted-foreground">Ventas en Efectivo</p>
                </div>
                <p className="text-xl font-bold text-green-600">${analysis.expectedCashAmount.toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-muted-foreground">Total Esperado</p>
                </div>
                <p className="text-xl font-bold text-blue-600">${analysis.expectedFinalAmount.toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Órdenes en Efectivo</p>
                </div>
                <p className="text-xl font-bold">{analysis.ordersCount}</p>
              </div>
            </>
          )}

          {cashRegister.finalAmount !== null && !isOpen && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Monto Final</p>
              </div>
              <p className="text-xl font-bold">${cashRegister.finalAmount.toFixed(2)}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Apertura</p>
              <p className="text-sm font-medium">
                {format(new Date(cashRegister.openedAt), "dd MMM yyyy, HH:mm", { locale: es })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Duración</p>
              <p className="text-sm font-medium">
                {hours}h {minutes}m
              </p>
            </div>
          </div>
        </div>

        {cashRegister.closedAt && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Cierre</p>
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
