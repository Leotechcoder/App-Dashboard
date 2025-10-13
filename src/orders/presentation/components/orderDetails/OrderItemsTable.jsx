// OrderItemsTable.jsx
import { Trash2, RefreshCw } from "lucide-react";
import { formatPrice } from "../../../../shared/utils/formatPriceOrders";
import SearchItemsProduct from "./SearchItemsProduct";

const OrderItemsTable = ({
  items,
  removeProduct,
  updateProduct,
  calculateSubTotal,
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Items de Productos</h2>
        <h4 className="text-base font-medium ml-3 mb-2">Agregar Producto</h4>

        {/* 🔍 Buscador para agregar productos */}
        <SearchItemsProduct
          tipo={"producto"}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full table-fixed border-t border-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0 text-xs">
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

          <tbody className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 bg-green-100 text-green-700 font-semibold"
                >
                  Agrega productos al carrito 🛒
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="pl-2 h-10 truncate max-w-[32px]">{item.id}</td>
                  <td className="pl-2 h-10 truncate max-w-[70px]">
                    {item.productName}
                  </td>
                  <td className="pl-2 h-10 truncate max-w-[60px]">
                    {item.description}
                  </td>
                  <td className="w-18 h-10 text-center">
                    {formatPrice(item.unitPrice)}
                  </td>
                  <td className="w-20 h-10 text-center">{item.quantity}</td>
                  <td className="w-18 h-10 text-center">
                    {item.unitPrice * item.quantity}
                  </td>
                  <td className="w-30 h-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => removeProduct(item.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateProduct(item.id)}
                      className="text-gray-600 hover:text-blue-400"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-gray-200 bg-white flex justify-between">
        <span className="text-base font-semibold">Net Total</span>
        <span className="text-xl font-bold">
          ${calculateSubTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderItemsTable;
