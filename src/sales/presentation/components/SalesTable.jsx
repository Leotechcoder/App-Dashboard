"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function SalesTable({ orders, onSelectOrder }) {
  const getStatusBadge = (status) => {
    const variants = {
      paid: "default",
      delivered: "secondary",
      pending: "outline",
    }

    const labels = {
      paid: "Pagado",
      delivered: "Entregado",
      pending: "Pendiente",
    }

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No hay órdenes para mostrar
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}
               onClick={() => onSelectOrder(order)}
               className="cursor-pointer hover:bg-muted"
               >
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customerName || "Cliente"}</TableCell>
                <TableCell>{format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
