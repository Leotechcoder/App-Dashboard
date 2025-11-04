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

// Redux slices
import {
  getDataOrders,
  setClearMessage,
  setSelectedOrder,
  setShowHelpOrders,
  setFilteredOrders,
  setCurrentPageOrders,
  deleteDataOrder,
} from "../../application/orderSlice";
import { getData, voidItemSelected } from "../../application/itemSlice";
import { voidSelectedProduct } from "../../../products/application/productSlice";

// Hook de tabla
import { useTableData } from "@/shared/hook/useTableDataO";
import { closeOrder, fetchPendingOrders } from "@/sales/application/salesThunks";

const OrdersPage = ({ pendingOrders }) => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const shownMessageRef = useRef("");

  const { isLoading, error, showHelp, message } = useSelector(
    (state) => state.orders
  );

  const [activeTab, setActiveTab] = useState("delivery");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);

  const scrollRef = useRef(null);

  // Hook centralizado de tabla
  const table = useTableData({
    stateKey: "orders",
    itemsPerPage: 10,
    searchFields: ["id", "customerName"],
    setFilteredData: setFilteredOrders,
    setCurrentPage: setCurrentPageOrders,
    externalFilter: (order) =>
      order.deliveryType === activeTab && order.status === "pending",
  });

  // Ciclo de vida
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchPendingOrders());
      dispatch(getData());
    }
  }, [dispatch]);

  // Toast por mensajes
  useEffect(() => {
    if (message && shownMessageRef.current !== message) {
      toast.success(message);
      setTimeout(() => {
        shownMessageRef.current = message;
        dispatch(setClearMessage());
      }, 2000);
    }
  }, [message, dispatch]);


  // Handlers
  const handleCreateOrder = () => setOpenOrderDetails(true);

  const handleOpenOrderDetails = (order) => {
    dispatch(setSelectedOrder(order));
    setOpenOrderDetails(true);
  };

  const handleBack = async () => {
    setOpenOrderDetails(false);
    dispatch(setSelectedOrder(null));
    dispatch(voidSelectedProduct());
    dispatch(voidItemSelected());
    await dispatch(fetchPendingOrders());
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro que querés eliminar esta orden? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;
    await dispatch(deleteDataOrder(orderId));
    await dispatch(getDataOrders());
  };

  const handleCloseOrder = async (orderId, paymentInfo) => {
    await dispatch(closeOrder({ orderId, paymentInfo }));
  };

  // Estados intermedios
  if (isLoading && !isRefreshing)
    return <Message text="Cargando órdenes..." type="loading" />;
  if (error) return <Message text={`Error: ${error}`} type="error" />;

  return (
    <main
      className="w-full pb-4 pt-6 "
    >
      {/* HEADER DE ACCIONES */}
      <HeaderActions
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateOrder={handleCreateOrder}
        searchTerm={table.searchTerm}
        setSearchTerm={table.setSearchTerm}
      />

      {/* TABLA DE ÓRDENES */}
      <AnimatePresence mode="wait">
        {isRefreshing ? (
          <motion.div
            key="refreshing"
            className="flex justify-center items-center h-40 text-gray-500 font-medium text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              🔄 Actualizando órdenes...
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="ordersTable"
            className="overflow-y-auto h-[calc(90vh-100px)] border-t border-b border-gray-200 border-opacity-30"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
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

      {/* MODAL DE ORDER DETAILS */}
      <AnimatePresence>
        {(openOrderDetails) && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-end backdrop-blur-sm px-4 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-lg bg-white shadow-xl"
              initial={{ scale: 0.9, x: 100 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0.9, x: 100 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              <OrderDetails
                onBack={handleBack}
                className="h-[calc(100dvh-145px)] overflow-y-auto pt-6"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

/* ───────────────────────────────
   SUBCOMPONENTES
──────────────────────────────── */

const Message = ({ text, type }) => {
  const baseStyles = "text-center py-10 text-base font-medium";
  const color = type === "error" ? "text-red-500" : "text-gray-600";
  return <div className={`${baseStyles} ${color}`}>{text}</div>;
};

const HeaderActions = ({
  activeTab,
  setActiveTab,
  onCreateOrder,
  searchTerm,
  setSearchTerm,
}) => (
  <div className="flex justify-between items-center mb-6 scale-90">
    <div className="flex space-x-2">
      <TabButton
        label="Entrega por delivery"
        isActive={activeTab === "delivery"}
        onClick={() => setActiveTab("delivery")}
      />
      <TabButton
        label="Retiro en local"
        isActive={activeTab === "local"}
        onClick={() => setActiveTab("local")}
      />
    </div>
    <div className="flex items-center space-x-3">
      <ButtonAddOrder
        handleClick={onCreateOrder}
        className="bg-amber-500 hover:bg-amber-600 text-white text-md h-10 px-5 rounded-lg shadow-md"
      />
      <SearchOrder
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        className="flex-1 h-10 rounded-lg border border-gray-300 pl-10 pr-4 focus:ring-2 focus:ring-amber-500 transition"
      />
    </div>
  </div>
);

const TabButton = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 rounded-full transition-colors font-medium ${
      isActive
        ? "bg-amber-600 text-white shadow-sm"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default OrdersPage;
