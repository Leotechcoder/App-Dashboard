"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

const OrdersTableBase = ({
  data = [],
  onDelete,
  onClose,
  onSelect,
  selectedOrderId,
  totalPages,
  currentPage,
  onPageChange,
}) => {
  if (!data || data.length === 0)
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay órdenes pendientes
      </div>
    );

  return (
    <div className="rounded-md border overflow-hidden">
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
          {data.map((order, index) => {
            const isSelected = selectedOrderId === order.id;
            return (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect?.(order)}
                className={clsx(
                  "cursor-pointer transition-colors",
                  isSelected
                    ? "bg-primary/10 hover:bg-primary/20"
                    : "hover:bg-muted/50"
                )}
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString("es-AR")}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${Number(order.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  {onClose && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose(order);
                      }}
                      className="gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Cerrar
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(order.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTableBase;
