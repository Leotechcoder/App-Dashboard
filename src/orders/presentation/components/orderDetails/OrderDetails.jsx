// OrderDetails.jsx
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { idGenerator } from "../../../../shared/infrastructure/utils/idGenerator";
import { addItems, deleteItem, getData, updateDataItems } from "../../../application/itemSlice";
import {
  getDataOrders,
  createDataOrder,
} from "../../../application/orderSlice";
import { getUserData } from "../../../../users/application/userSlice";
import { setSelectedProduct } from "../../../../products/application/productSlice";
import { Item } from "../../../domain/item";
import ItemModal from "./ItemModal";
import OrderItemsTable from "./OrderItemsTable";
import OrderUserSelector from "./OrderUserSelector";
import OrderDeliveryType from "./OrderDeliveryType";
import OrderPaymentSection from "./OrderPaymentSection";
import OrderSummary from "./OrderSummary";
import DateTime from "../DateTime";

const OrderDetails = ({ onBack }) => {
  const dispatch = useDispatch();
  const { itemSelected } = useSelector((store) => store.items);
  const selectedOrder = useSelector((store) => store.orders.selectedOrder);
  const users = useSelector((store) => store.users.data);

  const [items, setItems] = useState(selectedOrder?.items || []);
  const [orderDetails, setOrderDetails] = useState({
    userId: idGenerator("Users"),
    userName: "Invitado",
    status: "pending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(false);
  const [deliveryType, setDeliveryType] = useState("local");
  const [modoCobro, setModoCobro] = useState(false);
  const [payments, setPayments] = useState({
    efectivo: false,
    credito: false,
    debito: false,
  });
  const [amounts, setAmounts] = useState({
    efectivo: "",
    credito: "",
    debito: "",
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Funciones auxiliares
  const handleTogglePayment = (method) => {
    setPayments((prev) => ({ ...prev, [method]: !prev[method] }));
    if (payments[method]) setAmounts((prev) => ({ ...prev, [method]: "" }));
  };
  const handleAmountChange = (method, value) =>
    setAmounts((prev) => ({ ...prev, [method]: value }));

  const handleUserInput = (e) => {
    const value = e.target.value;
    setOrderDetails({ ...orderDetails, userName: value });
    const filtered = users.filter((u) =>
      u.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setShowSuggestions(value.length > 0);
  };
  const handleSelectUser = (user) => {
    setOrderDetails({ userId: user.id, userName: user.username, status: "pending" });
    setShowSuggestions(false);
  };

  useEffect(() => {
    dispatch(getUserData());
    dispatch(getData());
  }, [dispatch]);

  useEffect(() => {
    if (itemSelected.length > 0) {
      setItems((prev) => {
        const unique = [...prev, ...itemSelected].filter(
          (item, i, self) => i === self.findIndex((x) => x.id === item.id)
        );
        return unique;
      });
    }
  }, [itemSelected]);

  //Eliminar producto de la orden local/BD
  const removeProduct = (id) => setItems(items.filter((i) => i.id !== id));

  //Actualizar producto de la orden local
  const updateProduct = (id) => {
    const item = items.find((i) => i.id === id);
    dispatch(setSelectedProduct(item));
    setUpdateItem(!updateItem);
    setIsModalOpen(true);
  };

  const calculateSubTotal = items.reduce(
    (t, i) => t + Number(i.unitPrice) * Number(i.quantity),
    0
  );

  const handleOrderSave = async () => {
  if (!items.length) return;

  const newOrder = {
    ...orderDetails,
    items,
    totalAmount: calculateSubTotal,
    paymentInfo: {
      methods: Object.keys(payments).filter((m) => payments[m]),
      amounts,
    },
    deliveryType,
  };

  // Si la orden ya existe (edición)
  if (selectedOrder?.id) {
    const originalItems = selectedOrder.items || [];

    // Detectar ítems nuevos, eliminados y actualizados
    const newItems = items.filter(
      (i) => !originalItems.some((old) => old.productId === i.productId)
    );

    const deletedItems = originalItems.filter(
      (old) => !items.some((i) => i.productId === old.productId)
    );

    const updatedItems = items.filter((i) => {
      const original = originalItems.find((oi) => oi.productId === i.productId);
      const isPersisted = i.id?.startsWith("It-"); // Solo actualizamos los que ya existen en DB
      return (
        original &&
        isPersisted &&
        (i.quantity !== original.quantity ||
          i.unitPrice !== original.unitPrice ||
          i.description !== original.description)
      );
    });

    console.log({ newItems, deletedItems, updatedItems });

    // 1️⃣ Eliminar ítems borrados
    if (deletedItems.length > 0) {
      await Promise.all(
        deletedItems.map((del) =>
          dispatch(deleteItem({ orderId: selectedOrder.id, itemId: del.id }))
        )
      );
    }

    // 2️⃣ Agregar nuevos ítems
    if (newItems.length > 0) {
      const formatted = newItems.map(
        (i) =>
          new Item(
            i.id,
            i.productId,
            i.productName,
            i.description,
            i.unitPrice,
            i.quantity
          )
      );
      await dispatch(
        addItems({
          orderId: selectedOrder.id,
          items: formatted.map((i) => i.toApiFormat()),
        })
      );
    }

    // 3️⃣ Actualizar ítems existentes (solo si ya están persistidos)
    if (updatedItems.length > 0) {
      console.log("Actualizando ítems:", updatedItems);
      for (const item of updatedItems) {
        await dispatch(
          updateDataItems({
            orderId: selectedOrder.id,
            itemId: item.id,
            data: {
              description: item.description,
              quantity: item.quantity,
            },
          })
        );
      }
    }

  } else {
    // Si la orden es nueva
    await dispatch(createDataOrder(newOrder));
  }

  onBack();
};



  return (
    <main className="py-5 pt-2 scale-90">
      {isModalOpen && (
        <ItemModal
          setModal={setIsModalOpen}
          setUpdateItem={setUpdateItem}
          updateItem={updateItem}
          setItems={setItems}
          items={items}
        />
      )}

      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-3 px-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a las órdenes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-8">
        <OrderItemsTable
          items={items}
          removeProduct={removeProduct}
          updateProduct={updateProduct}
          calculateSubTotal={calculateSubTotal}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

        <div className="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
          <div className="bg-orange-600 text-white p-3 font-semibold">
            DETALLES DE LA ORDEN
          </div>
          <div className="p-4 grid gap-3 text-sm">
            <OrderUserSelector
              orderDetails={orderDetails}
              handleUserInput={handleUserInput}
              handleSelectUser={handleSelectUser}
              filteredUsers={filteredUsers}
              showSuggestions={showSuggestions}
              selectedOrder={selectedOrder}
            />
            {/* Datos de orden */}
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-gray-600">Orden N°</label>
                <span className="font-medium">
                  {selectedOrder?.items?.[0]?.orderId || "Pendiente"}
                </span>
              </div>

              <div>
                <label className="block text-gray-600 font-medium">
                  Orden abierta:
                </label>
                {selectedOrder ? (
                  <span className="font-semibold text-xs">
                    {selectedOrder.createdAt}
                  </span>
                ) : (
                  <span className="font-semibold text-xs">
                    <DateTime />
                  </span>
                )}
              </div>

              <div>
                <label className="block text-gray-600">
                  Estado de la Orden
                </label>
                <span className="font-medium">
                  {selectedOrder?.status || "Pendiente"}
                </span>
              </div>
            </div>
            <OrderDeliveryType
              deliveryType={deliveryType}
              setDeliveryType={setDeliveryType}
            />
            <OrderPaymentSection
              modoCobro={modoCobro}
              setModoCobro={setModoCobro}
              payments={payments}
              handleTogglePayment={handleTogglePayment}
              amounts={amounts}
              handleAmountChange={handleAmountChange}
            />
          </div>
          <OrderSummary
            handleOrderSave={handleOrderSave}
            selectedOrder={selectedOrder}
            modoCobro={modoCobro}
          />
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
