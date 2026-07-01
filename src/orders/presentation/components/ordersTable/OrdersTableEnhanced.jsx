import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/shared/presentation/components/utils/Pagination";
import { getDataOrders } from "@/orders/application/orderSlice";
import { fetchActiveCashRegister, fetchPendingOrders } from "@/sales/application/salesThunks";

import OrderTableRow from "./OrderTableRow";
import CloseOrderDialog from "./CloseOrderDialog";
import { formatDate } from "./ordersTable.utils";

const TABLE_HEADERS = [
  "Estado", "Tiempo", "ID", "Origen", "Cliente",
  "Importe", "Tipo de entrega", "Dirección", "Actualización", "Acciones",
];

const OrdersTableEnhanced = ({
  data = [],
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  onCloseOrder,
  setSelectedOrder: parentSetSelectedOrder,
}) => {
  const dataItems = useSelector((state) => state.items.data);
  const dispatch = useDispatch();

  const [selectedOrderTable, setSelectedOrderTable] = useState(null);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const buildFullOrder = (order) => ({
    ...order,
    items: dataItems.filter((item) => item.orderId === order.id),
    createdAt: formatDate(order.createdAt),
    updatedAt: formatDate(order.updatedAt || new Date()),
  });

  const handleSelectTableOrder = (order) => {
    setSelectedOrderTable((prev) =>
      prev?.id === order.id ? null : buildFullOrder(order)
    );
  };

  const handleEditOrder = (order) => parentSetSelectedOrder?.(buildFullOrder(order));

  const handleOpenDialog = (order) => {
    setSelectedOrderModal(buildFullOrder(order));
    setIsDialogOpen(true);
  };

  const handleConfirmCloseOrder = async (orderId, paymentInfo) => {
    await onCloseOrder?.(orderId, paymentInfo);
    dispatch(fetchActiveCashRegister());
    dispatch(fetchPendingOrders());
    dispatch(getDataOrders());
    setSelectedOrderModal(null);
  };

  if (!data || data.length === 0) {
    return (
      <div className="orders-empty">
        <span className="orders-empty__icon">📋</span>
        <p>No hay órdenes para mostrar</p>
      </div>
    );
  }

  const newestOrderId = data[0]?.id;

  return (
    <>
      <div className="orders-table-container">
        <Table>
          <TableHeader className="orders-table-header">
            <TableRow>
              {TABLE_HEADERS.map((head) => (
                <TableHead key={head} className="text-xs whitespace-nowrap">
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                isSelected={selectedOrderTable?.id === order.id}
                isNewest={order.id === newestOrderId}
                onSelect={handleSelectTableOrder}
                onEdit={handleEditOrder}
                onDelete={onDelete}
                onOpenCloseDialog={handleOpenDialog}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <CloseOrderDialog
        order={selectedOrderModal}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmCloseOrder}
      />
    </>
  );
};

export default OrdersTableEnhanced;
