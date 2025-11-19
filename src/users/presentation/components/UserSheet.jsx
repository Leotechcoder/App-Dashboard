"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
import OrderCard from "@/sales/presentation/components/OrderSalesSheet";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";
import { cn } from "@/lib/utils";

/* ───────────────────────────────
   MAPEO SEGURO DE COLORES PARA TAILWIND
──────────────────────────────── */
const metricStyles = {
  blue: "bg-blue-50 hover:bg-blue-100 text-blue-600",
  green: "bg-green-50 hover:bg-green-100 text-green-600",
  purple: "bg-purple-50 hover:bg-purple-100 text-purple-600",
};

const UserCard = ({ user, onBack }) => {
  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState(false);

  const orders = useSelector((state) => state.sales.closedOrders || []);
  const items = useSelector((state) => state.items.data || []);
  const role = useSelector((state) => state.users.role) || "Cliente";

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);

  /*───────────────────────────
    🧭 Guardar posición del scroll
  ───────────────────────────*/
  const handlerShowOrderSheet = (order) => {
    if (contentRef.current) {
      setScrollPosition(contentRef.current.scrollTop);
    }
    setSelectedOrder(order);
  };

  /*───────────────────────────
    🔒 Bloquear scroll del body
  ───────────────────────────*/
  useEffect(() => {
    if (selectedOrder) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedOrder]);

  /*───────────────────────────
    ↩ Restaurar scroll
  ───────────────────────────*/
  useEffect(() => {
    if (!selectedOrder && contentRef.current) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [selectedOrder, scrollPosition]);

  /*───────────────────────────
    📡 Fetch de órdenes y items
  ───────────────────────────*/
  useEffect(() => {
    if (!user?.registrationDate) return;

    const startDate = new Date(user.registrationDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    dispatch(
      fetchClosedOrders({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    dispatch(getData());
  }, [user, dispatch]);

  /*───────────────────────────
    📊 Lógica de métricas y filtros
  ───────────────────────────*/
  const userOrders = useMemo(() => {
    return orders
      .filter((o) => o.customerName === user.username)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, user.username]);

  const totalOrders = userOrders.length;
  const totalSpent = useMemo(
    () => userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [userOrders]
  );
  const averagePerOrder =
    totalOrders > 0 ? (totalSpent / totalOrders).toFixed(2) : 0;

  const purchaseGoal = 500000;
  const progressValue = Math.min((totalSpent / purchaseGoal) * 100, 100);

  const topProducts = useMemo(() => {
    const userItems = items.filter((item) =>
      userOrders.some((o) => o.id === item.orderId)
    );

    const aggregated = Object.values(
      userItems.reduce((acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            name: item.productName,
            purchases: 0,
          };
        }
        acc[item.productId].purchases += Number(item.quantity) || 0;
        return acc;
      }, {})
    );

    return aggregated
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 3);
  }, [items, userOrders]);

  /*───────────────────────────
    Handlers
  ───────────────────────────*/
  const handleBack = () => {
    if (onBack) onBack();
    dispatch(setEditingUser(null));
    dispatch(setFormView(false));
  };

  const handleEditProfile = () => setEditModal(true);
  const handlerOnBackOrder = () => setSelectedOrder(null);

  /*───────────────────────────
    RENDER
  ───────────────────────────*/
  return (
    <Card className="w-full h-full mx-auto shadow-xl border-0 bg-linear-to-br from-white to-gray-50 animate-in fade-in duration-300">
      <UserHeader
        user={user}
        role={role}
        onBack={handleBack}
        onEdit={handleEditProfile}
      />

      {/* Contenido scrolleable */}
      <CardContent
        ref={contentRef}
        className="space-y-6 p-6 overflow-y-auto"
      >
        <UserInfo user={user} />
        <Separator />

        {/* Tooltip solo donde se usa */}
        <TooltipProvider>
          <UserMetrics
            totalOrders={totalOrders}
            totalSpent={totalSpent}
            averagePerOrder={averagePerOrder}
            progressValue={progressValue}
            purchaseGoal={purchaseGoal}
          />
        </TooltipProvider>

        <Separator />
        <UserOrdersTable
          userOrders={userOrders}
          onSelectOrder={handlerShowOrderSheet}
        />
        <Separator />
        <UserTopProducts topProducts={topProducts} />
      </CardContent>

      {/* Modal lateral */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-end backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-lg bg-transparent shadow-lg"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
            >
              <OrderCard
                order={selectedOrder}
                onBack={handlerOnBackOrder}
                className={"h-[calc(100dvh-145px)] overflow-y-auto"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal editar */}
      <AnimatePresence>
        {editModal && (
          <EditUserForm user={user} setEditModal={setEditModal} />
        )}
      </AnimatePresence>
    </Card>
  );
};

/* ───────────────────────────────
   SUBCOMPONENTES
──────────────────────────────── */

const UserHeader = ({ user, role, onBack, onEdit }) => (
  <CardHeader className="bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
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

      <div className="grid gap-2">
        <Button
          onClick={onBack}
          variant="secondary"
          size="sm"
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          ← Volver
        </Button>
        <Button
          onClick={onEdit}
          variant="secondary"
          size="sm"
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          Editar Perfil
        </Button>
      </div>
    </CardTitle>
  </CardHeader>
);

/*───────────────────────────*/
const UserInfo = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Teléfono:</strong> {user.phone}
      </p>
    </div>

    <div className="space-y-1 text-sm text-gray-600">
      <p>
        <strong>Dirección:</strong> {user.address}
      </p>
      <p>
        <strong>Registro:</strong>{" "}
        {new Date(user.registrationDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Actualización:</strong>{" "}
        {user.updateProfile
          ? new Date(user.updateProfile).toLocaleDateString()
          : "Sin registro"}
      </p>
    </div>
  </div>
);

/*───────────────────────────*/
const UserMetrics = ({
  totalOrders,
  totalSpent,
  averagePerOrder,
  progressValue,
  purchaseGoal,
}) => {
  const metrics = [
    { label: "Total Órdenes", value: totalOrders, color: "blue" },
    {
      label: "Total Gastado",
      value: `$${formatCurrency(totalSpent, 1)}`,
      color: "green",
    },
    {
      label: "Promedio por Orden",
      value: `$${formatCurrency(averagePerOrder)}`,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">Métricas de Usuario</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <Tooltip key={i}>
            <TooltipTrigger>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={cn(
                  "text-center p-4 rounded-lg transition select-none cursor-default",
                  metricStyles[m.color]
                )}
              >
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-sm text-gray-600">{m.label}</p>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>{m.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Progreso de Compras</p>
        <Progress value={progressValue} className="h-3" />
        <p className="text-xs text-gray-500 mt-1">
          {progressValue.toFixed(0)}% hacia el objetivo de $
          {formatCurrency(purchaseGoal, 0)}
        </p>
      </div>
    </div>
  );
};

/*───────────────────────────*/
const UserOrdersTable = ({ userOrders, onSelectOrder }) => {
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
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectOrder(order)}
                >
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
                    ${formatCurrency(order.total)}
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
  );
};

/*───────────────────────────*/
const UserTopProducts = ({ topProducts }) => (
  <div>
    <h4 className="font-medium mb-3">Productos Más Comprados</h4>

    <ul className="space-y-2">
      {topProducts.length > 0 ? (
        topProducts.map((product, idx) => (
          <motion.li
            key={product.name}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center p-2 bg-gray-100 rounded-xl"
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
);

export default UserCard;
