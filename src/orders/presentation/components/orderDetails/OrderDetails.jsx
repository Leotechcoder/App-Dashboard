"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, User, Package, Clock, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { idGenerator } from "../../../../shared/infrastructure/utils/idGenerator";
import {
  addItems,
  deleteItem,
  getData,
  updateDataItems,
} from "../../../application/itemSlice";
import { getUserData } from "../../../../users/application/userSlice";
import {
  setSelectedProduct,
  voidSelectedProduct,
} from "../../../../products/application/productSlice";
import {
  createDataOrder,
  updateDataOrder,
} from "../../../application/orderSlice";
import { Item } from "../../../domain/item";

import ItemModal from "./ItemModal";
import OrderItemsTable from "./OrderItemsTable";
import DateTime from "../DateTime";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
    userName: "",
    status: "pending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(false);
  const [deliveryType, setDeliveryType] = useState("local");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < filteredUsers.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredUsers.length - 1
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < filteredUsers.length) {
        handleSelectUser(filteredUsers[selectedIndex]);
      }
    }
  };

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

    onBack();
  };

  return (
    <main
      className={clsx(
        "p-8 min-h-screen transition-colors duration-500 bg-[hsl(var(--background-unit-2))] border border-[hsl(var(--border))] ",
        className
      )}
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
          className={clsx(
            "flex items-center",
            "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--green)/0.1)]",
            "hover:cursor-pointer hover:text-[hsl(var(--primary))]"
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a las órdenes
        </Button>

        <h2
          className={clsx(
            "ml-4 text-xl font-semibold flex items-center gap-2",
            "text-[hsl(var(--foreground))]"
          )}
        >
          <ShoppingCart
            className={clsx(
              "w-5 h-5",
              isEditing
                ? "text-[hsl(var(--blue))]"
                : "text-[hsl(var(--green))]"
            )}
          />
          {isEditing ? "Editar Orden" : "Nueva Orden"}
        </h2>
      </div>

      {/* Card principal */}
      <Card
        className={clsx(
          "border shadow-md rounded-xl overflow-hidden transition-all",
          "bg-[hsl(var(--background-unit))]",
          isEditing
            ? "border-[hsl(var(--blue)/0.7)]"
            : "border-[hsl(var(--green)/0.7)]"
        )}
      >
        {/* Info superior */}
        <div
          className={clsx(
            "grid grid-cols-4 gap-4 p-4 border-b border-[hsl(var(--border))] text-sm",
            "text-[hsl(var(--muted-foreground))]",
            isEditing
              ? "bg-[hsl(var(--blue)/0.2)]"
              : "bg-[hsl(var(--green)/0.2)]"
          )}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <div>
              <Label className="text-xs opacity-70">Orden N°</Label>
              <p className="font-medium">{selectedOrder?.id || "Pendiente"}</p>
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
              className={clsx(
                "shadow-sm text-[hsl(var(--foreground))]",
                isEditing
                  ? "bg-[hsl(var(--blue))] hover:bg-[hsl(var(--blue)/0.9)]"
                  : "bg-[hsl(var(--green))] hover:bg-[hsl(var(--green)/0.9)]"
              )}
            >
              {isEditing ? "Actualizar Orden" : "Guardar Orden"}
            </Button>
          </div>
        </div>

        {/* Formulario de usuario / tipo de entrega */}
        <CardContent
          className={
            !isEditing
              ? "p-6 grid grid-cols-2 gap-6 border-b border-[hsl(var(--border))]"
              : "px-6 pt-5 flex justify-end border-b border-[hsl(var(--border))]"
          }
        >
          {!isEditing && (
            <div>
              <Label
                className="text-sm mb-2 block"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Buscar o ingresar cliente
              </Label>

              <Input
                value={orderDetails.userName}
                onChange={handleUserInput}
                placeholder="Ej: Juan Pérez"
                onKeyDown={handleKeyDown}
                className={clsx(
                  "h-10",
                  "text-[hsl(var(--foreground))]",
                  "bg-[hsl(var(--input))]",
                  "border-[hsl(var(--green)/0.5)]",
                  "focus:border-[hsl(var(--green))]",
                  "focus:ring-[hsl(var(--green))]"
                )}
              />

              {showSuggestions && filteredUsers.length > 0 && (
                <ul
                  className={clsx(
                    "mt-2 rounded-lg shadow-md max-h-48 overflow-auto",
                    "bg-[hsl(var(--input))]",
                    "border border-[hsl(var(--green)/0.5)]"
                  )}
                  role="listbox"
                >
                  {filteredUsers.map((user, index) => (
                    <li
                      key={user.id}
                      role="option"
                      aria-selected={index === selectedIndex}
                      tabIndex={0}
                      onClick={() => handleSelectUser(user)}
                      className={clsx(
                        "px-3 py-2 cursor-pointer transition-colors",
                        index === selectedIndex
                          ? "bg-[hsl(var(--order-suggestion-active))]"
                          : "hover:bg-[hsl(var(--order-suggestion-hover))]"
                      )}
                    >
                      {user.username}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className={isEditing ? "ml-auto" : ""}>
            <Label
              className="text-sm mb-2 block"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Tipo de entrega
            </Label>

            <Select value={deliveryType} onValueChange={setDeliveryType}>
              <SelectTrigger
                className={clsx(
                  "bg-[hsl(var(--input))] h-10",
                  isEditing
                    ? "border-[hsl(var(--blue)/0.5)] focus:ring-[hsl(var(--blue))]"
                    : "border-[hsl(var(--green)/0.5)] focus:ring-[hsl(var(--green))]",
                  isEditing && "w-48"
                )}
              >
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
