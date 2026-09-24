import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ReceiptText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { voidSelectedProduct } from "@/products/application/productSlice";
import { idGenerator } from "@/shared/infrastructure/utils/idGenerator";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";

const formatPrice = (price) => {
  if (price == null) return 0;

  const cleaned = String(price)
    .replace("$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  return Number.parseFloat(cleaned) || 0;
};

const ItemModal = ({
  setModal,
  setUpdateItem,
  updateItem,
  setItems,
  items,
}) => {
  const dispatch = useDispatch();

  const selectedProduct = useSelector(
    (store) => store.products.selectedProduct
  );

  const [quantity, setQuantity] = useState(
    selectedProduct?.quantity || 1
  );

  const [description, setDescription] = useState(
    selectedProduct?.description || ""
  );

  const handleClose = () => {
    dispatch(voidSelectedProduct());

    setModal(false);
    setUpdateItem(false);
    setQuantity(1);
    setDescription("");
  };

  useEffect(() => {
    if (!selectedProduct) return;

    setQuantity(selectedProduct.quantity || 1);
    setDescription(selectedProduct.description || "");

    window.history.pushState({ modalOpen: true }, "");

    const handlePopState = () => handleClose();

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const unitPrice = formatPrice(selectedProduct.unitPrice);
  const total = unitPrice * Number(quantity);

  const handleQuantityChange = (value) => {
    setQuantity(Math.max(1, Number(value) || 1));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, Number(prev) - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Number(prev) + 1);
  };

  const handleSubmit = () => {
    const newItem = {
      id: updateItem
        ? selectedProduct.id
        : idGenerator("Items"),

      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      description,
      unitPrice: selectedProduct.unitPrice,
      quantity: Number(quantity),
    };

    if (updateItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === newItem.id ? newItem : item
        )
      );
    } else {
      setItems((prev) => [...prev, newItem]);
    }

    handleClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        className="
          absolute inset-0
          bg-[hsl(var(--dialog-overlay))]
          backdrop-blur-sm
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        key={selectedProduct.id}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{
          duration: 0.18,
          ease: "easeOut",
        }}
        className="
          relative z-10
          flex w-full max-w-lg flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[hsl(var(--border))]
          bg-[hsl(var(--background-unit-2))]
          text-[hsl(var(--foreground))]
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <header
          className="
            flex shrink-0 items-center justify-between
            border-b border-[hsl(var(--border))]
            bg-[hsl(var(--background-unit)/0.45)]
            px-5 py-4
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                bg-[hsl(var(--green)/0.12)]
                text-[hsl(var(--green))]
              "
            >
              <ShoppingBag className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                {updateItem
                  ? "Editar producto"
                  : "Nuevo producto"}
              </p>

              <h2 className="truncate text-base font-semibold">
                {selectedProduct.productName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-lg
              text-[hsl(var(--muted-foreground))]
              transition-colors
              hover:bg-[hsl(var(--muted))]
              hover:text-[hsl(var(--foreground))]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[hsl(var(--green))]
            "
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="space-y-5 px-5 py-5">
          {/* Product summary */}
          <div
            className="
              rounded-xl
              border
              border-[hsl(var(--border))]
              bg-[hsl(var(--background-unit)/0.65)]
              p-4
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  Producto
                </p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {selectedProduct.productName}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Precio unitario
                </p>

                <p className="mt-1 text-base font-semibold text-[hsl(var(--green))]">
                  {formatCurrency(unitPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="item-description"
              className="text-sm font-medium"
            >
              Descripción
              <span className="ml-1 text-xs font-normal text-[hsl(var(--muted-foreground))]">
                (opcional)
              </span>
            </label>

            <textarea
              id="item-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={3}
              placeholder="Ej. Sin cebolla, extra queso..."
              className="
                w-full resize-none
                rounded-xl
                border
                border-[hsl(var(--border))]
                bg-[hsl(var(--background))]
                px-3 py-2.5
                text-sm
                text-[hsl(var(--foreground))]
                outline-none
                placeholder:text-[hsl(var(--muted-foreground))]
                transition
                focus:border-[hsl(var(--green))]
                focus:ring-2
                focus:ring-[hsl(var(--green)/0.15)]
              "
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label
              htmlFor="item-quantity"
              className="text-sm font-medium"
            >
              Cantidad
            </label>

            <div className="flex items-center justify-between gap-4">
              <div
                className="
                  flex h-11 items-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-[hsl(var(--border))]
                  bg-[hsl(var(--background))]
                "
              >
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                  className="
                    flex h-full w-11 items-center justify-center
                    text-[hsl(var(--muted-foreground))]
                    transition-colors
                    hover:bg-[hsl(var(--muted))]
                    hover:text-[hsl(var(--foreground))]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <Minus className="h-4 w-4" />
                </button>

                <input
                  id="item-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) =>
                    handleQuantityChange(event.target.value)
                  }
                  className="
                    h-full w-14
                    border-x
                    border-[hsl(var(--border))]
                    bg-transparent
                    text-center
                    text-sm font-semibold
                    text-[hsl(var(--foreground))]
                    outline-none
                  "
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Aumentar cantidad"
                  className="
                    flex h-full w-11 items-center justify-center
                    text-[hsl(var(--muted-foreground))]
                    transition-colors
                    hover:bg-[hsl(var(--muted))]
                    hover:text-[hsl(var(--foreground))]
                  "
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Subtotal
                </p>

                <p className="mt-0.5 text-xl font-bold text-[hsl(var(--foreground))]">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="
            flex shrink-0 items-center justify-between gap-3
            border-t border-[hsl(var(--border))]
            bg-[hsl(var(--background-unit)/0.45)]
            px-5 py-4
          "
        >
          <div className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />

            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Total
              </p>

              <p className="text-sm font-semibold">
                {formatCurrency(total)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="
                rounded-xl
                border border-[hsl(var(--border))]
                px-4 py-2.5
                text-sm font-medium
                text-[hsl(var(--muted-foreground))]
                transition-colors
                hover:bg-[hsl(var(--muted))]
                hover:text-[hsl(var(--foreground))]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[hsl(var(--green))]
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="
                rounded-xl
                bg-[hsl(var(--green))]
                px-4 py-2.5
                text-sm font-semibold
                text-[hsl(var(--background))]
                shadow-sm
                transition-all
                hover:brightness-110
                active:scale-[0.98]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[hsl(var(--green))]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[hsl(var(--background-unit-2))]
              "
            >
              {updateItem
                ? "Actualizar producto"
                : "Agregar producto"}
            </button>
          </div>
        </footer>
      </motion.div>
    </div>,
    document.body
  );
};

export default ItemModal;