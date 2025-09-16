
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderDetails from "../components/OrderDetails";
import { ButtonAddOrder } from "../components/Buttons";
import OrdersTable from "../components/OrdersTable";
import { SearchOrder } from "../components/SearchOrder";
import { getDataOrders, setSelectedOrder } from "../../application/orderSlice"; // Importa solo lo necesario
import { getData as getItemsData, voidItemSelected } from "../../application/itemSlice";
import { voidSelectedProduct } from "../../../products/application/productSlice";

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { isLoading, error, selectedOrder } = useSelector((state) => state.orders); // Destructura solo lo necesario
    const [activeTab, setActiveTab] = useState("pending");
    const [createOrder, setCreateOrder] = useState(false);

    useEffect(() => {
        dispatch(getDataOrders());
        dispatch(getItemsData());
    }, [dispatch]);

    const handleCreateOrder = () => setCreateOrder(true);

    const handleBack = () => {
        dispatch(voidSelectedProduct());
        dispatch(voidItemSelected());
        dispatch(setSelectedOrder(null)); // No es necesario volver a cargar las órdenes aquí
        setCreateOrder(false);
    };

    const handleSetSelectedOrder = (order) => dispatch(setSelectedOrder(order));

    if (isLoading) return <div className="text-center">Cargando órdenes...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;
    if (selectedOrder || createOrder) return <OrderDetails order={selectedOrder} onBack={handleBack} />;

    return (
        <main className="p-5 pt-3">
            <div className="p-5">
                {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">Órdenes</h2> */}
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
                <OrdersTable setSelectedOrder={handleSetSelectedOrder} activeTab={activeTab} /> {/* No pasa orders como prop */}
            </div>
        </main>
    );
};

const TabButton = ({ label, isActive, onClick }) => (
    <button
        className={`px-4 py-2 rounded-full ${
            isActive ? "bg-brown-750 text-white" : "bg-gray-100 text-gray-600"
        }`}
        onClick={onClick}
    >
        {label}
    </button>
);

export default OrdersPage;