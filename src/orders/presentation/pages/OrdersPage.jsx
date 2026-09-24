import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Monitor,
  Smartphone,
  MessageCircle,
  Store,
  Truck,
  Table,
  LayoutGrid,
  Plus,
} from "lucide-react";

// Componentes internos
import OrderDetails from "../components/orderDetails/OrderDetails";
import OrdersTableEnhanced from "../components/ordersTable/OrdersTableEnhanced";

// Redux
import {
  setClearMessage,
  setSelectedOrder,
  setFilteredOrders,
  setCurrentPageOrders,
  deleteDataOrder,
} from "@/orders/application/orderSlice";

// Hooks
import { useTableData } from "@/shared/hook/useTableDataO";
import {
  closeOrder,
  fetchPendingOrders,
} from "@/sales/application/salesThunks";
import { voidItemSelected } from "@/orders/application/itemSlice";
import { voidSelectedProduct } from "@/products/application/productSlice";
import { useScrollLock } from "@/shared/hook/useScrollLock";
import { ConfirmDialog } from "@/shared/presentation/components/utils/ConfirmDialog";
import SearchBar from "@/shared/presentation/components/utils/SearchBar";
import { Button } from "@/components/ui/button";

import { OPEN_ORDER_STATUSES } from "../components/ordersTable/ordersTable.constants";

import {
  getMinutesAgo,
  getAgeColor,
} from "@/shared/utils/formatDateToArg";

/* ==========================================================================
   ORDER SOURCES
============================================================================ */

export const ORDER_SOURCES = {
  pos: {
    key: "pos",
    label: "POS Local",
    icon: Monitor,
    badgeClass: "source-badge--pos",
    description: "Cargada desde el dashboard",
  },

  app: {
    key: "app",
    label: "App Mesero",
    icon: Smartphone,
    badgeClass: "source-badge--app",
    description: "Ingresada desde la app móvil",
  },

  whatsapp: {
    key: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    badgeClass: "source-badge--whatsapp",
    description: "Pedido por WhatsApp",
  },

  other: {
    key: "other",
    label: "Otro",
    icon: LayoutGrid,
    badgeClass: "source-badge--other",
    description: "Origen desconocido",
  },
};

/* ==========================================================================
   DELIVERY TABS
============================================================================ */

const DELIVERY_TABS = [
  {
    value: "delivery",
    label: "Delivery",
    icon: Truck,
  },
  {
    value: "local",
    label: "Retiro en local",
    icon: Store,
  },
  {
    value: "table",
    label: "Mesa",
    icon: Table,
  },
];

/* ==========================================================================
   NORMALIZADORES
============================================================================ */

const normalizeDeliveryType = (type) => {
  const value = String(type || "")
    .toLowerCase()
    .trim();

  if (
    ["table", "mesa", "salon", "dine-in"].includes(value)
  ) {
    return "table";
  }

  if (
    ["local", "pickup", "takeaway"].includes(value)
  ) {
    return "local";
  }

  return value;
};

/* ==========================================================================
   SOURCE FILTERS
============================================================================ */

const ALL_SOURCE_FILTERS = [
  {
    value: "all",
    label: "Todas",
    icon: LayoutGrid,
  },
  {
    value: "pos",
    label: "POS Local",
    icon: Monitor,
  },
  {
    value: "app",
    label: "App Mesero",
    icon: Smartphone,
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
  },
];

const SOURCE_FILTERS_BY_DELIVERY = {
  delivery: ["all", "pos", "whatsapp"],
  local: ["all", "pos", "whatsapp"],
  table: ["all", "pos", "app"],
};

/* ==========================================================================
   STATUS SEMAPHORE
============================================================================ */

const STATUS_DOT_CLASSES = {
  green: "bg-green",
  yellow: "bg-yellow",
  destructive: "bg-destructive",
};

const getStatusLabel = (color) => {
  if (color === "green") {
    return "Órdenes pendientes dentro del tiempo";
  }

  if (color === "yellow") {
    return "Hay órdenes pendientes en zona de advertencia";
  }

  if (color === "destructive") {
    return "Hay órdenes pendientes que superaron el tiempo";
  }

  return "";
};

const getOrdersAgeColor = (orders = []) => {
  if (orders.length === 0) return null;

  let hasYellow = false;

  for (const order of orders) {
    const minutes = getMinutesAgo(order.createdAt);
    const color = getAgeColor(minutes);

    if (color === "destructive") {
      return "destructive";
    }

    if (color === "yellow") {
      hasYellow = true;
    }
  }

  return hasYellow ? "yellow" : "green";
};

