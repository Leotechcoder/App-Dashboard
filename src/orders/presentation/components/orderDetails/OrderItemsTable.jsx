"use client";

import { Trash2, RefreshCw, ShoppingBag } from "lucide-react";
import { formatPrice } from "../../../../shared/utils/formatPriceOrders";
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
    <div className="lg:col-span-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md flex flex-col border border-gray-200">
      {/* 🔍 Buscador de productos */}
      <div className="py-4 px-3 border-b border-gray-100">
        <h4 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-500" />
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
        <table className="min-w-full text-sm border-t border-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 text-xs">
            <tr>
              <th className="w-16 px-3 py-2 text-left font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="w-44 px-3 py-2 text-left font-medium text-gray-500 uppercase">
                Producto
              </th>
              <th className="w-44 px-3 py-2 text-left font-medium text-gray-500 uppercase">
                Descripción
              </th>
              <th className="w-16 px-3 py-2 text-center font-medium text-gray-500 uppercase">
                Precio
              </th>
              <th className="w-16 px-3 py-2 text-center font-medium text-gray-500 uppercase">
                Cantidad
              </th>
              <th className="w-16 px-3 py-2 text-center font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="w-24 px-3 py-2 text-center font-medium text-gray-500 uppercase">
                Acción
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 bg-emerald-50 text-emerald-700 font-medium rounded-b-lg"
                >
                  Agrega productos al carrito 🛒
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-emerald-50/50 transition-colors duration-150"
                >
                  <td className="pl-3 py-2 text-gray-700 truncate max-w-[32px]">
                    {item.id}
                  </td>
                  <td className="pl-3 py-2 font-medium text-gray-900 truncate max-w-[70px]">
                    {item.productName}
                  </td>
                  <td className="pl-3 py-2 text-gray-600 truncate max-w-[60px]">
                    {item.description}
                  </td>
                  <td className="text-center text-gray-800">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="text-center text-gray-700 font-semibold">
                    {item.quantity}
                  </td>
                  <td className="text-center font-semibold text-emerald-600">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                  <td className="flex items-center justify-center gap-2 py-2">
                    <button
                      onClick={() => removeProduct(item.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 transition"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </button>
                    <button
                      onClick={() => updateProduct(item.id)}
                      className="p-1.5 rounded-md hover:bg-blue-50 transition"
                      title="Actualizar producto"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-600 hover:text-blue-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ScrollArea>

      {/* 💰 Total */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50 flex justify-between items-center rounded-b-xl">
        <span className="text-base font-semibold text-gray-800">
          Total Neto
        </span>
        <span className="text-2xl font-bold text-emerald-600">
          ${formatCurrency(calculateSubTotal)}
        </span>
      </div>
    </div>
  );
};

export default OrderItemsTable;
