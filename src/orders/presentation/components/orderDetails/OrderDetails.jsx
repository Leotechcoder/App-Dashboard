"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Package,
  Clock,
  Truck,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { idGenerator } from "../../../../shared/infrastructure/utils/idGenerator";
import {
  addItems,
  deleteItem,
  getData,
  updateDataItems,
} from "../../../application/itemSlice";
import { getUserData } from "../../../../users/application/userSlice";
import { setSelectedProduct } from "../../../../products/application/productSlice";
import {
  createDataOrder,
  getDataOrders,
  updateDataOrder,
} from "../../../application/orderSlice";
import { Item } from "../../../domain/item";

import ItemModal from "./ItemModal";
import OrderItemsTable from "./OrderItemsTable";
import DateTime from "../DateTime";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import clsx from "clsx";
import { fetchPendingOrders } from "@/sales/application/salesThunks";

export default function OrderDetails({ onBack, className }) {
  const dispatch = useDispatch();
  const { itemSelected } = useSelector((store) => store.items);
  const selectedOrder = useSelector((store) => store.orders.selectedOrder);
  const users = useSelector((store) => store.users.data);

  const isEditing = !!selectedOrder;
  
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

  useEffect(() => {
    dispatch(getUserData());
    dispatch(getData());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrder) {
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
    setOrderDetails({
      userId: user.id,
      userName: user.username,
      status: "pending",
    });
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
        const original = originalItems.find(
          (oi) => oi.productId === i.productId
        );
        const isPersisted = i.id?.startsWith("It-");
        return (
          original &&
          isPersisted &&
          (i.quantity !== original.quantity ||
            i.unitPrice !== original.unitPrice ||
            i.description !== original.description)
        );
      });

      if (deletedItems.length > 0) {
        await Promise.all(
          deletedItems.map((del) =>
            dispatch(deleteItem({ orderId: selectedOrder.id, itemId: del.id }))
          )
        );
      }

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
    
    dispatch(getData());
    onBack();
  };

  return (
    <main
      className={clsx(`py-6 px-8 min-h-screen transition-colors duration-500 ${
        isEditing ? "bg-blue-50/40" : "bg-emerald-50/30"
      }` , className)}
    >
      {isModalOpen && (
        <ItemModal
          setModal={setIsModalOpen}
          setUpdateItem={setUpdateItem}
          updateItem={updateItem}
          setItems={setItems}
          items={items}
        />
      )}

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className={`flex items-center ${
            isEditing
              ? "text-blue-800 hover:text-blue-600"
              : "text-gray-700 hover:text-emerald-600"
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a las órdenes
        </Button>
        <h2
          className={`ml-4 text-xl font-semibold flex items-center gap-2 ${
            isEditing ? "text-blue-900" : "text-gray-800"
          }`}
        >
          <ShoppingCart
            className={`w-5 h-5 ${
              isEditing ? "text-blue-700" : "text-emerald-600"
            }`}
          />
          {isEditing ? "Editar Orden" : "Nueva Orden"}
        </h2>
      </div>

      {/* Card principal */}
      <Card
        className={`border shadow-md rounded-xl overflow-hidden transition-all ${
          isEditing
            ? "border-blue-200 bg-white/90"
            : "border-emerald-100 bg-white"
        }`}
      >
        {/* Info superior */}
        <div
          className={`grid grid-cols-4 gap-4 p-4 border-b text-sm ${
            isEditing
              ? "bg-blue-50 border-blue-100 text-blue-900"
              : "bg-emerald-50 border-emerald-100 text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <div>
              <Label className="text-xs opacity-70">Orden N°</Label>
              <p className="font-medium">
                {selectedOrder?.id || "Pendiente"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <div>
              <Label className="text-xs opacity-70">Abierta</Label>
              <p className="font-medium">
                {selectedOrder ? selectedOrder.createdAt : <DateTime />}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <div>
              <Label className="text-xs opacity-70">Cliente</Label>
              <p className="font-medium">{orderDetails.userName}</p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              onClick={handleOrderSave}
              className={`shadow-sm ${
                isEditing
                  ? "bg-blue-700 hover:bg-blue-800 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {isEditing ? "Actualizar Orden" : "Guardar Orden"}
            </Button>
          </div>
        </div>

        {/* Formulario de usuario / tipo de entrega */}
        <CardContent className={!isEditing ? "p-6 grid grid-cols-2 gap-6 border-b border-gray-100" : "px-6 pt-5 flex justify-end border-b border-gray-100"}>
          {!isEditing && (
            <>
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  Buscar o ingresar cliente
                </Label>
                <Input
                  value={orderDetails.userName}
                  onChange={handleUserInput}
                  placeholder="Ej: Juan Pérez"
                  className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {showSuggestions && filteredUsers.length > 0 && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-md">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="px-3 py-2 cursor-pointer hover:bg-emerald-50 transition-colors"
                      >
                        {user.username}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </>
          )}
              <div className={isEditing? 'ml-auto' : ''}>
                <Label className="text-sm text-gray-700 mb-2 block">
                  Tipo de entrega
                </Label>
                <Select value={deliveryType} onValueChange={setDeliveryType}>
                  <SelectTrigger className={!isEditing ? "border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500" : "border-blue-300 focus:ring-blue-500 focus:boder-blue-500 w-48"}>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Retiro en local</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
        </CardContent>

        {/* Tabla de productos */}
        <CardContent className="p-6">
          <OrderItemsTable
            items={items}
            removeProduct={removeProduct}
            updateProduct={updateProduct}
            calculateSubTotal={calculateSubTotal}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            selectedOrder={selectedOrder}
          />
        </CardContent>
      </Card>
    </main>
  );
}
