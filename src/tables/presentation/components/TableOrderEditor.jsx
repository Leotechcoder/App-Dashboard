
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  CheckCircle2,
  Pencil,
  ReceiptText,
  ShoppingCart,
  Trash2,
  Utensils,
  X,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  createDataOrder,
  updateDataOrder,
} from "@/orders/application/orderSlice";

import { getData } from "@/orders/application/itemSlice";

import { setSelectedProduct } from "@/products/application/productSlice";

import { formatCurrency } from "@/shared/utils/formatPriceLocal";
import { idGenerator } from "@/shared/infrastructure/utils/idGenerator";

import ItemModal from "@/orders/presentation/components/orderDetails/ItemModal";
import ProductSelector from "@/orders/presentation/components/orderDetails/ProductSelector";

const STATUS_CONFIG = {
  occupied: {
    label: "Ocupada",
    dot: "bg-[hsl(var(--yellow))]",
    text: "text-[hsl(var(--yellow))]",
    background: "bg-[hsl(var(--yellow)/0.08)]",
    border: "border-[hsl(var(--yellow)/0.2)]",
  },

  "ready-to-pay": {
    label: "Lista para cobrar",
    dot: "bg-[hsl(var(--blue))]",
    text: "text-[hsl(var(--blue))]",
    background: "bg-[hsl(var(--blue)/0.08)]",
    border: "border-[hsl(var(--blue)/0.2)]",
  },

  available: {
    label: "Disponible",
    dot: "bg-[hsl(var(--green))]",
    text: "text-[hsl(var(--green))]",
    background: "bg-[hsl(var(--green)/0.08)]",
    border: "border-[hsl(var(--green)/0.2)]",
  },
};

function getTableStatus(order) {
  if (!order) return "available";

  if (order.status === "ready-to-pay") {
    return "ready-to-pay";
  }

  return "occupied";
}