/* ==========================================================================
   COMPONENT
============================================================================ */

const OrdersPage = ({ setScrollTo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shownMessageRef = useRef("");

  const {
    selectedOrder,
    isLoading,
    error,
    message,
  } = useSelector((state) => state.orders);

  const { activeCashRegister } = useSelector((state) => state.sales);

  const dataOrders = useSelector(
    (state) => state.orders.data
  );

  const [activeDelivery, setActiveDelivery] =
    useState("delivery");

  const [activeSource, setActiveSource] =
    useState("all");

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [openOrderDetails, setOpenOrderDetails] =
    useState(false);

  const [createOrder, setCreateOrder] =
    useState(false);

  const [confirmDialog, setConfirmDialog] =
    useState({
      open: false,
      orderId: null,
    });

  /* ------------------------------------------------------------------------
     ORDERS BASE
  ------------------------------------------------------------------------ */

  const pendingOrdersForDelivery = (
    dataOrders || []
  ).filter((order) => {
    if (
      order.source === "app" &&
      activeDelivery !== "table"
    ) {
      return false;
    }

    return (
      normalizeDeliveryType(
        order.deliveryType
      ) === activeDelivery &&
      OPEN_ORDER_STATUSES.includes(order.status)
    );
  });

  /* ------------------------------------------------------------------------
     DELIVERY STATS
  ------------------------------------------------------------------------ */

  const deliveryStats = (() => {
    const stats = {};

    for (const tab of DELIVERY_TABS) {
      const orders = (dataOrders || []).filter(
        (order) => {
          if (
            order.source === "app" &&
            tab.value !== "table"
          ) {
            return false;
          }

          return (
            normalizeDeliveryType(
              order.deliveryType
            ) === tab.value &&
            OPEN_ORDER_STATUSES.includes(
              order.status
            )
          );
        }
      );

      stats[tab.value] = {
        count: orders.length,
        ageColor: getOrdersAgeColor(orders),
      };
    }

    return stats;
  })();

  /* ------------------------------------------------------------------------
     SOURCE STATS
  ------------------------------------------------------------------------ */

  const sourceStats = (() => {
    const stats = {
      all: {
        count: pendingOrdersForDelivery.length,
        orders: pendingOrdersForDelivery,
      },

      pos: {
        count: 0,
        orders: [],
      },

      app: {
        count: 0,
        orders: [],
      },

      whatsapp: {
        count: 0,
        orders: [],
      },
    };

    for (const order of pendingOrdersForDelivery) {
      const key = order.source || "other";

      if (stats[key]) {
        stats[key].orders.push(order);
        stats[key].count += 1;
      }
    }

    for (const key of Object.keys(stats)) {
      stats[key].ageColor =
        getOrdersAgeColor(stats[key].orders);
    }

    return stats;
  })();

  /* ------------------------------------------------------------------------
     VISIBLE SOURCE FILTERS
  ------------------------------------------------------------------------ */

  const visibleSourceFilters =
    ALL_SOURCE_FILTERS.filter((filter) =>
      (
        SOURCE_FILTERS_BY_DELIVERY[
          activeDelivery
        ] || ["all"]
      ).includes(filter.value)
    );

  /* ------------------------------------------------------------------------
     TABLE
  ------------------------------------------------------------------------ */

  const table = useTableData({
    stateKey: "orders",

    itemsPerPage: 10,

    searchFields: ["id", "userId"],

    setFilteredData: setFilteredOrders,

    setCurrentPage: setCurrentPageOrders,

    externalFilter: (order) => {
      if (
        order.source === "app" &&
        activeDelivery !== "table"
      ) {
        return false;
      }

      if (
        normalizeDeliveryType(
          order.deliveryType
        ) !== activeDelivery
      ) {
        return false;
      }

      if (
        !OPEN_ORDER_STATUSES.includes(
          order.status
        )
      ) {
        return false;
      }

      if (activeSource === "all") {
        return true;
      }

      return (
        (order.source || "other") ===
        activeSource
      );
    },
  });

  /* ------------------------------------------------------------------------
     BODY SCROLL LOCK
  ------------------------------------------------------------------------ */

  useScrollLock(
    openOrderDetails || createOrder
  );

  /* ------------------------------------------------------------------------
     TOAST
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      message &&
      shownMessageRef.current !== message
    ) {
      toast.success(message);

      const timeout = setTimeout(() => {
        shownMessageRef.current = message;
        dispatch(setClearMessage());
        shownMessageRef.current = "";
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [message, dispatch]);

  /* ------------------------------------------------------------------------
     HANDLERS
  ------------------------------------------------------------------------ */

  const handleCreateOrder = () => {
    setCreateOrder(true);
    setOpenOrderDetails(true);
  };

  const handleOpenOrderDetails = (order) => {
    dispatch(setSelectedOrder(order));
    setCreateOrder(false);
    setOpenOrderDetails(true);
  };

  const handleBack = () => {
    setOpenOrderDetails(false);
    setCreateOrder(false);

    setTimeout(() => {
      dispatch(voidSelectedProduct());
      dispatch(voidItemSelected());
      dispatch(setSelectedOrder(null));
    }, 100);
  };

  const handleDeleteOrder = (orderId) => {
    setConfirmDialog({
      open: true,
      orderId,
    });
  };

  const handleConfirmDelete = async () => {
    await dispatch(
      deleteDataOrder(
        confirmDialog.orderId
      )
    );

    dispatch(fetchPendingOrders());

    setConfirmDialog({
      open: false,
      orderId: null,
    });
  };

  const handleCloseOrder = async (
    orderId,
    paymentInfo
  ) => {
    await dispatch(
      closeOrder({
        orderId,
        paymentInfo,
      })
    );
  };

  const handleActiveDelivery = (value) => {
    setActiveDelivery(value);

    setActiveSource("all");

    setScrollTo?.(true);
  };

  /* ------------------------------------------------------------------------
     STATES
  ------------------------------------------------------------------------ */

  if (
    isLoading &&
    !isRefreshing
  ) {
    return (
      <Message text="Cargando órdenes..." />
    );
  }

  if (error) {
    return (
      <Message
        text={`Error: ${error}`}
        type="error"
      />
    );
  }

  /* ------------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------------ */

  return (
    <main className="w-full pb-4 rounded-xl bg-background">
      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <div className="flex flex-col gap-3 px-5 pb-4 pt-2 border border-border rounded-xl">
        {/* ------------------------------------------------------------------
            TOP
        ------------------------------------------------------------------ */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* DELIVERY FILTERS */}

          <div className="flex gap-1 p-1 rounded-full border border-border bg-background w-fit">
            {DELIVERY_TABS.map(
              ({
                value,
                label,
                icon: Icon,
              }) => {
                const statusColor =
                  deliveryStats[value]
                    ?.ageColor;

                const dotClass =
                  statusColor
                    ? STATUS_DOT_CLASSES[
                        statusColor
                      ]
                    : null;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      handleActiveDelivery(
                        value
                      )
                    }
                    className={`
                      flex items-center gap-1.5
                      px-3.5 py-1.5
                      rounded-full
                      text-xs font-medium
                      transition-all
                      cursor-pointer
                      ${
                        activeDelivery === value
                          ? "bg-accent/90 text-primary border border-primary shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }
                    `}
                  >
                    <Icon size={15} />

                    <span>
                      {label}
                    </span>

                    {dotClass && (
                      <span
                        className={`
                          inline-block
                          h-2 w-2
                          rounded-full
                          shrink-0
                          ${dotClass}
                        `}
                        title={getStatusLabel(
                          statusColor
                        )}
                      />
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* ACTIONS */}

          <div className="flex items-center justify-end gap-3 w-full lg:w-auto">
            {activeDelivery === "table" ? (
              <Button
                onClick={() =>
                  navigate("/admin/tables")
                }
                size="sm"
                disabled={!activeCashRegister}
                className="shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LayoutGrid className="w-4 h-4" />

                Gestionar Mesas
              </Button>
            ) : (
              <Button
                onClick={handleCreateOrder}
                disabled={!activeCashRegister}
                size="sm"
                className="shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />

                Nueva Orden
              </Button>
            )}

            <SearchBar
              tipo="orden por ID"
              searchTerm={table.searchTerm}
              setSearchTerm={
                table.setSearchTerm
              }
              className="w-50 h-8"
            />
          </div>
        </div>

        {/* ------------------------------------------------------------------
            SOURCE FILTERS
        ------------------------------------------------------------------ */}

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Origen:
          </span>

          <AnimatePresence mode="popLayout">
            <div className="flex gap-1.5 flex-wrap">
              {visibleSourceFilters.map(
                ({
                  value,
                  label,
                  icon: Icon,
                }) => {
                  const stats =
                    sourceStats[value] ?? {
                      count: 0,
                      ageColor: null,
                    };

                  const count =
                    stats.count;

                  const dotColor =
                    stats.ageColor
                      ? STATUS_DOT_CLASSES[
                          stats.ageColor
                        ]
                      : null;

                  return (
                    <motion.button
                      key={value}
                      layout
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                      type="button"
                      onClick={() =>
                        setActiveSource(
                          value
                        )
                      }
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        px-3 py-1
                        rounded-full
                        text-xs font-medium
                        border
                        transition-all
                        cursor-pointer

                        ${
                          activeSource ===
                          value
                            ? value === "all"
                              ? "bg-primary/10 border-primary/40 text-primary"
                              : ""
                            : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }

                        ${
                          activeSource ===
                            "pos" &&
                          value === "pos"
                            ? "source-badge--pos"
                            : ""
                        }

                        ${
                          activeSource ===
                            "app" &&
                          value === "app"
                            ? "source-badge--app"
                            : ""
                        }

                        ${
                          activeSource ===
                            "whatsapp" &&
                          value ===
                            "whatsapp"
                            ? "source-badge--whatsapp"
                            : ""
                        }
                      `}
                    >
                      <Icon size={13} />

                      <span>
                        {label}
                      </span>

                      {dotColor && (
                        <span
                          className={`
                            inline-block
                            h-2 w-2
                            rounded-full
                            shrink-0
                            ${dotColor}
                          `}
                          title={getStatusLabel(
                            stats.ageColor
                          )}
                        />
                      )}

                      {count > 0 && (
                        <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 text-[11px] font-bold bg-bg-unit-2 text-foreground">
                          {count}
                        </span>
                      )}
                    </motion.button>
                  );
                }
              )}
            </div>
          </AnimatePresence>

          {activeSource !== "all" && (
            <motion.span
              key={activeSource}
              initial={{
                opacity: 0,
                x: -6,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="text-xs italic text-muted-foreground"
            >
              {
                ORDER_SOURCES[
                  activeSource
                ]?.description
              }
            </motion.span>
          )}
        </div>
      </div>

      {/* ====================================================================
          TABLE
      ==================================================================== */}

      <div className="bg-background">
        <AnimatePresence mode="wait">
          {isRefreshing ? (
            <motion.div
              key="refresh"
              className="flex items-center justify-center h-40 text-sm font-medium text-muted-foreground"
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
              🔄 Actualizando órdenes...
            </motion.div>
          ) : (
            <motion.div
              key="table"
              className="overflow-y-auto h-[calc(90vh-160px)]"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 12,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <OrdersTableEnhanced
                data={table.paginatedData}
                currentPage={
                  table.currentPage
                }
                totalPages={
                  table.totalPages
                }
                onPageChange={
                  table.handlePageChange
                }
                onDelete={
                  handleDeleteOrder
                }
                onCloseOrder={
                  handleCloseOrder
                }
                setSelectedOrder={
                  handleOpenOrderDetails
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ====================================================================
          ORDER SIDE SHEET
      ==================================================================== */}

      <AnimatePresence>
        {((openOrderDetails &&
          selectedOrder) ||
          createOrder) && (
          <>
            {/* OVERLAY */}

            <motion.div
              className="
                fixed inset-0 z-40
                bg-[hsl(var(--dialog-overlay))]
                backdrop-blur-sm
              "
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={handleBack}
            />

            {/* SIDE SHEET */}

            <motion.aside
              className="
                fixed
                inset-y-0
                right-0
                z-50

                w-full
                sm:w-[calc(100%-2rem)]
                lg:w-[min(1100px,calc(100%-3rem))]

                overflow-hidden

                bg-[hsl(var(--background-unit-2))]
                border-l
                border-[hsl(var(--border))]

                shadow-2xl
              "
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <OrderDetails
                onBack={handleBack}
                className="
                  h-full
                  min-h-0
                  w-full
                "
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ====================================================================
          DELETE CONFIRMATION
      ==================================================================== */}

      <ConfirmDialog
        open={
          confirmDialog.open
        }
        onOpenChange={(open) =>
          setConfirmDialog(
            (prev) => ({
              ...prev,
              open,
            })
          )
        }
        onConfirm={
          handleConfirmDelete
        }
        title="Eliminar orden"
        description="¿Estás seguro que querés eliminar esta orden? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="destructive"
      />
    </main>
  );
};

/* ==========================================================================
   MESSAGE
============================================================================ */

const Message = ({
  text,
  type,
}) => (
  <div
    className={`
      py-10
      text-center
      text-base
      font-medium
      ${
        type === "error"
          ? "text-destructive"
          : "text-muted-foreground"
      }
    `}
  >
    {text}
  </div>
);

export default OrdersPage;