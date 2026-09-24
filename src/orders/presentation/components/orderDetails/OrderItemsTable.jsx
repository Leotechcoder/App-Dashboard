import {
  Package,
  Pencil,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { formatCurrency } from "@/shared/utils/formatPriceLocal";

const OrderItemsTable = ({
  items,
  removeProduct,
  updateProduct,
  calculateSubTotal,
}) => {
  const totalItems = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  return (
    <section
      className="
        flex
        h-full
        min-h-0
        min-w-0
        flex-1
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-[hsl(var(--border))]
        bg-[hsl(var(--background-unit)/0.8)]
        backdrop-blur-md
      "
    >

      {/* =====================================================
          COLUMN HEADER
      ===================================================== */}

      <div
        className="
          hidden
          shrink-0
          grid-cols-[minmax(0,1fr)_80px_110px_72px]
          items-center
          gap-3
          border-b
          border-[hsl(var(--border))]
          bg-[hsl(var(--background-unit-2))]
          px-4
          py-2
          text-[10px]
          font-medium
          uppercase
          tracking-wide
          text-[hsl(var(--muted-foreground))]
          sm:grid
        "
      >
        <span>Producto</span>

        <span className="text-center">
          Cant.
        </span>

        <span className="text-right">
          Total
        </span>

        <span className="text-center">
          Acción
        </span>
      </div>

      {/* =====================================================
          ITEMS
      ===================================================== */}

      <ScrollArea
        className="
          min-h-0
          min-w-0
          flex-1
          overflow-hidden
        "
      >
        <div className="space-y-2 p-3">
          {items.length === 0 ? (
            <div
              className="
                flex
                min-h-56
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-[hsl(var(--border))]
                bg-[hsl(var(--background-unit-2))]
                px-6
                text-center
              "
            >
              <div
                className="
                  mb-3
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-full
                  bg-[hsl(var(--green)/0.08)]
                "
              >
                <ShoppingCart
                  className="
                    size-5
                    text-[hsl(var(--green))]
                  "
                />
              </div>

              <h4
                className="
                  text-sm
                  font-semibold
                  text-[hsl(var(--foreground))]
                "
              >
                La orden está vacía
              </h4>

              <p
                className="
                  mt-1
                  max-w-xs
                  text-xs
                  leading-relaxed
                  text-[hsl(var(--muted-foreground))]
                "
              >
                Buscá un producto en el panel de
                selección para agregarlo a la orden.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const quantity = Number(item.quantity || 0);
              const unitPrice = Number(item.unitPrice || 0);
              const itemTotal = unitPrice * quantity;

              return (
                <article
                  key={item.id}
                  className="
                    group
                    rounded-lg
                    border
                    border-[hsl(var(--border))]
                    bg-[hsl(var(--background-unit-2))]
                    p-3
                    transition-all
                    hover:border-[hsl(var(--blue)/0.35)]
                    hover:bg-[hsl(var(--blue)/0.025)]
                  "
                >
                  {/* =================================================
                      DESKTOP
                  ================================================= */}

                  <div
                    className="
                      hidden
                      grid-cols-[minmax(0,1fr)_80px_110px_72px]
                      items-center
                      gap-3
                      sm:grid
                    "
                  >
                    {/* Product */}

                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="
                          flex
                          size-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[hsl(var(--blue)/0.08)]
                        "
                      >
                        <Package
                          className="
                            size-4
                            text-[hsl(var(--blue))]
                          "
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <h4
                            className="
                              truncate
                              text-xs
                              font-semibold
                              text-[hsl(var(--foreground))]
                            "
                            title={item.productName}
                          >
                            {item.productName}
                          </h4>
                        </div>

                        {item.description ? (
                          <p
                            className="
                              mt-0.5
                              truncate
                              text-[10px]
                              text-[hsl(var(--muted-foreground))]
                            "
                            title={item.description}
                          >
                            {item.description}
                          </p>
                        ) : (
                          <p
                            className="
                              mt-0.5
                              text-[10px]
                              text-[hsl(var(--muted-foreground))]
                            "
                          >
                            {formatCurrency(unitPrice)}{" "}
                            por unidad
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity */}

                    <div className="flex justify-center">
                      <span
                        className="
                          inline-flex
                          min-w-10
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[hsl(var(--border))]
                          bg-[hsl(var(--background-unit))]
                          px-2
                          py-1.5
                          text-xs
                          font-semibold
                          text-[hsl(var(--foreground))]
                        "
                      >
                        ×{quantity}
                      </span>
                    </div>

                    {/* Total */}

                    <div className="text-right">
                      <span
                        className="
                          text-sm
                          font-semibold
                          text-[hsl(var(--green))]
                        "
                      >
                        {formatCurrency(itemTotal)}
                      </span>

                      <p
                        className="
                          mt-0.5
                          text-[9px]
                          text-[hsl(var(--muted-foreground))]
                        "
                      >
                        {formatCurrency(unitPrice)} c/u
                      </p>
                    </div>

                    {/* Actions */}

                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateProduct(item.id)
                        }
                        className="
                          flex
                          size-8
                          items-center
                          justify-center
                          rounded-md
                          text-[hsl(var(--blue))]
                          transition-colors
                          hover:bg-[hsl(var(--blue)/0.1)]
                        "
                        title="Editar producto"
                      >
                        <Pencil className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeProduct(item.id)
                        }
                        className="
                          flex
                          size-8
                          items-center
                          justify-center
                          rounded-md
                          text-[hsl(var(--destructive))]
                          transition-colors
                          hover:bg-[hsl(var(--destructive)/0.1)]
                        "
                        title="Eliminar producto"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* =================================================
                      MOBILE
                  ================================================= */}

                  <div className="flex gap-3 sm:hidden">
                    <div
                      className="
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[hsl(var(--blue)/0.08)]
                      "
                    >
                      <Package
                        className="
                          size-4
                          text-[hsl(var(--blue))]
                        "
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4
                            className="
                              truncate
                              text-xs
                              font-semibold
                              text-[hsl(var(--foreground))]
                            "
                          >
                            {item.productName}
                          </h4>

                          {item.description && (
                            <p
                              className="
                                mt-0.5
                                truncate
                                text-[10px]
                                text-[hsl(var(--muted-foreground))]
                              "
                            >
                              {item.description}
                            </p>
                          )}
                        </div>

                        <span
                          className="
                            shrink-0
                            text-sm
                            font-semibold
                            text-[hsl(var(--green))]
                          "
                        >
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="
                              rounded-md
                              border
                              border-[hsl(var(--border))]
                              bg-[hsl(var(--background-unit))]
                              px-2
                              py-1
                              text-[10px]
                              font-semibold
                            "
                          >
                            ×{quantity}
                          </span>

                          <span
                            className="
                              text-[10px]
                              text-[hsl(var(--muted-foreground))]
                            "
                          >
                            {formatCurrency(unitPrice)} c/u
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateProduct(item.id)
                            }
                            className="
                              flex
                              size-8
                              items-center
                              justify-center
                              rounded-md
                              text-[hsl(var(--blue))]
                              hover:bg-[hsl(var(--blue)/0.1)]
                            "
                            title="Editar producto"
                          >
                            <Pencil className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(item.id)
                            }
                            className="
                              flex
                              size-8
                              items-center
                              justify-center
                              rounded-md
                              text-[hsl(var(--destructive))]
                              hover:bg-[hsl(var(--destructive)/0.1)]
                            "
                            title="Eliminar producto"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* =====================================================
          TOTAL
      ===================================================== */}
{/* 
      <div
        className="
          shrink-0
          border-t
          border-[hsl(var(--border))]
          bg-[hsl(var(--background-unit-2)/0.9)]
          px-4
          py-3
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-[hsl(var(--muted-foreground))]
              "
            >
              Total neto
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                text-[hsl(var(--muted-foreground))]
              "
            >
              {totalItems}{" "}
              {totalItems === 1
                ? "unidad"
                : "unidades"}
            </p>
          </div>

          <span
            className="
              text-xl
              font-bold
              text-[hsl(var(--green))]
            "
          >
            {formatCurrency(calculateSubTotal)}
          </span>
        </div>
      </div> */}
    </section>
  );
};

export default OrderItemsTable;