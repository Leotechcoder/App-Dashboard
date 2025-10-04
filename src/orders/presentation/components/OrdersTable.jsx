import { useEffect, useCallback, useMemo } from "react";
import { Pencil, Trash2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import {
  deleteDataOrder,
  getDataOrders,
  setFilteredOrders,
  setCurrentPageOrders,
} from "../../application/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../shared/presentation/components/Pagination.jsx";
import { useTableData } from "../../../shared/hook/useTableDataO.js";

const OrdersTable = ({ setSelectedOrder, activeTab }) => {
  const dispatch = useDispatch();
  const { data, isLoading, error, paginationOrders } = useSelector((store) => store.orders);
  const dataItems = useSelector((store) => store.items.data);

  const { currentPage, paginatedData, totalPages, handlePageChange } = useTableData({
    stateKey: "orders",
    itemsPerPage: paginationOrders.itemsPerPage,
    searchFields: ["id"],
    setFilteredData: setFilteredOrders,
    setCurrentPage: setCurrentPageOrders,
    initialData: data,
  });

  const formatDate = (date) =>
    new Date(date).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleOrderSelect = useCallback(
    (order) => {
      setSelectedOrder({
        user_id: order.userId,
        user_name: order.userName,
        status: order.status,
        items: dataItems.filter((item) => item.order_id === order.id),
        createdAt: formatDate(order.createdAt),
        updateAt: formatDate(new Date()),
      });
    },
    [setSelectedOrder, dataItems]
  );

  const handleDeleteOrder = useCallback(
    (id) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
        dispatch(deleteDataOrder(id));
      }
    },
    [dispatch]
  );

  const filteredOrders = useMemo(() => {
    if (!activeTab) return paginatedData;
    return paginatedData.filter((order) => order.status === activeTab);
  }, [paginatedData, activeTab]);

  const newestOrderId = paginatedData[0]?.id; // Primera orden de la página

  if (isLoading) return <div className="text-center py-4 text-gray-600">Cargando...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "ID de Usuario", "Cliente", "Importe", "Estado", "Última actualización", "Acciones"].map((head) => (
                <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={order.id === newestOrderId ? { backgroundColor: "#bbf7d0" } : { backgroundColor: "#ffffff" }}
                  animate={{ backgroundColor: "#ffffff" }}
                  transition={{ duration: 1.5 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[8rem]">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[8rem] overflow-hidden">{order.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[9rem] overflow-hidden">{order.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-10">${order.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-10">{order.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(order.updateAt || order.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleOrderSelect(order)} className="text-gray-600 hover:text-blue-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteOrder(order.id)} className="text-gray-600 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => dispatch(getDataOrders())} className="text-gray-600 hover:text-green-600">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No hay órdenes para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
};

export default OrdersTable;
