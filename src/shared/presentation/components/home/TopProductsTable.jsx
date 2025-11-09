"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, ArrowUp, ArrowDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "@/orders/application/itemSlice";

const TopProductsTable = ({ orders }) => {
  const items = useSelector((store) => store.items.data || []);
  const [sortOrder, setSortOrder] = useState("desc");
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getData())
  }, [])
  
  // 🔹 Calculamos los productos más vendidos de todas las órdenes cerradas
  const topProductsOverall = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const closedOrderIds = orders.map((o) => o.id);
    const closedItems = items.filter((item) =>
      closedOrderIds.includes(item.orderId)
    );

    const aggregated = Object.values(
      closedItems.reduce((acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = { id: item.productId, name: item.productName, sales: 0 };
        }
        acc[item.productId].sales += Number(item.quantity) || 0;
        return acc;
      }, {})
    );

    return aggregated;
  }, [items, orders]);

  // 🔹 Ordenamos según el estado del botón (descendente o ascendente)
  const sortedProducts = useMemo(() => {
    return [...topProductsOverall].sort((a, b) =>
      sortOrder === "desc" ? b.sales - a.sales : a.sales - b.sales
    ).slice(0, 5); // Top 5
  }, [topProductsOverall, sortOrder]);

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-600 flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2 text-purple-500" />
          Productos Más Vendidos
        </h2>
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          {sortOrder === "desc" ? (
            <>
              <ArrowDown className="w-4 h-4 mr-1" />
              Mayor a menor
            </>
          ) : (
            <>
              <ArrowUp className="w-4 h-4 mr-1" />
              Menor a mayor
            </>
          )}
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ventas
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.sales}
              </td>
            </tr>
          ))}
          {sortedProducts.length === 0 && (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-400">
                No hay productos vendidos todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductsTable;
