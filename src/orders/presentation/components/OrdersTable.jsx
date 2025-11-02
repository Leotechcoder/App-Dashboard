"use client";

import { Pencil, Trash2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import PaginationOrders from "./PaginationOrders";
import { useSelector } from "react-redux";

const OrdersTable = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  setSelectedOrder,
  activeTab,
  handleDeleteOrder,
}) => {

  //Obtengo los items del store para mostrarlos en el detalle de la orden
  const dataItems = useSelector((state) => state.items.data);


  const formatDate = (date) =>
    new Date(date).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleOrderSelect = (order) => {
    setSelectedOrder({
      id: order.id,
      userId: order.userId,
      userName: order.userName,
      status: order.status,
      items: dataItems.filter((item) => item.orderId === order.id),
      deliveryType: order.deliveryType,
      createdAt: formatDate(order.createdAt),
      updateAt: formatDate(new Date()),
    });
  };

  const filteredOrders = data;

  const newestOrderId = data[0]?.id;

  if (!data || data.length === 0)
    return (
      <div className="bg-white rounded-lg shadow overflow-x-auto scale-90">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "ID de Usuario",
                "Cliente",
                "Importe",
                "Estado",
                "Última actualización",
                "Acciones",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="py-8 text-center text-gray-500">
                No hay órdenes registradas.
                <br />
                <span className="text-sm text-gray-400">
                  Cargá una nueva orden para empezar.
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto scale-90">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "ID de Usuario",
                "Cliente",
                "Importe",
                "Estado",
                "Última actualización",
                "Acciones",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <motion.tr
                key={order.id}
                initial={
                  order.id === newestOrderId
                    ? { backgroundColor: "#bbf7d0" }
                    : { backgroundColor: "#ffffff" }
                }
                animate={{ backgroundColor: "#ffffff" }}
                transition={{ duration: 1.5 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[8rem]">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[8rem] overflow-hidden">
                  {order.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[9rem] overflow-hidden">
                  {order.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-10">
                  ${order.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-10">
                  {order.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(order.updatedAt || order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleOrderSelect(order)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-green-600">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationOrders
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default OrdersTable;
