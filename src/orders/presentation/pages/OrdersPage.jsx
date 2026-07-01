import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

// ── Constantes de origen ───────────────────────────────────────────────────
export const ORDER_SOURCES = {
  pos: {
    key: "pos",
    label: "POS Local",
    userId: "Us-1310202-790",
    icon: Monitor,
    color: "var(--blue)",
    badgeClass: "source-badge--pos",
    description: "Cargada desde el dashboard",
  },
  app: {
    key: "app",
    label: "App Mesero",
    userId: "table-pos-app",
    icon: Smartphone,
    color: "var(--purpure)",
    badgeClass: "source-badge--app",
    description: "Ingresada desde la app móvil",
  },
  whatsapp: {
    key: "whatsapp",
    label: "WhatsApp",
    userId: "5492984307550@s.whatsapp.net",
    icon: MessageCircle,
    color: "var(--green)",
    badgeClass: "source-badge--whatsapp",
    description: "Pedido por WhatsApp",
  },
  other: {
    key: "other",
    label: "Otro",
    userId: null,
    icon: LayoutGrid,
    color: "var(--yellow)",
    badgeClass: "source-badge--other",
    description: "Origen desconocido",
  },
};

export function getOrderSource(userId) {
  if (!userId) return ORDER_SOURCES.other;
  const found = Object.values(ORDER_SOURCES).find(
    (s) => s.userId && s.userId === userId,
  );
  return found || ORDER_SOURCES.other;
}

// ── Delivery tabs ──────────────────────────────────────────────────────────
const DELIVERY_TABS = [
  { value: "delivery", label: "Delivery", icon: Truck },
  { value: "local", label: "Retiro en local", icon: Store },
  { value: "table", label: "Mesa", icon: Table },
];

const normalizeDeliveryType = (type) => {
  const value = String(type || "")
    .toLowerCase()
    .trim();

  if (["table", "mesa", "salon", "dine-in"].includes(value)) {
    return "table";
  }

  if (["local", "pickup", "takeaway"].includes(value)) {
    return "local";
  }

  return value;
};

