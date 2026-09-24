import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  User,
  Clock,
  ShoppingCart,
  MapPin,
  Store,
  Truck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

import {
  addItems,
  deleteItem,
  updateDataItems,
} from "@/orders/application/itemSlice";

import { setSelectedProduct } from "@/products/application/productSlice";

import {
  createDataOrder,
  updateDataOrder,
} from "@/orders/application/orderSlice";

import { Item } from "@/orders/domain/Item";

import ItemModal from "./ItemModal";
import ProductSelector from "./ProductSelector";
import OrderItemsTable from "./OrderItemsTable";
import DateTime from "../DateTime";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DELIVERY_OPTIONS = [
  {
    value: "delivery",
    label: "Delivery",
    icon: Truck,
  },
  {
    value: "local",
    label: "Retiro en local",
    icon: Store,
  },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    dot: "bg-[hsl(var(--yellow))]",
    text: "text-[hsl(var(--yellow))]",
    background: "bg-[hsl(var(--yellow)/0.08)]",
    border: "border-[hsl(var(--yellow)/0.2)]",
  },
  ready: {
    label: "Listo",
    dot: "bg-[hsl(var(--blue))]",
    text: "text-[hsl(var(--blue))]",
    background: "bg-[hsl(var(--blue)/0.08)]",
    border: "border-[hsl(var(--blue)/0.2)]",
  },
  "ready-to-pay": {
    label: "Lista para cobrar",
    dot: "bg-[hsl(var(--blue))]",
    text: "text-[hsl(var(--blue))]",
    background: "bg-[hsl(var(--blue)/0.08)]",
    border: "border-[hsl(var(--blue)/0.2)]",
  },
  paid: {
    label: "Pagado",
    dot: "bg-[hsl(var(--green))]",
    text: "text-[hsl(var(--green))]",
    background: "bg-[hsl(var(--green)/0.08)]",
    border: "border-[hsl(var(--green)/0.2)]",
  },
  cancelled: {
    label: "Cancelado",
    dot: "bg-[hsl(var(--salmon))]",
    text: "text-[hsl(var(--salmon))]",
    background: "bg-[hsl(var(--salmon)/0.08)]",
    border: "border-[hsl(var(--salmon)/0.2)]",
  },
};

