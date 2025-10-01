import { useEffect, useCallback, useMemo } from "react";
import { Pencil, Trash2, RefreshCw } from "lucide-react";
import {
  deleteDataOrder,
  getDataOrders,
  setFilteredOrders,
  setCurrentPageOrders,
} from "../../application/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../shared/presentation/components/Pagination.jsx";
import { useTableData } from "../../../shared/hook/useTableData.js";

const OrdersTable = ({ setSelectedOrder, activeTab }) => {
  const dispatch = useDispatch();
  const { data, isLoading, error, paginationOrders } = useSelector(
    (store) => store.orders
  );
  const dataItems = useSelector((store) => store.items.data);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    paginatedData,
    totalPages,
    handlePageChange,
  } = useTableData({
    stateKey: "orders",
    itemsPerPage: paginationOrders.itemsPerPage,
    searchFields: ["id"],
    setFilteredData: setFilteredOrders,
    setCurrentPage: setCurrentPageOrders,
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(getDataOrders());
    }
  }, [dispatch, data]);

  //Funcion para actualizar orden
  const handleOrderSelect = useCallback(
    (order) => {
      const newOrder = {
        user_id: order.userId,
        user_name: order.userName,
        status: order.status,
        items: dataItems.filter((item) => item.order_id === order.id),
      };
      setSelectedOrder(newOrder);
    },
    [setSelectedOrder, dataItems]
  );

  const handleDeleteOrder = useCallback(
    async (id) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
        dispatch(deleteDataOrder(id));
      }
    },
    [dispatch]
  );

  // 👇 Filtramos las órdenes según el activeTab
  const filteredOrders = useMemo(() => {
    if (!activeTab) return paginatedData;
    return paginatedData.filter((order) => order.status === activeTab);
  }, [paginatedData, activeTab]);

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID de Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Importe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ultima actualizacion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900  max-w-[8rem]">
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
                    {new Date(order.createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No hay órdenes para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default OrdersTable;
