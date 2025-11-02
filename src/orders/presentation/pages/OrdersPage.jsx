// =========================
// 📦 Imports
// =========================
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { toast } from "sonner";

// 🧩 Componentes internos
import OrderDetails from "../components/orderDetails/OrderDetails";
import { ButtonAddOrder } from "../components/Buttons";
import OrdersTable from "../components/OrdersTable";
import { SearchOrder } from "../components/SearchOrder";
import InfoButton from "../components/InfoButton";

// 🧠 Redux slices
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

// 🧠 Hook genérico de tabla
import { useTableData } from "@/shared/hook/useTableDataO";

// =========================
// 🧭 Componente principal
// =========================
const OrdersPage = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const shownMessageRef = useRef("");

  const { isLoading, error, selectedOrder, showHelp, message } = useSelector(
    (state) => state.orders
  );

  const [activeTab, setActiveTab] = useState("local");
  const [createOrder, setCreateOrder] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // =========================
  // 🔍 Hook centralizado de tabla
  // =========================
  const table = useTableData({
    stateKey: "orders",
    itemsPerPage: 10,
    searchFields: ["id", "userName"],
    setFilteredData: setFilteredOrders,
    setCurrentPage: setCurrentPageOrders,
    externalFilter: (order) => order.deliveryType === activeTab && order.status === "pending",
  });

  // =========================
  // 🔄 Ciclo de vida
  // =========================
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getDataOrders());
      dispatch(getData());
    }
  }, []);

  // 🚀 Mostrar toast cuando haya mensaje nuevo
  useEffect(() => {
    if (message && shownMessageRef.current !== message) {
      toast.success(message);
      setTimeout(() => {
        shownMessageRef.current = message;
        dispatch(setClearMessage());
      }, 2000);
    }
  }, [message, dispatch]);

  // =========================
  // ⚙️ Handlers
  // =========================
  const handleCreateOrder = () => setCreateOrder(true);

  const handleBack = async () => {
    dispatch(voidSelectedProduct());
    dispatch(voidItemSelected());
    dispatch(setSelectedOrder(null));
    setCreateOrder(false);

    setIsRefreshing(true);
    await dispatch(getDataOrders());
    dispatch(getData());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSetSelectedOrder = (order) => dispatch(setSelectedOrder(order));

  const handleShowHelp = () => dispatch(setShowHelpOrders());

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = 
      window.confirm("¿Estás seguro que querés eliminar esta orden? Esta acción no se puede deshacer."
  );

  if (!confirmDelete) return;
  await dispatch(deleteDataOrder(orderId));
  await dispatch(getDataOrders());
};


  // =========================
  // 🚦 Estados intermedios
  // =========================
  if (isLoading && !isRefreshing)
    return <Message text="Cargando órdenes..." type="loading" />;
  if (error) return <Message text={`Error: ${error}`} type="error" />;
  if (selectedOrder || createOrder)
    return <OrderDetails onBack={handleBack} />;

  // =========================
  // 🧱 Render principal
  // =========================
  return (
    <main className="p-5 pt-6 w-full max-w-screen-xl">
      <AnimatePresence mode="wait">
        {/* Encabezado principal */}
        {!showHelp && (
          <motion.div
            key="header"
            className="flex items-center justify-between pl-4 pr-6 scale-90"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-semibold text-gray-800 pl-10">
              Gestión de Órdenes
            </h1>
            <InfoButton showHelp={handleShowHelp} />
          </motion.div>
        )}

        {/* Bloque de ayuda contextual */}
        {showHelp && (
          <motion.div
            key="help"
            className="bg-white border-l-4 border-amber-500 rounded-lg shadow-md px-5 py-3 mt-2 mb-6 relative max-w-5xl ml-8 mr-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <HelpContent onClose={handleShowHelp} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs + Acciones */}
      <HeaderActions
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateOrder={handleCreateOrder}
        searchTerm={table.searchTerm}
        setSearchTerm={table.setSearchTerm}
      />

      {/* 👇 Bloque condicional para recarga suave */}
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
            <OrdersTable
              data={table.paginatedData}
              totalPages={table.totalPages}
              currentPage={table.currentPage}
              onPageChange={table.handlePageChange}
              setSelectedOrder={handleSetSelectedOrder}
              handleDeleteOrder={handleDeleteOrder}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

// =========================
// 🧩 Subcomponentes
// =========================
const Message = ({ text, type }) => {
  const baseStyles = "text-center py-10 text-base font-medium";
  const color = type === "error" ? "text-red-500" : "text-gray-600";
  return <div className={`${baseStyles} ${color}`}>{text}</div>;
};

const HelpContent = ({ onClose }) => (
  <div className="flex items-start space-x-3 relative p-2">
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
    >
      ✕
    </button>
    <Info className="text-amber-500 w-6 h-6 mt-1 flex-shrink-0" />
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Gestión de Órdenes
      </h2>
      <p className="text-gray-600 leading-relaxed text-sm ">
        En esta sección podés <b>crear nuevas órdenes</b> o <b>modificar órdenes existentes</b> </p>
      <p className="text-gray-600 mt-2 leading-relaxed text-sm">
        Cada orden incluye información detallada del cliente, los artículos y muestra el punto actual en el que se encuentra.
      </p>
    </div>
  </div>
);

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
