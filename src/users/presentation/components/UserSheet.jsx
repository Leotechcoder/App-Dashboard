"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditingUser, setFormView } from "../../application/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EditUserForm from "./EditUserForm";
import { AnimatePresence, motion } from "framer-motion";
import { fetchClosedOrders } from "@/sales/application/salesThunks";
import { getData } from "@/orders/application/itemSlice";

const UserCard = ({ user, onBack }) => {
  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState(false);

  const orders = useSelector((state) => state.sales.orders || []);
  const items = useSelector((state) => state.items.data || []);
  const role = useSelector((state) => state.users.role) || "Cliente";

  if (!user) {
    return (
      <div className="text-center text-muted-foreground">
        Cargando datos del usuario...
      </div>
    );
  }
  useEffect(() => {
  if (!user?.registrationDate) return;

  // Convertir fecha de registro del usuario a UTC
  const startDate = new Date(user.registrationDate);
  startDate.setUTCHours(0, 0, 0, 0); // inicio del día en UTC

  // Fecha actual también en UTC
  const endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);

  // Convertir a formato ISO (siempre UTC)
  const isoStartDate = startDate.toISOString();
  const isoEndDate = endDate.toISOString();

  dispatch(fetchClosedOrders({ startDate: isoStartDate, endDate: isoEndDate }));
  dispatch(getData());
}, [user, dispatch]);

  // 🔹 Filtrar órdenes del usuario y calcular métricas
  const userOrders = useMemo(() => {
    return orders
      .filter((o) => o.customerName === user.username)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, user.username]);

  const totalOrders = userOrders.length;

  const totalSpent = useMemo(() => {
    return userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [userOrders]);

  const averagePerOrder =
    totalOrders > 0 ? (totalSpent / totalOrders).toFixed(2) : 0;

  const purchaseGoal = 500000;
  const progressValue = Math.min((totalSpent / purchaseGoal) * 100, 100);

  // 🔹 Productos más comprados
  const topProducts = useMemo(() => {
    const userItems = items.filter((item) =>
      userOrders.some((o) => o.id === item.orderId)
    );

    const aggregated = Object.values(
      userItems.reduce((acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = { name: item.productName, purchases: 0 };
        }
        // Aseguramos que quantity se trate como número
        acc[item.productId].purchases += Number(item.quantity) || 0;
        return acc;
      }, {})
    );

    return aggregated.sort((a, b) => b.purchases - a.purchases).slice(0, 3);
  }, [items, userOrders]);

  // 🔹 Handlers
  const handleBack = () => {
    if (onBack) onBack();
    dispatch(setEditingUser(null));
    dispatch(setFormView(false));
  };

  const handleEditProfile = () => setEditModal(true);

  // 🔹 Función para mostrar el Badge según status
  const getStatusBadge = (status) => {
    const variants = {
      paid: "default",
      delivered: "secondary",
      pending: "outline",
    };

    const labels = {
      paid: "Pagado",
      delivered: "Entregado",
      pending: "Pendiente",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <Card className="w-full h-full mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 animate-in fade-in duration-300">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="border-2 border-white">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-white text-blue-600">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{user.username}</h3>
                <Badge variant="outline" className="text-white border-white">
                  {role}
                </Badge>
              </div>
            </div>

            <div className="grid grid-rows-1 gap-2">
              <Button
                onClick={handleBack}
                variant="secondary"
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                ← Volver
              </Button>
              <Button
                onClick={handleEditProfile}
                variant="secondary"
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Editar Perfil
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-6 p-6 overflow-y-auto">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                <strong>ID:</strong> {user.id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Teléfono:</strong> {user.phone}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <strong>Dirección:</strong> {user.address}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Registro:</strong>{" "}
                {new Date(user.registrationDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Actualización:</strong>{" "}
                {user.updateProfile
                  ? new Date(user.updateProfile).toLocaleDateString()
                  : "Sin registro"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Métricas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Métricas de Usuario</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Total Órdenes", value: totalOrders, color: "blue" },
                {
                  label: "Total Gastado",
                  value: `$${totalSpent.toFixed(2)}`,
                  color: "green",
                },
                {
                  label: "Promedio por Orden",
                  value: `$${averagePerOrder}`,
                  color: "purple",
                },
              ].map((metric, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className={`text-center p-4 bg-${metric.color}-50 rounded-lg hover:bg-${metric.color}-100 transition`}
                    >
                      <p
                        className={`text-2xl font-bold text-${metric.color}-600`}
                      >
                        {metric.value}
                      </p>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {metric.label === "Promedio por Orden"
                      ? "Gasto promedio por orden"
                      : metric.label === "Total Gastado"
                      ? "Suma de todas las órdenes"
                      : "Órdenes realizadas por el usuario"}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Progreso de Compras</p>
              <Progress value={progressValue} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {progressValue.toFixed(0)}% hacia el objetivo de ${purchaseGoal}
              </p>
            </div>
          </div>

          <Separator />

          {/* Órdenes recientes como tabla */}
          <div>
            <h4 className="font-medium mb-3">Órdenes Recientes</h4>
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
                  {userOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No hay órdenes para mostrar
                      </TableCell>
                    </TableRow>
                  ) : (
                    userOrders.slice(0, 5).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.orderNumber}
                        </TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          {format(
                            new Date(order.createdAt),
                            "dd MMM yyyy, HH:mm",
                            { locale: es }
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${order.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {userOrders.length > 5 && (
              <Button variant="link" className="mt-2">
                Ver Todas
              </Button>
            )}
          </div>

          <Separator />

          {/* Productos más comprados */}
          <div>
            <h4 className="font-medium mb-3">Productos Más Comprados</h4>
            <ul className="space-y-2">
              {topProducts.length > 0 ? (
                topProducts.map((product, idx) => (
                  <motion.li
                    key={product.name}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">
                      {idx + 1}. {product.name}
                    </span>
                    <Badge variant="outline">{product.purchases} compras</Badge>
                  </motion.li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">
                  No hay datos de productos.
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Modal edición */}
      <AnimatePresence>
        {editModal && <EditUserForm user={user} setEditModal={setEditModal} />}
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default UserCard;
