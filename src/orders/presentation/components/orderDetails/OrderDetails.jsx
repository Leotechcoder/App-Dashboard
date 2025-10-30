"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { idGenerator } from "../../../../shared/infrastructure/utils/idGenerator";
import { addItems, deleteItem, getData, updateDataItems } from "../../../application/itemSlice";
import { getUserData } from "../../../../users/application/userSlice";
import { setSelectedProduct } from "../../../../products/application/productSlice";
import { createDataOrder, updateDataOrder } from "../../../application/orderSlice"; // 👈 asegúrate de tener este thunk
import { Item } from "../../../domain/item";

import ItemModal from "./ItemModal";
import OrderItemsTable from "./OrderItemsTable";
import OrderUserSelector from "./OrderUserSelector";
import OrderDeliveryType from "./OrderDeliveryType";
import OrderSummary from "./OrderSummary";
import DateTime from "../DateTime";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 🔄 Al montar o cambiar la orden seleccionada
  useEffect(() => {
    dispatch(getUserData());
    dispatch(getData());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrder) {
      // sincronizar con la orden al editar
      setItems(selectedOrder.items || []);
      setDeliveryType(selectedOrder.deliveryType || "local");
      setOrderDetails((prev) => ({
        ...prev,
        userId: selectedOrder.userId || prev.userId,
        userName: selectedOrder.userName || prev.userName,
        status: selectedOrder.status || prev.status,
      }));
    }
  }, [selectedOrder]);

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

  const removeProduct = (id) => setItems(items.filter((i) => i.id !== id));

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

  // 💾 Guardar o actualizar orden
  const handleOrderSave = async () => {
    if (!items.length) return;

    const newOrder = {
      ...orderDetails,
      items,
      totalAmount: calculateSubTotal,
      paymentInfo: null,
      deliveryType, 
    };

    if (selectedOrder?.id) {
      const originalItems = selectedOrder.items || [];

      const newItems = items.filter(
        (i) => !originalItems.some((old) => old.productId === i.productId)
      );

      const deletedItems = originalItems.filter(
        (old) => !items.some((i) => i.productId === old.productId)
      );

      const updatedItems = items.filter((i) => {
        const original = originalItems.find((oi) => oi.productId === i.productId);
        const isPersisted = i.id?.startsWith("It-");
        return (
          original &&
          isPersisted &&
          (i.quantity !== original.quantity ||
            i.unitPrice !== original.unitPrice ||
            i.description !== original.description)
        );
      });

      // 🔹 Eliminar ítems borrados
      if (deletedItems.length > 0) {
        await Promise.all(
          deletedItems.map((del) =>
            dispatch(deleteItem({ orderId: selectedOrder.id, itemId: del.id }))
          )
        );
      }

      // 🔹 Agregar ítems nuevos
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

      // 🔹 Actualizar ítems existentes
      if (updatedItems.length > 0) {
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

      // 🔹 Actualizar método de entrega si cambió
      if (deliveryType !== selectedOrder.deliveryType) {
        await dispatch(
          updateDataOrder({
            id: selectedOrder.id,
            data: { deliveryType },
          })
        );
      }
    } else {
      await dispatch(createDataOrder(newOrder));
    }

    onBack();
  };

  return (
    <main className="py-6 px-8 bg-muted/40 min-h-screen">
      {isModalOpen && (
        <ItemModal
          setModal={setIsModalOpen}
          setUpdateItem={setUpdateItem}
          updateItem={updateItem}
          setItems={setItems}
          items={items}
        />
      )}

      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-5"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a las órdenes
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🧾 Productos seleccionados */}
        <Card className="shadow-sm border border-gray-200 bg-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">
              Productos seleccionados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderItemsTable
              items={items}
              removeProduct={removeProduct}
              updateProduct={updateProduct}
              calculateSubTotal={calculateSubTotal}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </CardContent>
        </Card>

        {/* 📦 Detalles */}
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="bg-gradient-to-r from-primary/80 to-primary text-white py-4 rounded-t-lg">
            <CardTitle className="text-lg font-semibold tracking-wide">
              Detalles de la Orden
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 grid gap-4 text-sm">
            <OrderUserSelector
              orderDetails={orderDetails}
              handleUserInput={handleUserInput}
              handleSelectUser={handleSelectUser}
              filteredUsers={filteredUsers}
              showSuggestions={showSuggestions}
              selectedOrder={selectedOrder}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-600 text-sm">Orden N°</Label>
                <p className="font-medium text-gray-800">
                  {selectedOrder?.items?.[0]?.orderId || "Pendiente"}
                </p>
              </div>

              <div>
                <Label className="text-gray-600 text-sm">Orden abierta</Label>
                <p className="font-medium text-gray-800">
                  {selectedOrder ? selectedOrder.createdAt : <DateTime />}
                </p>
              </div>

              <div>
                <Label className="text-gray-600 text-sm">Estado</Label>
                <p
                  className={`font-medium ${
                    selectedOrder?.status === "closed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {selectedOrder?.status || "Pendiente"}
                </p>
              </div>
            </div>

            <OrderDeliveryType
              deliveryType={deliveryType}
              setDeliveryType={setDeliveryType}
            />

            <OrderSummary
              handleOrderSave={handleOrderSave}
              selectedOrder={selectedOrder}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default OrderDetails;