function OrderDetails({ onBack }) {
  const dispatch = useDispatch();

  const selectedOrder = useSelector(
    (state) => state.orders.selectedOrder
  );

  const users = useSelector((state) => state.users.data);

  /*
   * Los items del pedido son un borrador LOCAL.
   * No usamos state.items.data porque contiene items globales
   * pertenecientes a distintas órdenes.
   */
  const [items, setItems] = useState(
    selectedOrder?.items || []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(false);

  const [deliveryType, setDeliveryType] = useState(
    selectedOrder?.deliveryType || "delivery"
  );

  const [deliveryAddress, setDeliveryAddress] = useState(
    selectedOrder?.deliveryAddress || ""
  );

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const customerFieldRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* STATUS                                                                     */
  /* -------------------------------------------------------------------------- */

  const orderStatus = selectedOrder?.status || "pending";

  const statusConfig =
    STATUS_CONFIG[orderStatus] || {
      label: orderStatus || "Pendiente",
      dot: "bg-[hsl(var(--muted-foreground))]",
      text: "text-[hsl(var(--muted-foreground))]",
      background:
        "bg-[hsl(var(--muted-foreground)/0.08)]",
      border: "border-[hsl(var(--border))]",
    };

  /* -------------------------------------------------------------------------- */
  /* CUSTOMER SEARCH                                                            */
  /* -------------------------------------------------------------------------- */

  const filteredUsers = useMemo(() => {
    if (!customerSearch.trim()) return [];

    const search = customerSearch.toLowerCase();

    return users.filter((user) =>
      String(user.username || "")
        .toLowerCase()
        .includes(search)
    );
  }, [users, customerSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        customerFieldRef.current &&
        !customerFieldRef.current.contains(event.target)
      ) {
        setIsCustomerListOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* TOTAL                                                                      */
  /* -------------------------------------------------------------------------- */

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = Number(item.unitPrice) || 0;
      const quantity = Number(item.quantity) || 0;

      return total + price * quantity;
    }, 0);
  }, [items]);

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value || 0);

  /* -------------------------------------------------------------------------- */
  /* INITIAL SYNC                                                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!selectedOrder) {
      setItems([]);
      setDeliveryType("delivery");
      setDeliveryAddress("");
      setSelectedCustomer(null);
      setCustomerSearch("");
      return;
    }

    setItems(selectedOrder.items || []);

    setDeliveryType(
      selectedOrder.deliveryType || "delivery"
    );

    setDeliveryAddress(
      selectedOrder.deliveryAddress || ""
    );

    const currentUser = users.find(
      (user) =>
        String(user.id) ===
        String(selectedOrder.userId)
    );

    if (currentUser) {
      setSelectedCustomer(currentUser);
      setCustomerSearch(currentUser.username || "");
    }
  }, [selectedOrder, users]);

  /* -------------------------------------------------------------------------- */
  /* ITEM ACTIONS                                                               */
  /* -------------------------------------------------------------------------- */

  const removeProduct = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const updateProduct = (id) => {
    const item = items.find(
      (currentItem) => currentItem.id === id
    );

    if (!item) return;

    dispatch(
      setSelectedProduct({
        productId: item.productId,
        productName: item.productName,
        description: item.description || "",
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        id: item.id,
      })
    );

    setUpdateItem(true);
    setIsModalOpen(true);
  };

  /* -------------------------------------------------------------------------- */
  /* CUSTOMER                                                                    */
  /* -------------------------------------------------------------------------- */

  const handleCustomerSelect = (user) => {
    setSelectedCustomer(user);
    setCustomerSearch(user.username || "");
    setIsCustomerListOpen(false);
  };

  /* -------------------------------------------------------------------------- */
  /* SAVE                                                                        */
  /* -------------------------------------------------------------------------- */

  const handleOrderSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const newOrder = {
        ...(selectedOrder || {}),
        userId:
          selectedCustomer?.id ||
          selectedOrder?.userId ||
          null,
        // El backend valida userName y status como requeridos en el
        // alta (POST /orders). El editar funcionaba porque ahí solo se
        // manda un PATCH parcial que no los exige — pero al crear, si
        // faltan, el Zod schema del backend devuelve 400 "Datos inválidos".
        userName:
          selectedCustomer?.username ||
          selectedOrder?.userName ||
          customerSearch ||
          "Cliente",
        status: selectedOrder?.status || "pending",
        deliveryType,
        deliveryAddress:
          deliveryType === "delivery"
            ? deliveryAddress
            : "",
        items,
        totalAmount: subtotal,
      };

      /* ---------------------------------------------------------------------- */
      /* NEW ORDER                                                              */
      /* ---------------------------------------------------------------------- */

      if (!selectedOrder) {
        await dispatch(
          createDataOrder(newOrder)
        ).unwrap();

        onBack();
        return;
      }

      /* ---------------------------------------------------------------------- */
      /* EXISTING ORDER                                                         */
      /* ---------------------------------------------------------------------- */

      const previousItems =
        selectedOrder.items || [];

      const previousByProduct = new Map(
        previousItems.map((item) => [
          String(item.productId),
          item,
        ])
      );

      const currentByProduct = new Map(
        items.map((item) => [
          String(item.productId),
          item,
        ])
      );

      /* ---------------------------------------------------------------------- */
      /* DELETED                                                                */
      /* ---------------------------------------------------------------------- */

      const deletedItems = previousItems.filter(
        (previousItem) =>
          !currentByProduct.has(
            String(previousItem.productId)
          )
      );

      if (deletedItems.length > 0) {
        await Promise.all(
          deletedItems.map((del) =>
            dispatch(
              deleteItem({
                orderId: selectedOrder.id,
                itemId: del.id,
              })
            ).unwrap()
          )
        );
      }

      /* ---------------------------------------------------------------------- */
      /* ADDED                                                                  */
      /* ---------------------------------------------------------------------- */

      const newItems = items.filter(
        (item) =>
          !previousByProduct.has(
            String(item.productId)
          )
      );

      if (newItems.length > 0) {
        const formatted = newItems.map(
          (item) =>
            new Item(
              item.id,
              item.productId,
              item.productName,
              item.description,
              item.unitPrice,
              item.quantity
            ).toApiFormat()
        );

        await dispatch(
          addItems({
            orderId: selectedOrder.id,
            items: formatted,
          })
        ).unwrap();
      }

      /* ---------------------------------------------------------------------- */
      /* UPDATED                                                                 */
      /* ---------------------------------------------------------------------- */

      for (const item of items) {
        const previousItem =
          previousByProduct.get(
            String(item.productId)
          );

        if (!previousItem) continue;

        const hasChanged =
          Number(previousItem.quantity) !==
            Number(item.quantity) ||
          String(
            previousItem.description || ""
          ) !== String(item.description || "") ||
          Number(previousItem.unitPrice) !==
            Number(item.unitPrice);

        if (!hasChanged) continue;

        await dispatch(
          updateDataItems({
            orderId: selectedOrder.id,
            itemId: item.id,
            data: {
              quantity: Number(item.quantity),
              description: item.description || "",
              unitPrice: Number(item.unitPrice),
            },
          })
        ).unwrap();
      }

      /* ---------------------------------------------------------------------- */
      /* ORDER INFORMATION                                                       */
      /* ---------------------------------------------------------------------- */

      const nextAddress =
        deliveryType === "delivery"
          ? deliveryAddress
          : "";

      const deliveryChanged =
        String(
          selectedOrder.deliveryType || ""
        ) !== String(deliveryType || "") ||
        String(
          selectedOrder.deliveryAddress || ""
        ) !== String(nextAddress);

      const customerChanged =
        String(selectedOrder.userId || "") !==
        String(
          selectedCustomer?.id ||
            selectedOrder.userId ||
            ""
        );

      if (deliveryChanged || customerChanged) {
        await dispatch(
          updateDataOrder({
            id: selectedOrder.id,
            data: {
              ...(deliveryChanged && {
                deliveryType,
                deliveryAddress: nextAddress,
              }),
              ...(customerChanged && {
                userId:
                  selectedCustomer?.id ||
                  selectedOrder.userId,
                userName:
                  selectedCustomer?.username ||
                  selectedOrder.userName,
              }),
            },
          })
        ).unwrap();
      }

      onBack();
    } finally {
      setIsSaving(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="flex h-full min-h-0 flex-col bg-[hsl(var(--background-unit-2))]">
      {/* ====================================================================== */
      /* HEADER                                                                  */
      /* ====================================================================== */}

      <header className="shrink-0 border-b border-[hsl(var(--border))] bg-[hsl(var(--background-unit-2))]">
        <div className="flex items-center gap-3 px-5 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="
              shrink-0
              rounded-xl
              text-[hsl(var(--muted-foreground))]
              hover:bg-[hsl(var(--background-unit-3))]
              hover:text-[hsl(var(--foreground))]
            "
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[hsl(var(--blue)/0.1)]
                text-[hsl(var(--blue))]
              "
            >
              <ShoppingCart className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-semibold text-[hsl(var(--foreground))]">
                  {selectedOrder
                    ? `Pedido #${selectedOrder.id}`
                    : "Nuevo pedido"}
                </h1>

                <span
                  className={clsx(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                    statusConfig.background,
                    statusConfig.border,
                    statusConfig.text
                  )}
                >
                  <span
                    className={clsx(
                      "h-1.5 w-1.5 rounded-full",
                      statusConfig.dot
                    )}
                  />

                  {statusConfig.label}
                </span>
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                <Clock className="h-3.5 w-3.5" />

                {selectedOrder?.createdAt ? (
                  <DateTime
                    date={selectedOrder.createdAt}
                  />
                ) : (
                  "Creando pedido"
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================== */
      /* MAIN                                                                     */
      /* ====================================================================== */}

      <main className="min-h-0 flex-1 overflow-hidden p-4 sm:p-5">
        <div className="flex h-full min-h-0 flex-col gap-4">
          {/* ------------------------------------------------------------------ */
          /* ORDER INFO                                                           */
          /* ------------------------------------------------------------------ */}

          <section className="shrink-0 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background-unit))]">
            <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_180px_minmax(0,1.15fr)]">
              {/* CUSTOMER */}

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-[hsl(var(--blue))]" />

                  <Label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    Cliente
                  </Label>
                </div>

                <div className="relative" ref={customerFieldRef}>
                  <Input
                    value={customerSearch}
                    onChange={(event) => {
                      setCustomerSearch(
                        event.target.value
                      );
                      setSelectedCustomer(null);
                      setIsCustomerListOpen(true);
                    }}
                    onFocus={() =>
                      setIsCustomerListOpen(true)
                    }
                    placeholder="Buscar cliente..."
                    className="
                      h-10
                      rounded-xl
                      border-[hsl(var(--border))]
                      bg-[hsl(var(--background-unit-2))]
                    "
                  />

                  {isCustomerListOpen &&
                    customerSearch &&
                    filteredUsers.length > 0 && (
                      <div
                        className="
                          absolute
                          left-0
                          right-0
                          top-full
                          z-30
                          mt-1
                          max-h-48
                          overflow-y-auto
                          rounded-xl
                          border
                          border-[hsl(var(--border))]
                          bg-[hsl(var(--background-unit-2))]
                          p-1
                          shadow-xl
                        "
                      >
                        {filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() =>
                              handleCustomerSelect(
                                user
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              gap-2
                              rounded-lg
                              px-3
                              py-2
                              text-left
                              text-sm
                              text-[hsl(var(--foreground))]
                              transition
                              hover:bg-[hsl(var(--background-unit-3))]
                            "
                          >
                            <div
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                bg-[hsl(var(--blue)/0.1)]
                                text-[hsl(var(--blue))]
                              "
                            >
                              <User className="h-3.5 w-3.5" />
                            </div>

                            <span className="truncate">
                              {user.username}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>

              {/* DELIVERY */}

              <div>
                <div className="mb-2 flex items-center gap-2">
                  {deliveryType === "delivery" ? (
                    <Truck className="h-4 w-4 text-[hsl(var(--blue))]" />
                  ) : (
                    <Store className="h-4 w-4 text-[hsl(var(--blue))]" />
                  )}

                  <Label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    Entrega
                  </Label>
                </div>

                <Select
                  value={deliveryType}
                  onValueChange={setDeliveryType}
                >
                  <SelectTrigger className="h-10 rounded-xl border-[hsl(var(--border))] bg-[hsl(var(--background-unit-2))]">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {DELIVERY_OPTIONS.map(
                      (option) => {
                        const Icon = option.icon;

                        return (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* ADDRESS */}

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[hsl(var(--blue))]" />

                  <Label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    Dirección
                  </Label>
                </div>

                <Input
                  value={deliveryAddress}
                  onChange={(event) =>
                    setDeliveryAddress(
                      event.target.value
                    )
                  }
                  disabled={deliveryType !== "delivery"}
                  placeholder={
                    deliveryType === "delivery"
                      ? "Dirección de entrega..."
                      : "No requiere dirección"
                  }
                  className="
                    h-10
                    rounded-xl
                    border-[hsl(var(--border))]
                    bg-[hsl(var(--background-unit-2))]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------------ */
          /* POS WORKSPACE                                                        */
          /* ------------------------------------------------------------------ */}

          <section
            className="
              grid
              min-h-0
              min-w-0
              flex-1
              grid-cols-1
              gap-4
              overflow-hidden
              lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]
            "
          >
            {/* PRODUCT SELECTOR */}

            <div
              className="
                min-h-0
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-[hsl(var(--border))]
                bg-[hsl(var(--background-unit))]
              "
            >
              <ProductSelector
                setIsModalOpen={setIsModalOpen}
                setUpdateItem={setUpdateItem}
              />
            </div>

            {/* ORDER ITEMS */}

            <div
              className="
                min-h-0
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-[hsl(var(--border))]
                bg-[hsl(var(--background-unit))]
              "
            >
              <OrderItemsTable
                items={items}
                removeProduct={removeProduct}
                updateProduct={updateProduct}
              />
            </div>
          </section>
        </div>
      </main>

      {/* ====================================================================== */
      /* FOOTER                                                                  */
      /* ====================================================================== */}

      <footer className="shrink-0 border-t border-[hsl(var(--border))] bg-[hsl(var(--background-unit-2))]">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <ShoppingCart className="h-4 w-4" />

              <span>
                {items.length}{" "}
                {items.length === 1
                  ? "producto"
                  : "productos"}
              </span>
            </div>

            <div className="h-4 w-px bg-[hsl(var(--border))]" />

            <div>
              <span className="mr-2 text-xs text-[hsl(var(--muted-foreground))]">
                Total
              </span>

              <span className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isSaving}
              className="
                rounded-xl
                text-[hsl(var(--muted-foreground))]
                hover:bg-[hsl(var(--background-unit-3))]
                hover:text-[hsl(var(--foreground))]
              "
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleOrderSave}
              disabled={isSaving}
              className="
                rounded-xl
                bg-[hsl(var(--blue))]
                px-5
                text-white
                shadow-sm
                hover:bg-[hsl(var(--blue)/0.9)]
              "
            >
              {isSaving
                ? "Guardando..."
                : selectedOrder
                  ? "Actualizar pedido"
                  : "Crear pedido"}
            </Button>
          </div>
        </div>
      </footer>

      {/* ====================================================================== */
      /* ITEM MODAL                                                              */
      /* ====================================================================== */}

      {isModalOpen && (
        <ItemModal
          setModal={setIsModalOpen}
          setUpdateItem={setUpdateItem}
          updateItem={updateItem}
          setItems={setItems}
          items={items}
        />
      )}
    </div>
  );
}

export default OrderDetails;