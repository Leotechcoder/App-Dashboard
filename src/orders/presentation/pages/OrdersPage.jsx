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

const OrdersPage = ({pendingOrders}) => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const shownMessageRef = useRef("");

  const { isLoading, error, showHelp, message } = useSelector(
    (state) => state.orders
  );

  const [activeTab, setActiveTab] = useState("delivery");
  const [createOrder, setCreateOrder] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);

  // Hook centralizado de tabla
  const table = useTableData({
    stateKey: "orders",
    itemsPerPage: 10,
    searchFields: ["id", "userName"],
    setFilteredData: setFilteredOrders,
    setCurrentPage: setCurrentPageOrders,
    externalFilter: (order) => order.deliveryType === activeTab && order.status === "pending",
  });

  // Ciclo de vida
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchPendingOrders());
      dispatch(getData());
    }
  }, []);

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
  const handleCreateOrder = () => setCreateOrder(true);

  const handleOpenOrderDetails = (order) => {
    dispatch(setSelectedOrder(order));
    setOpenOrderDetails(true);
  };

  const handleBack = async () => {
    setOpenOrderDetails(false);
    dispatch(setSelectedOrder(null));
    dispatch(voidSelectedProduct());
    dispatch(voidItemSelected());
    setCreateOrder(false);

    // setIsRefreshing(true);
    // await dispatch(getDataOrders());
    // dispatch(getData());
    // setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleShowHelp = () => dispatch(setShowHelpOrders());

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

  if (openOrderDetails || createOrder)
    return <OrderDetails onBack={handleBack} />;

  // Render principal
  return (
    <main className="w-full pb-4 pt-6">

      <HeaderActions
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateOrder={handleCreateOrder}
        searchTerm={table.searchTerm}
        setSearchTerm={table.setSearchTerm}
      />

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
    </main>
  );
};

// Subcomponentes
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
