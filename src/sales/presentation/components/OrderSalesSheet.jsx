"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import clsx from "clsx";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";

/* ------------------------------------------------------------------
 * Paleta de colores por token del theme.
 * IMPORTANTE: en Tailwind v4 las clases se detectan por escaneo
 * estático del código fuente. No se pueden armar dinámicamente con
 * template literals (ej. `bg-[hsl(var(${color}))]`) porque el
 * compilador nunca ve ese string completo y no genera el CSS.
 * Por eso se define acá un mapa con las clases ya completas, y en
 * el render solo se elige la llave (nunca se concatena el color).
 * ------------------------------------------------------------------ */
const COLOR_CLASSES = {
  blue: {
    tile: "bg-blue/10 hover:bg-blue/20",
    text: "text-blue",
    badge: "bg-blue/10 text-blue",
  },
  green: {
    tile: "bg-green/10 hover:bg-green/20",
    text: "text-green",
    badge: "bg-green/10 text-green",
  },
  purple: {
    tile: "bg-purple/10 hover:bg-purple/20",
    text: "text-purple",
    badge: "bg-purple/10 text-purple",
  },
  yellow: {
    tile: "bg-yellow/10 hover:bg-yellow/20",
    text: "text-yellow",
    badge: "bg-yellow/10 text-yellow",
  },
  muted: {
    tile: "bg-muted hover:bg-muted/70",
    text: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
};

const STATUS_STYLES = {
  PENDING: { badge: "outline", label: "Pendiente" },
  PAID: { badge: "default", label: "Abonada" },
  DELIVERED: { badge: "secondary", label: "Entregada" },
};

const getStatusStyles = (status) =>
  STATUS_STYLES[status] || { badge: "outline", label: status };

const OrderCard = ({ order, onBack, className = "" }) => {
  const items = useSelector((state) => state.items.data || []);

  if (!order) {
    return (
      <div className="text-center text-muted-foreground">
        Cargando datos de la orden...
      </div>
    );
  }

  // 🔹 Ítems de la orden
  const orderItems = useMemo(() => {
    return items.filter((i) => i.orderId === order.id);
  }, [items, order.id]);

  // 🔹 Métricas clave
  const totalItems = orderItems.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0),
    0
  );

  // 🔹 Progreso estimado por estado
  const progressMap = {
    pending: 25,
    paid: 75,
    delivered: 100,
  };
  const progressValue = progressMap[order.status] || 0;

  // 🔹 Badge de estado (para el header)
  const getStatusBadge = (status) => {
    const variants = {
      paid: "default",
      delivered: "secondary",
      pending: "outline",
    };
    const labels = {
      paid: "Pagada",
      delivered: "Entregada",
      pending: "Pendiente",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  // 🔹 Fechas legibles
  const createdAt = format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", {
    locale: es,
  });
  const updatedAt = order.updatedAt
    ? format(new Date(order.updatedAt), "dd MMM yyyy, HH:mm", { locale: es })
    : "—";

  // 🔹 Métodos de pago
  const paymentMethods = useMemo(() => {
    if (!order.paymentInfo || !order.paymentInfo.amounts) return [];
    return Object.entries(order.paymentInfo.amounts)
      .filter(([, amount]) => amount)
      .map(([method, amount]) => {
        let color = "muted";
        if (method === "efectivo") color = "green";
        else if (method === "debito") color = "blue";
        else if (method === "credito") color = "purple";
        else if (method === "transferencia") color = "yellow";
        return { method, amount, color };
      });
  }, [order.paymentInfo]);

  // 🔹 Métricas destacadas (tiles con tooltip)
  const metrics = [
    { label: "Cantidad de Artículos", value: totalItems, color: "blue" },
    { label: "Estado Actual", value: order.status?.toUpperCase(), color: "green" },
  ];

  return (
    <TooltipProvider>
      <motion.div
        layout
        className={clsx(
          "w-full h-full bg-linear-to-br from-background to-bg-unit-2 rounded-lg shadow-xl border-0 overflow-hidden",
          className
        )}
      >
        {/* HEADER */}
        <CardHeader className="sticky top-0 z-20 bg-linear-to-r from-blue/20 to-blue/90 text-foreground rounded-t-lg shadow-md">
          <CardTitle className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <h3 className="text-2xl font-bold">
                Orden #{order?.orderNumber || order?.id}
              </h3>
              <div className="flex items-center space-x-2">
                {getStatusBadge(order.status)}
                <Badge variant="outline" className="border-border text-muted-foreground">
                  {order.deliveryType || "Sin tipo"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-2">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="secondary"
                  size="sm"
                  className="bg-accent/20 text-green hover:bg-accent/40"
                >
                  ← Volver
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        {/* CONTENT SCROLLABLE */}
        <CardContent className={clsx("p-6 space-y-6", className)}>
          {/* Información del cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-muted-foreground">
              <p className="text-sm font-medium">
                <strong>Cliente:</strong> {order.customerName}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>ID Cliente:</strong> {order.customerId}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Método de entrega:</strong>{" "}
                <span className="capitalize">{order.deliveryType}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                <strong>Creación:</strong> {createdAt}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Actualización:</strong> {updatedAt}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Total:</strong> ${formatCurrency(order.total)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Métricas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Métricas de la Orden</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metrics.map((metric, i) => {
                const colorClasses = COLOR_CLASSES[metric.color] || COLOR_CLASSES.muted;
                const isStatusMetric = STATUS_STYLES[metric.value] !== undefined;
                const displayValue = isStatusMetric
                  ? getStatusStyles(metric.value).label
                  : metric.value;

                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className={clsx(
                          "text-center p-4 rounded-lg transition",
                          colorClasses.tile
                        )}
                      >
                        <p className={clsx("text-2xl font-bold", colorClasses.text)}>
                          {displayValue}
                        </p>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>{metric.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Métodos de pago */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Métodos de Pago</p>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((p, idx) => (
                    <motion.div
                      key={p.method}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className={clsx(
                        "flex flex-col items-center px-4 py-2 rounded-xl font-semibold",
                        COLOR_CLASSES[p.color].badge
                      )}
                    >
                      <span className="capitalize">{p.method}</span>
                      <span className="text-sm font-normal">
                        ${formatCurrency(p.amount)}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Sin métodos de pago registrados
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Progreso de la Orden</p>
              <Progress value={progressValue} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {progressValue}% completada
              </p>
            </div>
          </div>

          <Separator />

          {/* Artículos */}
          <div>
            <h4 className="font-medium mb-3">Artículos</h4>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio Unitario</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No hay artículos en esta orden
                      </TableCell>
                    </TableRow>
                  ) : (
                    orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${formatCurrency(Number(item.unitPrice) * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </motion.div>
    </TooltipProvider>
  );
};

export default OrderCard;