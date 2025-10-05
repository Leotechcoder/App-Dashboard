import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderDetails from "../components/OrderDetails";
import { ButtonAddOrder } from "../components/Buttons";
import OrdersTable from "../components/OrdersTable";
import { SearchOrder } from "../components/SearchOrder";
import { getDataOrders, setSelectedOrder } from "../../application/orderSlice";
import {
  getData as getItemsData,
  voidItemSelected,
} from "../../application/itemSlice";
import { voidSelectedProduct } from "../../../products/application/productSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error, selectedOrder, filteredOrders } = useSelector(
    (state) => state.orders
  );

  const [activeTab, setActiveTab] = useState("pending");
  const [createOrder, setCreateOrder] = useState(false);

  // Cargar órdenes al montar
  useEffect(() => {
    if (!data?.length) dispatch(getDataOrders());
  }, [dispatch]);

  // Crear nueva orden
  const handleCreateOrder = () => setCreateOrder(true);

  // Volver desde detalles o creación
  const handleBack = () => {
    dispatch(voidSelectedProduct());
    dispatch(voidItemSelected());
    dispatch(setSelectedOrder(null));
    setCreateOrder(false);
  };

  // Seleccionar orden de la tabla
  const handleSetSelectedOrder = (order) => dispatch(setSelectedOrder(order));

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
    return <OrderDetails order={selectedOrder} onBack={handleBack} />;
  }

  return (
    <main className="p-5 pt-3 w-full max-w-screen-xl">
      <div className="p-5">
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
        ? "bg-brown-750 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default OrdersPage;
