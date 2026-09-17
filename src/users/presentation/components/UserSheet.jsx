
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditingUser,
  setFormView,
  getUserData,
  updateUserData,
} from "@/users/application/userSlice";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  UserRound,
  ShoppingBag,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  Package,
  ChevronRight,
  Save,
  RotateCcw,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { fetchClosedOrders } from "@/sales/application/salesThunks";
import { getData } from "@/orders/application/itemSlice";

import OrderCard from "@/sales/presentation/components/OrderSalesSheet";

import { formatCurrency } from "@/shared/utils/formatPriceLocal";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════
   USER CARD
═══════════════════════════════════════════════ */

const UserCard = ({ user, onBack }) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("personal");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  /*
   * ─────────────────────────────────────────────
   * Editable user fields
   * ─────────────────────────────────────────────
   */

  const [formData, setFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  /*
   * ─────────────────────────────────────────────
   * Redux data
   * ─────────────────────────────────────────────
   */

  const orders = useSelector(
    (state) => state.sales.closedOrders || []
  );

  const items = useSelector(
    (state) => state.items.data || []
  );

  const role =
    useSelector((state) => state.users.role) ||
    "Cliente";

  /*
   * ─────────────────────────────────────────────
   * Sync form with selected user
   * ─────────────────────────────────────────────
   */

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  }, [user]);

  /*
   * ─────────────────────────────────────────────
   * Fetch sales information
   * ─────────────────────────────────────────────
   */

  useEffect(() => {
    if (!user?.registrationDate) return;

    const startDate = new Date(
      user.registrationDate
    );

    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date();

    endDate.setUTCHours(
      23,
      59,
      59,
      999
    );

    dispatch(
      fetchClosedOrders({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    dispatch(getData());
  }, [user, dispatch]);

  /*
   * ─────────────────────────────────────────────
   * User orders
   * ─────────────────────────────────────────────
   */

  const userOrders = useMemo(() => {
    return orders
      .filter(
        (order) =>
          order.customerName ===
          user.username
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
  }, [orders, user.username]);

  const totalOrders = userOrders.length;

  const totalSpent = useMemo(
    () =>
      userOrders.reduce(
        (sum, order) =>
          sum +
          (Number(order.total) || 0),
        0
      ),
    [userOrders]
  );

  const averagePerOrder =
    totalOrders > 0
      ? totalSpent / totalOrders
      : 0;

  /*
   * ─────────────────────────────────────────────
   * Top products
   * ─────────────────────────────────────────────
   */

  const topProducts = useMemo(() => {
    const aggregated = {};

    items
      .filter((item) =>
        userOrders.some(
          (order) =>
            order.id === item.orderId
        )
      )
      .forEach((item) => {
        if (!aggregated[item.productId]) {
          aggregated[item.productId] = {
            name: item.productName,
            purchases: 0,
          };
        }

        aggregated[
          item.productId
        ].purchases +=
          Number(item.quantity) || 0;
      });

    return Object.values(aggregated)
      .sort(
        (a, b) =>
          b.purchases - a.purchases
      )
      .slice(0, 3);
  }, [items, userOrders]);

  /*
   * ─────────────────────────────────────────────
   * Form handlers
   * ─────────────────────────────────────────────
   */

  const handleChange = (
    field,
    value
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * Restore original data
   */

  const handleReset = () => {
    setFormData({
      username: user?.username || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  };

  /*
   * ─────────────────────────────────────────────
   * Persist user
   * ─────────────────────────────────────────────
   */

  const handleSave = async () => {
    if (!user?.id || isSaving) return;

    const refactorForm = {
      id: user.id,
      username: formData.username,
      phone: formData.phone,
      address: formData.address,
    };

    try {
      setIsSaving(true);

      await dispatch(
        updateUserData(refactorForm)
      ).unwrap();

      /*
       * Refresh users from the database
       * so Redux contains the persisted data.
       */
      await dispatch(
        getUserData()
      ).unwrap();

      /*
       * Keep the form synchronized with
       * the values that were just saved.
       */
      setFormData({
        username:
          formData.username,
        phone:
          formData.phone,
        address:
          formData.address,
      });
    } catch (error) {
      console.error(
        "Error al actualizar usuario:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * ─────────────────────────────────────────────
   * Back
   * ─────────────────────────────────────────────
   */

  const handleBack = () => {
    onBack?.();

    dispatch(
      setEditingUser(null)
    );

    dispatch(
      setFormView(false)
    );
  };

  /*
   * ─────────────────────────────────────────────
   * Navigation
   * ─────────────────────────────────────────────
   */

  const navigationItems = [
    {
      id: "personal",
      label: "Información personal",
      description: "Datos y estadísticas",
      icon: UserRound,
    },
    {
      id: "orders",
      label: "Órdenes",
      description: `${totalOrders} órdenes registradas`,
      icon: ShoppingBag,
    },
  ];

  return (
    <Card className="w-full h-full min-h-0 overflow-hidden border border-border shadow-xl animate-in fade-in">
      <div className="flex h-full min-h-0 flex-col lg:flex-row">

        {/* ═══════════════════════════════════════
            SIDEBAR
        ═══════════════════════════════════════ */}

        <aside className="w-full shrink-0 border-b border-border bg-bg-unit-2 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">

            {/* Profile */}
            <div className="p-6">
              <div className="flex items-center gap-4 lg:flex-col lg:items-start">

                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.username}
                  />

                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                    {user.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">
                    {user.username}
                  </h2>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>

                  <Badge
                    variant="outline"
                    className="mt-3"
                  >
                    {role}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Registration */}
            <div className="px-6 py-4">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Registrado
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {user.registrationDate
                      ? format(
                          new Date(
                            user.registrationDate
                          ),
                          "dd MMM yyyy",
                          { locale: es }
                        )
                      : "Sin información"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 p-3">
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Perfil
              </p>

              <div className="space-y-1">
                {navigationItems.map(
                  (item) => {
                    const Icon = item.icon;

                    const active =
                      activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setActiveTab(
                            item.id
                          )
                        }
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-background hover:text-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground group-hover:text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "truncate text-sm font-medium",
                              active &&
                                "text-primary"
                            )}
                          >
                            {item.label}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {
                              item.description
                            }
                          </p>
                        </div>

                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0 transition",
                            active
                              ? "text-primary"
                              : "opacity-0 group-hover:opacity-100"
                          )}
                        />
                      </button>
                    );
                  }
                )}
              </div>
            </nav>

            {/* Back */}
            <div className="border-t border-border p-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </div>
          </div>
        </aside>

        {/* ═══════════════════════════════════════
            CONTENT
        ═══════════════════════════════════════ */}

        <main className="min-w-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ═══════════════════════════════════
                PERSONAL
            ═══════════════════════════════════ */}

            {activeTab === "personal" && (
              <motion.div
                key="personal"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.18,
                }}
                className="p-6 lg:p-8"
              >
                <PersonalInformation
                  formData={formData}
                  onChange={
                    handleChange
                  }
                  onSave={handleSave}
                  onReset={
                    handleReset
                  }
                  isSaving={isSaving}
                  user={user}
                  totalOrders={
                    totalOrders
                  }
                  totalSpent={
                    totalSpent
                  }
                  averagePerOrder={
                    averagePerOrder
                  }
                  topProducts={
                    topProducts
                  }
                />
              </motion.div>
            )}

            {/* ═══════════════════════════════════
                ORDERS
            ═══════════════════════════════════ */}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.18,
                }}
                className="p-6 lg:p-8"
              >
                <OrdersInformation
                  userOrders={
                    userOrders
                  }
                  onSelectOrder={
                    setSelectedOrder
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ═══════════════════════════════════════
          ORDER DETAIL
      ═══════════════════════════════════════ */}

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end backdrop-blur-sm"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <OrderCard
              order={
                selectedOrder
              }
              onBack={() =>
                setSelectedOrder(
                  null
                )
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

/* ═══════════════════════════════════════════════
   PERSONAL INFORMATION
═══════════════════════════════════════════════ */

const PersonalInformation = ({
  formData,
  onChange,
  onSave,
  onReset,
  isSaving,
  user,
  totalOrders,
  totalSpent,
  averagePerOrder,
  topProducts,
}) => {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Información personal
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Actualiza la información de este usuario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isSaving}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restablecer
          </Button>

          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />

            {isSaving
              ? "Guardando..."
              : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          PERSONAL DATA
      ═══════════════════════════════════════ */}

      <section>
        <SectionTitle
          icon={UserRound}
          title="Datos personales"
          description="Información registrada del usuario."
        />

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

          <FormField
            id="username"
            label="Nombre de usuario"
            icon={UserRound}
            value={
              formData.username
            }
            onChange={(value) =>
              onChange(
                "username",
                value
              )
            }
            disabled={isSaving}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            icon={Mail}
            value={user.email}
            disabled
          />

          <FormField
            id="phone"
            label="Teléfono"
            icon={Phone}
            value={formData.phone}
            onChange={(value) =>
              onChange(
                "phone",
                value
              )
            }
            disabled={isSaving}
          />

          <FormField
            id="address"
            label="Dirección"
            icon={MapPin}
            value={
              formData.address
            }
            onChange={(value) =>
              onChange(
                "address",
                value
              )
            }
            disabled={isSaving}
          />

          <ReadOnlyField
            label="Fecha de registro"
            icon={CalendarDays}
            value={
              user.registrationDate
                ? format(
                    new Date(
                      user.registrationDate
                    ),
                    "dd MMMM yyyy",
                    { locale: es }
                  )
                : "Sin información"
            }
          />

          <ReadOnlyField
            label="ID de usuario"
            icon={Package}
            value={user.id}
          />
        </div>
      </section>

      <Separator />

      {/* ═══════════════════════════════════════
          ACTIVITY
      ═══════════════════════════════════════ */}

      <section>
        <SectionTitle
          icon={ShoppingBag}
          title="Resumen de actividad"
          description="Resumen de las compras realizadas."
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <MetricCard
            label="Órdenes"
            value={totalOrders}
          />

          <MetricCard
            label="Total gastado"
            value={`$${formatCurrency(
              totalSpent
            )}`}
          />

          <MetricCard
            label="Promedio por orden"
            value={`$${formatCurrency(
              averagePerOrder
            )}`}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TOP PRODUCTS
      ═══════════════════════════════════════ */}

      {topProducts.length > 0 && (
        <>
          <Separator />

          <section>
            <SectionTitle
              icon={Package}
              title="Productos más comprados"
              description="Productos con mayor cantidad de compras."
            />

            <div className="mt-5 space-y-2">
              {topProducts.map(
                (
                  product,
                  index
                ) => (
                  <div
                    key={
                      product.name
                    }
                    className="flex items-center justify-between rounded-xl border border-border bg-bg-unit-2 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>

                      <span className="text-sm font-medium">
                        {
                          product.name
                        }
                      </span>
                    </div>

                    <Badge variant="outline">
                      {
                        product.purchases
                      }{" "}
                      compras
                    </Badge>
                  </div>
                )
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   FORM FIELD
═══════════════════════════════════════════════ */

const FormField = ({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </Label>

      <Input
        id={id}
        name={id}
        type={type}
        value={value || ""}
        onChange={
          onChange
            ? (event) =>
                onChange(
                  event.target.value
                )
            : undefined
        }
        disabled={disabled}
        className="h-11 bg-background"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   READ ONLY FIELD
═══════════════════════════════════════════════ */

const ReadOnlyField = ({
  label,
  icon: Icon,
  value,
}) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </Label>

      <div className="flex h-11 items-center rounded-md border border-border bg-bg-unit-2 px-3 text-sm text-muted-foreground">
        {value || "Sin información"}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SECTION TITLE
═══════════════════════════════════════════════ */

const SectionTitle = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-4 w-4" />
    </div>

    <div>
      <h3 className="text-base font-semibold">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   METRIC CARD
═══════════════════════════════════════════════ */

const MetricCard = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-border bg-bg-unit-2 p-5">
    <p className="text-sm text-muted-foreground">
      {label}
    </p>

    <p className="mt-2 text-2xl font-semibold tracking-tight">
      {value}
    </p>
  </div>
);

/* ═══════════════════════════════════════════════
   ORDERS
═══════════════════════════════════════════════ */

const OrdersInformation = ({
  userOrders,
  onSelectOrder,
}) => {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Órdenes
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Historial de órdenes asociadas a este cliente.
        </p>
      </div>

      <section>
        <div className="mb-4">
          <h3 className="text-base font-semibold">
            Historial de compras
          </h3>

          <p className="text-sm text-muted-foreground">
            {userOrders.length}{" "}
            órdenes encontradas
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  ID
                </TableHead>

                <TableHead>
                  Fecha
                </TableHead>

                <TableHead>
                  Estado
                </TableHead>

                <TableHead className="text-right">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {userOrders.length ===
              0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No hay órdenes para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                userOrders.map(
                  (order) => (
                    <TableRow
                      key={order.id}
                      onClick={() =>
                        onSelectOrder(
                          order
                        )
                      }
                      className="cursor-pointer transition hover:bg-bg-unit-2"
                    >
                      <TableCell className="font-medium">
                        #
                        {
                          order.orderNumber
                        }
                      </TableCell>

                      <TableCell>
                        {format(
                          new Date(
                            order.createdAt
                          ),
                          "dd MMM yyyy, HH:mm",
                          {
                            locale:
                              es,
                          }
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {
                            order.status
                          }
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        $
                        {formatCurrency(
                          order.total
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default UserCard;
