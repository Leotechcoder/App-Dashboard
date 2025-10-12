import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderDetails from "../components/orderDetails/OrderDetails";
import { ButtonAddOrder } from "../components/Buttons";
import OrdersTable from "../components/OrdersTable";
import { SearchOrder } from "../components/SearchOrder";
import { getDataOrders, setSelectedOrder } from "../../application/orderSlice";
import {
  getData,
  voidItemSelected,
} from "../../application/itemSlice";
import { voidSelectedProduct } from "../../../products/application/productSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const { isLoading, error, selectedOrder } = useSelector(
    (state) => state.orders
  );

  const [activeTab, setActiveTab] = useState("pending");
  const [createOrder, setCreateOrder] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    if(!hasFetched.current){
      hasFetched.current = true;
      dispatch(getDataOrders());
      dispatch(getData())
    }
    
  }, []);


  // Crear nueva orden
  const handleCreateOrder = () => setCreateOrder(true);

  // Volver desde detalles o creación
  const handleBack = () => {
    dispatch(voidSelectedProduct());
    dispatch(voidItemSelected());
    dispatch(setSelectedOrder(null));
    setCreateOrder(false);
    hasFetched.current = false;
  };

  // Seleccionar orden de la tabla
  const handleSetSelectedOrder = (order) => dispatch(setSelectedOrder(order));

  // Cerrar ayuda
  const handleCloseHelp = () => setShowHelp(false);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="text-center text-gray-600 py-10">Cargando órdenes...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  // Vista detalle o creación
  if (selectedOrder || createOrder) {
    return <OrderDetails onBack={handleBack} />;
  }

  return (
    <main className="p-5 pt-3 w-full max-w-screen-xl">
      <div className="p-5">
        {/* Mensaje de ayuda */}
        {showHelp && (
          <div className="bg-white border-l-4 border-amber-500 rounded-lg shadow-md p-5 mb-6 relative max-w-6xl mx-auto">
            <button
              onClick={handleCloseHelp}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              🧾 Gestión de Órdenes
            </h2>
            <p className="text-gray-600 px-5 leading-relaxed text-base md:text-base">
              En esta sección podés <b>crear nuevas órdenes de compra</b>, agregar
              productos, definir la <b>forma de pago</b> y controlar el <b>estado de
              envío</b>.  
            </p>
            <p className="text-gray-600 mt-2 px-5 leading-relaxed text-base md:text-base">
              Cada orden incluye información detallada del cliente, los artículos
              solicitados, los importes cobrados y el seguimiento del envío.  
              Podés gestionar tus ventas de forma centralizada y mantener un
              control total del flujo de pedidos.
            </p>
            <p className="text-gray-600 mt-2">
              🔍 Usá la barra de búsqueda para encontrar órdenes por nombre o ID,
              o filtrá por su estado entre <b>pendientes</b> y <b>entregadas</b>.
            </p>
          </div>
        )}

        {/* Header con Tabs y Acciones */}
        <div className="flex justify-between items-center mb-6">
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
            <ButtonAddOrder handleClick={handleCreateOrder} />
            <SearchOrder tipo="ordenes" />
          </div>
        </div>

        {/* Tabla de órdenes */}
        <OrdersTable
          setSelectedOrder={handleSetSelectedOrder}
          activeTab={activeTab}
        />
      </div>
    </main>
  );
};

// Botón para Tabs
const TabButton = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 rounded-full transition-colors ${
      isActive
        ? "bg-amber-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default OrdersPage;
