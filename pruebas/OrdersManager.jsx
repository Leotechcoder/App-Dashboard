"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import OrdersTableBase from "./OrdersTableBase";
import CloseOrderDialog from "./CloseOrderDialog";
import { SearchOrder } from "../src/orders/presentation/components/SearchOrder";

import {
  getDataOrders,
  deleteDataOrder,
  setFilteredOrders,
  setCurrentPageOrders,
} from "../src/orders/application/orderSlice";
import { getData } from "../src/orders/application/itemSlice";
import { useTableData } from "../src/shared/hook/useTableDataO";

/* ------------------------------
   🔹 OrdersManager (Smart)
------------------------------ */

const OrdersManager = ({
  mode = "pending", // 'pending', 'all', 'closed'
  enableCloseOrder = false,
}) => {
  const dispatch = useDispatch();
  const { isLoading, error, message } = useSelector((s) => s.orders);
  const items = useSelector((s) => s.items?.data || []);
  const shownMessageRef = useRef("");

  const [activeTab, setActiveTab] = useState("local");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ----------------------------
     useTableData centralizado
  ---------------------------- */
  const table = useTableData({
    stateKey: "orders",
    itemsPerPage: 10,
    searchFields: ["id", "userName"],
    setFilteredData: setFilteredOrders,
    setCurrentPage: setCurrentPageOrders,
    externalFilter: (order) =>
      (mode === "all" || order.status === mode) &&
      order.deliveryType === activeTab,
  });

  /* ----------------------------
     Fetch inicial
  ---------------------------- */
  useEffect(() => {
    dispatch(getDataOrders());
    dispatch(getData());
  }, [dispatch]);

  useEffect(() => {
    if (message && shownMessageRef.current !== message) {
      toast.success(message);
      shownMessageRef.current = message;
    }
  }, [message]);

  /* ----------------------------
     Handlers principales
  ---------------------------- */

  // 🗑️ Eliminar orden
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("¿Eliminar orden?")) return;
    await dispatch(deleteDataOrder(orderId));
    await dispatch(getDataOrders());
  };

  // 🪟 Abrir diálogo de cierre
  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // 💰 Confirmar cierre de orden
  const handleCloseOrder = (order, paymentInfo) => {
    console.log("Cerrando orden:", order, paymentInfo);
    // TODO: acá podrías despachar una acción como closeOrder(order.id, paymentInfo)
  };

  // 🔄 Refrescar datos
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getDataOrders());
    dispatch(getData());
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // ✅ Seleccionar orden desde tabla
  const handleOrderSelect = (order) => {
    setSelectedOrder((prev) =>
      prev?.id === order.id ? null : order // alterna selección
    );
  };

  /* ----------------------------
     Derivaciones de datos
  ---------------------------- */

  // 🔹 Productos pertenecientes a la orden seleccionada
  const dataItems = useMemo(() => {
    if (!selectedOrder) return [];
    return items.filter((i) => selectedOrder.items?.some((it) => it.productId === i.id));
  }, [selectedOrder, items]);

  // 🔹 Total calculado dinámicamente
  const orderTotal = useMemo(() => {
    if (!selectedOrder) return 0;
    return selectedOrder.items?.reduce(
      (acc, item) => acc + Number(item.price) * (item.quantity || 1),
      0
    );
  }, [selectedOrder]);

  /* ----------------------------
     Render principal
  ---------------------------- */

  if (isLoading) return <Message text="Cargando órdenes..." type="loading" />;
  if (error) return <Message text={`Error: ${error}`} type="error" />;

  return (
    <main className="p-5 pt-6 w-full max-w-screen-xl space-y-6">
      {/* 🔹 Header con Tabs y Buscador */}
      <HeaderActions
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={table.searchTerm}
        setSearchTerm={table.setSearchTerm}
      />

      {/* 🔹 Tabla principal */}
      <AnimatePresence mode="wait">
        {isRefreshing ? (
          <motion.div
            key="refreshing"
            className="flex justify-center items-center h-40 text-gray-500 font-medium text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            🔄 Actualizando órdenes...
          </motion.div>
        ) : (
          <motion.div
            key="ordersTable"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.5 }}
          >
            <OrdersTableBase
              data={table.paginatedData}
              totalPages={table.totalPages}
              currentPage={table.currentPage}
              onPageChange={table.handlePageChange}
              onDelete={handleDeleteOrder}
              onClose={enableCloseOrder ? handleOpenDialog : undefined}
              onSelect={handleOrderSelect} // 👈 nuevo handler
              selectedOrder={selectedOrder}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Vista de detalle de orden seleccionada */}
      {selectedOrder && (
        <motion.div
          layout
          className="rounded-lg border border-gray-200 bg-white shadow-sm p-4"
        >
          <h3 className="text-lg font-semibold mb-3">
            Detalle de orden #{selectedOrder.id}
          </h3>
          {dataItems.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {dataItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between py-2 text-sm text-gray-700"
                >
                  <span>
                    {item.name} ×{" "}
                    {
                      selectedOrder.items.find(
                        (i) => i.productId === item.id
                      )?.quantity
                    }
                  </span>
                  <span>${Number(item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Sin productos en esta orden.</p>
          )}
          <div className="flex justify-between mt-4 font-semibold text-gray-800">
            <span>Total:</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
        </motion.div>
      )}

      {/* 🔹 Modal de cierre */}
      {enableCloseOrder && (
        <CloseOrderDialog
          open={isDialogOpen}
          order={selectedOrder}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleCloseOrder}
        />
      )}
    </main>
  );
};

/* ----------------------------
   Componentes auxiliares
---------------------------- */

const HeaderActions = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
}) => (
  <div className="flex justify-between items-center mb-6 scale-90">
    <div className="flex space-x-2">
      <TabButton
        label="Delivery"
        isActive={activeTab === "delivery"}
        onClick={() => setActiveTab("delivery")}
      />
      <TabButton
        label="Local"
        isActive={activeTab === "local"}
        onClick={() => setActiveTab("local")}
      />
    </div>

    <SearchOrder
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      className="flex-1 h-10 rounded-lg border border-gray-300 pl-10 pr-4 focus:ring-2 focus:ring-amber-500 transition"
    />
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

const Message = ({ text, type }) => {
  const color = type === "error" ? "text-red-500" : "text-gray-600";
  return (
    <div className={`text-center py-10 text-base font-medium ${color}`}>
      {text}
    </div>
  );
};

export default OrdersManager;
