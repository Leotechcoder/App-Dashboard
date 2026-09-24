import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableFooter,
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
      {/* Contenedor con altura fija: header + body scrollean, footer siempre abajo */}
      <div className="flex flex-col h-[380px] border border-border rounded-lg overflow-hidden">
        
        {/* Área scrolleable: header sticky + filas */}
          <Table>
            <TableHeader className="bg-accent sticky top-0 z-1">
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

        {/* Footer: último hijo del flex-col → siempre al fondo del bloque */}
        <div className="shrink-0 bg-background border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

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
