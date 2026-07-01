
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditingUser, setFormView } from "@/users/application/userSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
   🎨 Metric styles (USING PROVIDED TOKENS)
──────────────────────────────── */
const metricStyles = {
  primary:
    "bg-primary text-primary-foreground",
  success:
    "bg-green/90 text-primary-foreground",
  info:
    "bg-purple text-primary-foreground",
};

const UserCard = ({ user, onBack }) => {
  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);

  const orders = useSelector((state) => state.sales.closedOrders || []);
  const items = useSelector((state) => state.items.data || []);
  const role = useSelector((state) => state.users.role) || "Cliente";

  /* ───────────────────────────
     Scroll handling
  ─────────────────────────── */
  const handlerShowOrderSheet = (order) => {
    if (contentRef.current) {
      setScrollPosition(contentRef.current.scrollTop);
    }
    setSelectedOrder(order);
  };

  useEffect(() => {
    if (selectedOrder) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (!selectedOrder && contentRef.current) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [selectedOrder, scrollPosition]);

  /* ───────────────────────────
     Fetch data
  ─────────────────────────── */
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

  /* ───────────────────────────
     Metrics logic
  ─────────────────────────── */
  const userOrders = useMemo(() => {
    return orders
      .filter((o) => o.customerName === user.username)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, user.username]);

  const totalOrders = userOrders.length;

  const totalSpent = useMemo(
    () =>
      userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [userOrders]
  );

  const averagePerOrder =
    totalOrders > 0 ? (totalSpent / totalOrders).toFixed(2) : 0;

  const purchaseGoal = 500000;
  const progressValue = Math.min((totalSpent / purchaseGoal) * 100, 100);

  const topProducts = useMemo(() => {
    const aggregated = {};

    items
      .filter((item) => userOrders.some((o) => o.id === item.orderId))
      .forEach((item) => {
        if (!aggregated[item.productId]) {
          aggregated[item.productId] = {
            name: item.productName,
            purchases: 0,
          };
        }
        aggregated[item.productId].purchases += Number(item.quantity) || 0;
      });

    return Object.values(aggregated)
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 3);
  }, [items, userOrders]);

  /* ───────────────────────────
     Handlers
  ─────────────────────────── */
  const handleBack = () => {
    onBack?.();
    dispatch(setEditingUser(null));
    dispatch(setFormView(false));
  };

  return (
    <Card className="w-full h-full border border-border shadow-xl animate-in fade-in">
      <UserHeader
        user={user}
        role={role}
        onBack={handleBack}
        onEdit={() => setEditModal(true)}
      />

      <CardContent
        ref={contentRef}
        className="p-6 space-y-6 overflow-y-auto"
      >
        <UserInfo user={user} />
        <Separator />

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

      {/* Order Sheet */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OrderCard
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editModal && (
          <EditUserForm user={user} setEditModal={setEditModal} />
        )}
      </AnimatePresence>
    </Card>
  );
};

/* ───────────────────────────────
   SUBCOMPONENTS
──────────────────────────────── */

const UserHeader = ({ user, role, onBack, onEdit }) => (
  <CardHeader className="bg-linear-to-r from-accent to-blue/80 text-foreground rounded-t-lg">
    <CardTitle className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="border-2 border-blue/30">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback className="bg-[hsl(var(--stroke))] text-foreground">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-xl font-bold">{user.username}</h3>
          <Badge variant="outline" className="border-foreground text-blue">
            {role}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button size="sm" variant="ghost" className={"bg-accent/20 border border-blue text-foreground hover:bg-accent/40"} onClick={onBack}>
          Volver
        </Button>
        <Button size="sm" variant="default" onClick={onEdit}>
          Editar Perfil
        </Button>
      </div>
    </CardTitle>
  </CardHeader>
);

const UserInfo = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
    <div className="space-y-1">
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Teléfono:</strong> {user.phone}</p>
    </div>

    <div className="space-y-1">
      <p><strong>Dirección:</strong> {user.address}</p>
      <p>
        <strong>Registro:</strong>{" "}
        {new Date(user.registrationDate).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const UserMetrics = ({
  totalOrders,
  totalSpent,
  averagePerOrder,
  progressValue,
  purchaseGoal,
}) => {
  const metrics = [
    { label: "Órdenes", value: totalOrders, style: "primary" },
    {
      label: "Total Gastado",
      value: `$${formatCurrency(totalSpent)}`,
      style: "success",
    },
    {
      label: "Promedio por Orden",
      value: `$${formatCurrency(averagePerOrder)}`,
      style: "info",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <Tooltip key={m.label}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "rounded-xl p-4 text-center transition select-none",
                  metricStyles[m.style]
                )}
              >
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-sm">{m.label}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>{m.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div>
        <Progress value={progressValue} className="h-3" />
        <p className="text-xs text-muted-foreground mt-1">
          {progressValue.toFixed(0)}% hacia ${formatCurrency(purchaseGoal)}
        </p>
      </div>
    </div>
  );
};

const UserOrdersTable = ({ userOrders, onSelectOrder }) => (
  <div>
    <h4 className="font-medium mb-3">Órdenes Recientes</h4>

    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {userOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No hay órdenes para mostrar
              </TableCell>
            </TableRow>
          ) : (
            userOrders.slice(0, 5).map((order) => (
              <TableRow
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="cursor-pointer hover:bg-bg-unit-2"
              >
                <TableCell>#{order.orderNumber}</TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  ${formatCurrency(order.total)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  </div>
);

const UserTopProducts = ({ topProducts }) => (
  <div>
    <h4 className="font-medium mb-3">Productos Más Comprados</h4>

    <ul className="space-y-2">
      {topProducts.length > 0 ? (
        topProducts.map((product, idx) => (
          <motion.li
            key={product.name}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center p-2 rounded-xl bg-bg-unit-2"
          >
            <span className="text-sm">
              {idx + 1}. {product.name}
            </span>
            <Badge variant="outline">
              {product.purchases} compras
            </Badge>
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
