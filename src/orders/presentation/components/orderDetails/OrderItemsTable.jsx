import { Trash2, ShoppingBag, Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchItemsProduct from "./SearchItemsProduct";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";

const OrderItemsTable = ({
  items,
  removeProduct,
  updateProduct,
  calculateSubTotal,
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <div
      className="
        lg:col-span-2
        rounded-xl
        shadow-md
        flex flex-col
        border
        bg-[hsl(var(--background-unit)/0.8)]
        border-[hsl(var(--border))]
        backdrop-blur-md
      "
    >
      {/* 🔍 Buscador de productos */}
      <div
        className="
          py-4 px-3 border-b
          border-[hsl(var(--border))]
        "
      >
        <h4
          className="
            text-base font-semibold mb-2
            flex items-center gap-2
            text-[hsl(var(--foreground))]
          "
        >
          <ShoppingBag
            className="w-5 h-5 text-[hsl(var(--green))]"
          />
          Agregar Producto
        </h4>

        <SearchItemsProduct
          tipo="producto"
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      </div>

      {/* 🧾 Tabla de productos */}
      <ScrollArea className="flex-1 max-h-[45vh]">
        <table className="min-w-full text-sm border-t border-[hsl(var(--border))]">
          <thead
            className="
              sticky top-0 text-xs
              bg-[hsl(var(--dashboard)/0.7)]
            "
          >
            <tr>
              {[
                "ID",
                "Producto",
                "Descripción",
                "Precio",
                "Cantidad",
                "Total",
                "Acción",
              ].map((h) => (
                <th
                  key={h}
                  className="
                    px-3 py-2 text-left
                    font-medium uppercase
                    text-[hsl(var(--foreground))]
                  "
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[hsl(var(--border))]">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="
                    text-center py-8 font-medium
                    bg-[hsl(var(--green)/0.25)]
                    text-[hsl(var(--green))]
                  "
                >
                  Agrega productos al carrito 🛒
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="
                    transition-colors
                    hover:bg-[hsl(var(--muted))]
                  "
                >
                  <td className="pl-3 py-2 truncate text-[hsl(var(--muted-foreground))]">
                    {item.id}
                  </td>

                  <td className="pl-3 py-2 font-medium truncate text-[hsl(var(--foreground))]">
                    {item.productName}
                  </td>

                  <td className="pl-3 py-2 truncate text-[hsl(var(--muted-foreground))]">
                    {item.description}
                  </td>

                  <td className="text-center text-[hsl(var(--foreground))]">
                    {formatCurrency(item.unitPrice)}
                  </td>

                  <td className="text-center font-semibold text-[hsl(var(--foreground))]">
                    {item.quantity}
                  </td>

                  <td className="text-center font-semibold text-[hsl(var(--order-table-total)/0.9)]">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>

                  <td className="flex items-center justify-center gap-2 py-2">
                    <button
                      onClick={() => updateProduct(item.id)}
                      className="
                        p-1.5 rounded-md transition
                        hover:bg-[hsl(var(--dashboard))]
                      "
                      title="Editar producto"
                    >
                      <Pencil
                        className="w-4 h-4 text-[hsl(var(--blue))]"
                      />
                    </button>

                    <button
                      onClick={() => removeProduct(item.id)}
                      className="
                        p-1.5 rounded-md transition
                        hover:bg-[hsl(var(--destructive)/0.2)]
                      "
                      title="Eliminar producto"
                    >
                      <Trash2
                        className="w-4 h-4 text-[hsl(var(--destructive))]"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ScrollArea>

      {/* 💰 Total */}
      <div
        className="
          p-4 border-t
          flex justify-between items-center
          bg-[hsl(var(--background-unit)/0.8)]
          border-[hsl(var(--border))]
          rounded-b-xl
        "
      >
        <span className="text-base font-semibold text-[hsl(var(--foreground))]">
          Total Neto
        </span>

        <span className="text-2xl font-bold text-[hsl(var(--order-table-total)/0.9)]">
          {formatCurrency(calculateSubTotal)}
        </span>
      </div>
    </div>
  );
};

export default OrderItemsTable;