function TableOrderEditor({ table, order, onClose, onSaved }) {
  const dispatch = useDispatch();

  const allItems = useSelector((state) => state.items.data);

  const { activeCashRegister } = useSelector((state) => state.sales);

  const [isSaving, setIsSaving] = useState(false);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const [updateItem, setUpdateItem] = useState(false);

  const originalItems = useMemo(
    () =>
      order
        ? allItems.filter((item) => item.orderId === order.id)
        : [],
    [allItems, order],
  );

  /*
   * Los items de la mesa son un borrador local.
   *
   * ProductSelector selecciona productos.
   * ItemModal agrega o edita items.
   * Este componente solamente mantiene el draft y lo persiste.
   */
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(
      originalItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: Number(item.quantity),
        description: item.description || "",
      })),
    );
  }, [originalItems]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.unitPrice) * Number(item.quantity),
        0,
      ),
    [items],
  );

  const totalItems = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
      ),
    [items],
  );

  const tableStatus = getTableStatus(order);

  const statusConfig =
    STATUS_CONFIG[tableStatus] || STATUS_CONFIG.available;

  /*
   * Abre ItemModal para editar un item existente.
   *
   * ItemModal trabaja con products.selectedProduct,
   * por eso le pasamos el item actual con su id.
   */
  const handleEditItem = (item) => {
    dispatch(
      setSelectedProduct({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        description: item.description || "",
        unitPrice: item.unitPrice,
        quantity: Number(item.quantity),
      }),
    );

    setUpdateItem(true);
    setIsItemModalOpen(true);
  };

  /*
   * Elimina el item completo del borrador.
   *
   * La cantidad se modifica desde ItemModal.
   */
  const handleRemoveItem = (itemId) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== itemId),
    );
  };

  /*
   * Adapter para actualizar una orden existente.
   *
   * El backend recibe los items completos.
   */
  const itemsForSync = () =>
    items.map((item) => ({
      ...(item.id ? { id: item.id } : {}),
      productId: item.productId,
      productName: item.productName,
      description: item.description || "",
      unitPrice: item.unitPrice,
      quantity: Number(item.quantity),
    }));

  /*
   * Adapter para crear una orden nueva.
   *
   * Los items todavía no existen en DB,
   * por eso generamos sus ids acá.
   */
  const itemsForCreate = () =>
    items.map((item) => ({
      id: item.id || idGenerator("Items"),
      productId: item.productId,
      productName: item.productName,
      description: item.description || "",
      unitPrice: item.unitPrice,
      quantity: Number(item.quantity),
    }));

  const handleSave = async ({ markReady = false } = {}) => {
    if (!items.length) {
      return false;
    }

    setIsSaving(true);

    try {
      if (!order) {
        await dispatch(
          createDataOrder({
            userId: `Mesa-${table.number}`,
            userName: `Mesa ${table.number}`,
            status: "pending",
            deliveryType: "table",
            tableId: table.id,
            source: "pos",
            items: itemsForCreate(),
            totalAmount: total,
          }),
        ).unwrap();
      } else {
        /*
         * Cuando se marca lista para cobrar,
         * solamente enviamos el nuevo status.
         *
         * Los items no deben viajar en este PATCH.
         */
        const data = markReady
          ? { status: "ready-to-pay" }
          : { items: itemsForSync() };

        await dispatch(
          updateDataOrder({
            id: order.id,
            data,
          }),
        ).unwrap();
      }

      /*
       * Actualizamos los items globales después de guardar.
       * El draft local sigue siendo la fuente durante la edición.
       */
      dispatch(getData());

      toast.success(
        markReady
          ? `Mesa ${table.number} lista para cobrar`
          : "Orden de la mesa guardada",
      );

      onSaved?.();

      return true;
    } catch (error) {
      toast.error(
        error?.message || "No se pudo guardar la orden",
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkReadyToPay = () => {
    if (!order || !items.length || isSaving) {
      return;
    }

    handleSave({
      markReady: true,
    });
  };

  const handleItemModalClose = () => {
    if (isSaving) return;

    setIsItemModalOpen(false);
    setUpdateItem(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[hsl(var(--dialog-overlay))] p-4">
        <div
          showCloseButton = {false}
          className="
            flex
            min-h-0
            h-[82vh]
            w-[calc(100%-1.5rem)]
            max-w-4xl
            flex-col
            gap-0
            overflow-hidden
            rounded-2xl
            border-[hsl(var(--border))]
            bg-[hsl(var(--background-unit-2))]
            p-0
          "
        >
          {/* ============================================================ */}
          {/* HEADER                                                       */}
          {/* ============================================================ */}

          <header
            className="
              flex
              shrink-0
              items-center
              justify-between
              gap-4
              border-b
              border-[hsl(var(--border))]
              px-5
              py-4
            "
          >
            <div className="flex min-w-0 items-center gap-3">
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
                <Utensils className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    className="
                      truncate
                      text-base
                      font-semibold
                      text-[hsl(var(--foreground))]
                    "
                  >
                    Mesa {table.number}
                  </h2>

                  <span
                    className={`
                      inline-flex
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium
                      ${statusConfig.background}
                      ${statusConfig.border}
                      ${statusConfig.text}
                    `}
                  >
                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${statusConfig.dot}
                      `}
                    />

                    {statusConfig.label}
                  </span>
                </div>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-[hsl(var(--muted-foreground))]
                  "
                >
                  {order
                    ? "Editá los productos de la orden"
                    : "Agregá productos para comenzar la orden"}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isSaving}
              className="
                shrink-0
                rounded-xl
                text-[hsl(var(--muted-foreground))]
                hover:bg-[hsl(var(--background-unit-3))]
                hover:text-[hsl(var(--foreground))]
              "
            >
              <X className="h-5 w-5" />
            </Button>
          </header>

          {/* ============================================================ */}
          {/* MAIN                                                         */}
          {/* ============================================================ */}

          <main
            className="
              min-h-0
              flex-1
              overflow-hidden
              p-4
              sm:p-5
            "
          >
            <section
              className="
                grid
                h-full
                min-h-0
                min-w-0
                grid-cols-1
                gap-4
                lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]
              "
            >
              {/* ======================================================== */}
              {/* PRODUCTS                                                  */}
              {/* ======================================================== */}

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
                  setIsModalOpen={setIsItemModalOpen}
                  setUpdateItem={setUpdateItem}
                />
              </div>

              {/* ======================================================== */}
              {/* ORDER DETAIL                                              */}
              {/* ======================================================== */}

              <div
                className="
                  flex
                  min-h-0
                  min-w-0
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[hsl(var(--border))]
                  bg-[hsl(var(--background-unit))]
                "
              >
                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    gap-3
                    border-b
                    border-[hsl(var(--border))]
                    px-4
                    py-3
                  "
                >
                  <div className="flex items-center gap-2">
                    <ReceiptText
                      className="
                        h-4
                        w-4
                        text-[hsl(var(--blue))]
                      "
                    />

                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-[hsl(var(--foreground))]
                      "
                    >
                      Detalle de la orden
                    </h3>
                  </div>

                  <span
                    className="
                      rounded-full
                      bg-[hsl(var(--background-unit-2))]
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium
                      text-[hsl(var(--muted-foreground))]
                    "
                  >
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "producto"
                      : "productos"}
                  </span>
                </div>

                <div
                  className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                    p-3
                  "
                >
                  {items.length === 0 ? (
                    <div
                      className="
                        flex
                        h-full
                        min-h-40
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-dashed
                        border-[hsl(var(--border))]
                        px-4
                        text-center
                      "
                    >
                      <div
                        className="
                          mb-3
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-[hsl(var(--background-unit-2))]
                          text-[hsl(var(--muted-foreground))]
                        "
                      >
                        <ReceiptText className="h-5 w-5" />
                      </div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-[hsl(var(--foreground))]
                        "
                      >
                        Aún no hay productos
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[hsl(var(--muted-foreground))]
                        "
                      >
                        Seleccioná un producto para
                        agregarlo a la mesa.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item) => {
                        const itemTotal =
                          Number(item.unitPrice) *
                          Number(item.quantity);

                        return (
                          <div
                            key={item.id || item.productId}
                            className="
                              group
                              rounded-xl
                              border
                              border-[hsl(var(--border))]
                              bg-[hsl(var(--background-unit-2))]
                              px-3
                              py-3
                              transition
                              hover:border-[hsl(var(--blue)/0.25)]
                            "
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-[hsl(var(--blue)/0.08)]
                                  text-xs
                                  font-semibold
                                  text-[hsl(var(--blue))]
                                "
                              >
                                {item.quantity}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditItem(item)
                                }
                                className="
                                  min-w-0
                                  flex-1
                                  text-left
                                "
                              >
                                <p
                                  className="
                                    truncate
                                    text-sm
                                    font-medium
                                    text-[hsl(var(--foreground))]
                                  "
                                >
                                  {item.productName}
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    truncate
                                    text-xs
                                    text-[hsl(var(--muted-foreground))]
                                  "
                                >
                                  {item.description
                                    ? item.description
                                    : `${formatCurrency(
                                        item.unitPrice,
                                      )} × ${
                                        item.quantity
                                      }`}
                                </p>
                              </button>

                              <div
                                className="
                                  flex
                                  shrink-0
                                  items-center
                                  gap-2
                                "
                              >
                                <span
                                  className="
                                    text-sm
                                    font-semibold
                                    text-[hsl(var(--foreground))]
                                  "
                                >
                                  {formatCurrency(itemTotal)}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditItem(item)
                                  }
                                  aria-label={`Editar ${item.productName}`}
                                  className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-[hsl(var(--muted-foreground))]
                                    opacity-70
                                    transition
                                    hover:bg-[hsl(var(--blue)/0.08)]
                                    hover:text-[hsl(var(--blue))]
                                    group-hover:opacity-100
                                  "
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveItem(item.id)
                                  }
                                  aria-label={`Quitar ${item.productName}`}
                                  className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-[hsl(var(--muted-foreground))]
                                    opacity-70
                                    transition
                                    hover:bg-[hsl(var(--salmon)/0.08)]
                                    hover:text-[hsl(var(--salmon))]
                                    group-hover:opacity-100
                                  "
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {item.description && (
                              <div
                                className="
                                  mt-2
                                  border-t
                                  border-[hsl(var(--border))]
                                  pt-2
                                "
                              >
                                <p
                                  className="
                                    text-xs
                                    text-[hsl(var(--muted-foreground))]
                                  "
                                >
                                  {item.description}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>

          {/* ============================================================ */}
          {/* TOTAL                                                        */}
          {/* ============================================================ */}

          <div
            className="
              shrink-0
              border-t
              border-[hsl(var(--border))]
              bg-[hsl(var(--background-unit-2))]
              px-5
              py-3
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div className="flex items-center gap-2">
                <ShoppingCart
                  className="
                    h-4
                    w-4
                    text-[hsl(var(--muted-foreground))]
                  "
                />

                <span
                  className="
                    text-sm
                    text-[hsl(var(--muted-foreground))]
                  "
                >
                  Total de la orden
                </span>
              </div>

              <span
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-[hsl(var(--foreground))]
                "
              >
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* FOOTER                                                       */}
          {/* ============================================================ */}

          <footer
            className="
              flex
              shrink-0
              flex-col
              gap-2
              border-t
              border-[hsl(var(--border))]
              bg-[hsl(var(--background-unit-2))]
              px-5
              py-3
              sm:flex-row
              sm:items-center
              sm:justify-end
            "
          >
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
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
              variant="outline"
              disabled={
                !order ||
                !items.length ||
                isSaving ||
                !activeCashRegister
              }
              onClick={handleMarkReadyToPay}
              className="
                rounded-xl
                border-[hsl(var(--border))]
                bg-transparent
                text-[hsl(var(--foreground))]
                hover:bg-[hsl(var(--background-unit-3))]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />

              Marcar lista para cobrar
            </Button>

            <Button
              type="button"
              disabled={
                !items.length ||
                isSaving ||
                !activeCashRegister
              }
              onClick={() => handleSave()}
              className="
                rounded-xl
                bg-[hsl(var(--blue))]
                px-5
                text-white
                shadow-sm
                hover:bg-[hsl(var(--blue)/0.9)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSaving
                ? "Guardando..."
                : "Guardar orden"}
            </Button>
          </footer>
        </div>
      </div>

      {/* ================================================================ */}
      {/* ITEM MODAL                                                       */}
      {/* ================================================================ */}

      {isItemModalOpen && (
        <ItemModal
          setModal={handleItemModalClose}
          setUpdateItem={setUpdateItem}
          updateItem={updateItem}
          setItems={setItems}
          items={items}
        />
      )}
    </>
  );
}

export { TableOrderEditor };
