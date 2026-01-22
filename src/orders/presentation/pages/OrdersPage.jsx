"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

// Componentes internos
import OrderDetails from "../components/orderDetails/OrderDetails";
import { ButtonAddOrder } from "../components/Buttons";
import { SearchOrder } from "../components/SearchOrder";
import OrdersTableEnhanced from "../components/OrdersTableEnhanced";

// Redux
import {
  setClearMessage,
  setSelectedOrder,
  setFilteredOrders,
  setCurrentPageOrders,
  deleteDataOrder,
} from "../../application/orderSlice";

// Hooks
import { useTableData } from "@/shared/hook/useTableDataO";
import { closeOrder, fetchPendingOrders } from "@/sales/application/salesThunks";
import { voidItemSelected } from "@/orders/application/itemSlice";
import { voidSelectedProduct } from "@/products/application/productSlice";
import { useScrollLock } from "@/shared/hook/useScrollLock";

const OrdersPage = ({ setScrollTo }) => {
  const dispatch = useDispatch();
  const shownMessageRef = useRef("");

  const { selectedOrder, isLoading, error, message } = useSelector(
    (state) => state.orders
  );
  const dataOrders = useSelector((state) => state.orders.data);

  const [activeTab, setActiveTab] = useState("delivery");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [createOrder, setCreateOrder] = useState(false);

  // Tabla
  const table = useTableData({
    stateKey: "orders",
    itemsPerPage: 10,
    searchFields: ["id", "userName"],
    setFilteredData: setFilteredOrders,
    setCurrentPage: setCurrentPageOrders,
    externalFilter: (order) =>
      order.deliveryType === activeTab && order.status === "pending",
  });

  // Lock scroll al abrir modales
  useScrollLock(openOrderDetails || createOrder);

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

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro que querés eliminar esta orden? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;
    await dispatch(deleteDataOrder(orderId));
    dispatch(fetchPendingOrders());
  };

  const handleCloseOrder = async (orderId, paymentInfo) => {
    await dispatch(closeOrder({ orderId, paymentInfo }));
  };

  const handleActiveTab = (value) => {
    setActiveTab(value);
    setScrollTo(true);
  };

  if (isLoading && !isRefreshing)
    return <Message text="Cargando órdenes..." />;

  if (error) return <Message text={`Error: ${error}`} type="error" />;

  return (
    <main className="w-full pb-4 pt-6 rounded-xl bg-[hsl(var(--muted))] border-[hsl(var(--border))]">
      {/* HEADER */}
        <HeaderActions
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
        onCreateOrder={handleCreateOrder}
        searchTerm={table.searchTerm}
        setSearchTerm={table.setSearchTerm}
      />
      
    <div className=" bg-[hsl(var(--background))]">
      {/* TABLA */}
      <AnimatePresence mode="wait">
        {isRefreshing ? (
          <motion.div
            key="refresh"
            className="flex justify-center items-center h-40 text-sm font-medium text-[hsl(var(--muted))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            🔄 Actualizando órdenes...
          </motion.div>
        ) : (
          <motion.div
            key="table"
            className="overflow-y-auto h-[calc(90vh-100px)] border-y border-[hsl(var(--border))]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
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
            className="fixed inset-0 z-50 flex justify-end bg-[hsl(var(--dialog-overlay))] backdrop-blur-sm px-4 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-xl shadow-xl"
              initial={{ scale: 0.9, x: 100 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0.9, x: 100 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              <OrderDetails
                onBack={handleBack}
                className="h-[calc(100dvh-145px)] overflow-y-auto w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

/* ─────────────────────────────── */
/* SUBCOMPONENTES                  */
/* ─────────────────────────────── */

const Message = ({ text, type }) => (
  <div
    className={`py-10 text-center text-base font-medium ${
      type === "error"
        ? "text-[hsl(var(--destructive))]"
        : "text-[hsl(var(--muted))]"
    }`}
  >
    {text}
  </div>
);

const HeaderActions = ({
  activeTab,
  handleActiveTab,
  onCreateOrder,
  searchTerm,
  setSearchTerm,
}) => (
  <div className="flex justify-between items-center mb-6 scale-90">
    <div className="flex gap-2">
      <TabButton
        label="Entrega por delivery"
        isActive={activeTab === "delivery"}
        onClick={() => handleActiveTab("delivery")}
      />
      <TabButton
        label="Retiro en local"
        isActive={activeTab === "local"}
        onClick={() => handleActiveTab("local")}
      />
    </div>

    <div className="flex items-center gap-3">
      <ButtonAddOrder
        handleClick={onCreateOrder}
        className="h-10 px-5 rounded-lg shadow-sm bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))]"
      />

      <SearchOrder
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        className="h-10 rounded-lg pl-10 pr-4"
      />
    </div>
  </div>
);

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full font-medium transition cursor-pointer ${
      isActive
        ? "bg-[hsl(var(--dashboard))] text-[hsl(var(--accent-foreground))]"
        : "bg-[hsl(var(--muted))]/70  hover:text-[hsl(var(--primary))] text-[hsl(var(--muted-foreground))]"
    }`}
  >
    {label}
  </button>
);

export default OrdersPage;