// ── Source filter chips ────────────────────────────────────────────────────
const SOURCE_FILTERS = [
  { value: "all", label: "Todas", icon: LayoutGrid },
  { value: "pos", label: "POS Local", icon: Monitor },
  { value: "app", label: "App Mesero", icon: Smartphone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

// ──────────────────────────────────────────────────────────────────────────
const OrdersPage = ({ setScrollTo }) => {
  const dispatch = useDispatch();
  const shownMessageRef = useRef("");

  const { selectedOrder, isLoading, error, message } = useSelector(
    (state) => state.orders,
  );
  const dataOrders = useSelector((state) => state.orders.data);

  const [activeDelivery, setActiveDelivery] = useState("delivery");
  const [activeSource, setActiveSource] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [createOrder, setCreateOrder] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    orderId: null,
  });

  // Tabla con filtro combinado (deliveryType + status + source)
  const table = useTableData({
    stateKey: "orders",
    itemsPerPage: 10,
    searchFields: ["id", "userName"],
    setFilteredData: setFilteredOrders,
    setCurrentPage: setCurrentPageOrders,
    externalFilter: (order) => {
      if (normalizeDeliveryType(order.deliveryType) !== activeDelivery)
        return false;
      if (order.status !== "pending") return false;
      if (activeSource === "all") return true;
      const src = ORDER_SOURCES[activeSource];
      return src ? order.userId === src.userId : true;
    },
  });

  useScrollLock(openOrderDetails || createOrder);

  // Contadores por origen (para badges en los chips)
  const sourceCounts = (() => {
    const base = (dataOrders || []).filter(
      (o) =>
        normalizeDeliveryType(o.deliveryType) === activeDelivery &&
        o.status === "pending",
    );
    return {
      all: base.length,
      pos: base.filter((o) => o.userId === ORDER_SOURCES.pos.userId).length,
      app: base.filter((o) => o.userId === ORDER_SOURCES.app.userId).length,
      whatsapp: base.filter((o) => o.userId === ORDER_SOURCES.whatsapp.userId)
        .length,
    };
  })();

  // Toast
  useEffect(() => {
    if (message && shownMessageRef.current !== message) {
      toast.success(message);
      setTimeout(() => {
        shownMessageRef.current = message;
        dispatch(setClearMessage());
      }, 2000);
      shownMessageRef.current = "";
    }
  }, [message, dispatch]);

  // Handlers
  const handleCreateOrder = () => {
    setOpenOrderDetails(true);
    setCreateOrder(true);
  };

  const handleOpenOrderDetails = (order) => {
    dispatch(setSelectedOrder(order));
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
    setConfirmDialog({ open: true, orderId });
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteDataOrder(confirmDialog.orderId));
    dispatch(fetchPendingOrders());
  };

  const handleCloseOrder = async (orderId, paymentInfo) => {
    await dispatch(closeOrder({ orderId, paymentInfo }));
  };

  const handleActiveDelivery = (value) => {
    setActiveDelivery(value);
    setScrollTo(true);
  };

  if (isLoading && !isRefreshing) return <Message text="Cargando órdenes..." />;

  if (error) return <Message text={`Error: ${error}`} type="error" />;

  return (
    <main className="w-full pt-5 pb-4 rounded-xl bg-bg-unit">
      {/* HEADER */}
      <div className="flex flex-col gap-3 px-5 pb-4  bg-bg-unit">
        {/* Tabs + acciones */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 p-1 rounded-full border border-border bg-background">
            {DELIVERY_TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleActiveDelivery(value)}
                className={`
                flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                text-xs font-medium transition-all cursor-pointer
                ${
                  activeDelivery === value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-bg-unit-2 hover:text-foreground"
                }
              `}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-100">

            <Button
              onClick={handleCreateOrder}
              size="sm"
              className="w-35 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nueva Orden
            </Button>

            <SearchBar
              tipo="por ID o nombre"
              searchTerm={table.searchTerm}
              setSearchTerm={table.setSearchTerm}
              className={"w-60"}
            />
          </div>
        </div>

        {/* Source filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Origen:
          </span>

          <div className="flex gap-1.5 flex-wrap">
            {SOURCE_FILTERS.map(({ value, label, icon: Icon }) => {
              const count = sourceCounts[value] ?? 0;

              return (
                <button
                  key={value}
                  onClick={() => setActiveSource(value)}
                  className={`
                  inline-flex items-center gap-1.5
                  px-3 py-1 rounded-full
                  text-xs font-medium
                  border transition-all cursor-pointer

                  ${
                    activeSource === value
                      ? value === "all"
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : ""
                      : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }

                  ${
                    activeSource === value && value === "pos"
                      ? "source-badge--pos"
                      : ""
                  }

                  ${
                    activeSource === value && value === "app"
                      ? "source-badge--app"
                      : ""
                  }

                  ${
                    activeSource === value && value === "whatsapp"
                      ? "source-badge--whatsapp"
                      : ""
                  }
                `}
                >
                  <Icon size={13} />
                  <span>{label}</span>

                  {count > 0 && (
                    <span
                      className="
                      min-w-[18px] h-[18px]
                      flex items-center justify-center
                      rounded-full
                      px-1 text-[11px] font-bold
                      bg-bg-unit-2 text-foreground
                    "
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeSource !== "all" && (
            <motion.span
              key={activeSource}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs italic text-muted-foreground"
            >
              {ORDER_SOURCES[activeSource]?.description}
            </motion.span>
          )}
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-background">
        <AnimatePresence mode="wait">
          {isRefreshing ? (
            <motion.div
              key="refresh"
              className="flex items-center justify-center h-40 text-sm font-medium text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              🔄 Actualizando órdenes...
            </motion.div>
          ) : (
            <motion.div
              key="table"
              className="
              overflow-y-auto
               border-b border-border
              h-[calc(90vh-140px)]
            "
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4 }}
            >
              <OrdersTableEnhanced
                data={table.paginatedData}
                currentPage={table.currentPage}
                totalPages={table.totalPages}
                onPageChange={table.handlePageChange}
                onDelete={handleDeleteOrder}
                onCloseOrder={handleCloseOrder}
                setSelectedOrder={handleOpenOrderDetails}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {((openOrderDetails && selectedOrder) || createOrder) && (
          <motion.div
            className="
            fixed inset-0 z-50
            flex justify-end
            px-4 pt-6
            backdrop-blur-sm
            bg-[hsl(var(--dialog-overlay))]
          "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
              w-full max-w-6xl
              max-h-[95vh]
              overflow-hidden
              rounded-xl
              shadow-xl
              bg-background
            "
              initial={{ scale: 0.9, x: 100 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0.9, x: 100 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 18,
              }}
            >
              <OrderDetails
                onBack={handleBack}
                className="h-[calc(100dvh-145px)] overflow-y-auto w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({
            ...prev,
            open,
          }))
        }
        onConfirm={handleConfirmDelete}
        title="Eliminar orden"
        description="¿Estás seguro que querés eliminar esta orden? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="destructive"
      />
    </main>
  );
};

const Message = ({ text, type }) => (
  <div
    className={`py-10 text-center text-base font-medium ${
      type === "error" ? "text-destructive" : "text-muted-foreground"
    }`}
  >
    {text}
  </div>
);

export default OrdersPage;
