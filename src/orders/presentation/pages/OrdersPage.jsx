// =========================
// 📦 Imports
// =========================
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

// 🧩 Componentes internos
import OrderDetails from "../components/orderDetails/OrderDetails";
import { ButtonAddOrder } from "../components/Buttons";
import OrdersTable from "../components/OrdersTable";
import { SearchOrder } from "../components/SearchOrder";
import InfoButton from "../components/InfoButton";

// 🧠 Redux slices
import {
  getDataOrders,
  setSelectedOrder,
  setShowHelpOrders,
} from "../../application/orderSlice";
import { getData, voidItemSelected } from "../../application/itemSlice";
import { voidSelectedProduct } from "../../../products/application/productSlice";

// =========================
// 🧭 Componente principal
// =========================
const OrdersPage = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  const { isLoading, error, selectedOrder, showHelp } = useSelector(
    (state) => state.orders
  );

  const [activeTab, setActiveTab] = useState("pending");
  const [createOrder, setCreateOrder] = useState(false);

  // =========================
  // 🔄 Ciclo de vida
  // =========================
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getDataOrders());
      dispatch(getData());
    }
  }, [dispatch]);

  // =========================
  // ⚙️ Handlers
  // =========================
  const handleCreateOrder = () => setCreateOrder(true);

  const handleBack = () => {
    dispatch(voidSelectedProduct());
    dispatch(voidItemSelected());
    dispatch(setSelectedOrder(null));
    setCreateOrder(false);
  };

  const handleSetSelectedOrder = (order) => dispatch(setSelectedOrder(order));

  const handleShowHelp = () => dispatch(setShowHelpOrders());

  // =========================
  // 🚦 Estados intermedios
  // =========================
  if (isLoading)
    return <Message text="Cargando órdenes..." type="loading" />;
  if (error)
    return <Message text={`Error: ${error}`} type="error" />;
  if (selectedOrder || createOrder)
    return <OrderDetails onBack={handleBack} />;

  // =========================
  // 🧱 Render principal
  // =========================
  return (
    <main className="p-5 pt-3 w-full max-w-screen-xl">
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
      />

      {/* Tabla de órdenes */}
      <OrdersTable
        setSelectedOrder={handleSetSelectedOrder}
        activeTab={activeTab}
      />
    </main>
  );
};

// =========================
// 🧩 Subcomponentes
// =========================

// Mensajes de carga y error
const Message = ({ text, type }) => {
  const baseStyles = "text-center py-10 text-base font-medium";
  const color =
    type === "error"
      ? "text-red-500"
      : "text-gray-600";
  return <div className={`${baseStyles} ${color}`}>{text}</div>;
};

// Bloque de ayuda contextual
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
        En esta sección podés <b>crear nuevas órdenes de compra</b>,
        agregar productos, definir la <b>forma de pago</b> y controlar el{" "}
        <b>estado de envío</b>.
      </p>
      <p className="text-gray-600 mt-2 leading-relaxed text-sm">
        Cada orden incluye información detallada del cliente, los artículos solicitados, 
        los importes cobrados y el seguimiento del envío. 
        Gestioná tus ventas de forma centralizada y mantené un control total del flujo de pedidos.
      </p>
      <p className="text-gray-600 mt-2  text-sm">
        Usá la barra de búsqueda para encontrar órdenes por nombre o ID, 
        o filtrá por su estado entre <b>pendientes</b> y <b>entregadas</b>.
      </p>
    </div>
  </div>
);

// Tabs + Acciones
const HeaderActions = ({ activeTab, setActiveTab, onCreateOrder }) => (
  <div className="flex justify-between items-center mb-6 scale-90">
    <div className="flex space-x-2">
      <TabButton
        label="Pendientes de Entrega"
        isActive={activeTab === "charged"}
        onClick={() => setActiveTab("charged")}
      />
      <TabButton
        label="Cobro Pendiente"
        isActive={activeTab === "pending"}
        onClick={() => setActiveTab("pending")}
      />
    </div>

    <div className="flex space-x-4">
      <ButtonAddOrder handleClick={onCreateOrder} />
      <SearchOrder />
    </div>
  </div>
);

// Botón de Tabs
const TabButton = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 rounded-full transition-colors font-medium ${
      isActive
        ? "bg-amber-600 text-white shadow-sm"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200 "
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

// =========================
// 🏁 Export
// =========================
export default OrdersPage;
