
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Smartphone,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import PaginationOrders from "./PaginationOrders";
import { getDataOrders } from "@/orders/application/orderSlice";
import { fetchActiveCashRegister, fetchPendingOrders } from "@/sales/application/salesThunks";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";

const paymentOptions = [
  { key: "efectivo", label: "Efectivo", icon: DollarSign },
  { key: "credito", label: "Crédito", icon: CreditCard },
  { key: "debito", label: "Débito", icon: Smartphone },
  { key: "transferencia", label: "Transferencia", icon: Smartphone },
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

  const [selectedOrderTable, setSelectedOrderTable] = useState(null);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [payments, setPayments] = useState({});
  const [amounts, setAmounts] = useState({});
  const [warning, setWarning] = useState(false);

  const dispatch = useDispatch();

  const formatDate = (date) =>
    new Date(date).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ===== Selección de fila (solo resaltar)
  const handleSelectTableOrder = (order) => {
    if (selectedOrderTable?.id === order.id) {
      setSelectedOrderTable(null);
      return;
    }
    const fullOrder = {
      ...order,
      items: dataItems.filter((item) => item.orderId === order.id),
      createdAt: formatDate(order.createdAt),
      updatedAt: formatDate(order.updatedAt || new Date()),
    };
    setSelectedOrderTable(fullOrder);
  };

  // ===== Abrir OrderDetails (click lápiz)
  const handleEditOrder = (order) => {
    const fullOrder = {
      ...order,
      items: dataItems.filter((item) => item.orderId === order.id),
      createdAt: formatDate(order.createdAt),
      updatedAt: formatDate(order.updatedAt || new Date()),
    };
    parentSetSelectedOrder?.(fullOrder);
  };

  // ===== Abrir modal de cierre de orden
  const handleOpenDialog = (order) => {
    const fullOrder = {
      ...order,
      items: dataItems.filter((item) => item.orderId === order.id),
      createdAt: formatDate(order.createdAt),
      updatedAt: formatDate(order.updatedAt || new Date()),
    };
    setSelectedOrderModal(fullOrder);
    setPayments({});
    setAmounts({});
    setIsDialogOpen(true);
  };

  const handleCheckboxChange = (method) => {
    setPayments((prev) => ({ ...prev, [method]: !prev[method] }));
    if (!payments[method]) setAmounts((prev) => ({ ...prev, [method]: 0 }));
  };

  const handleAmountChange = (method, value) => {
    const numericValue = parseFloat(value);
    setAmounts((prev) => ({
      ...prev,
      [method]: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  // ===== Total ingresado
  const totalEntered = useMemo(() => {
    return Object.keys(payments)
      .filter((m) => payments[m])
      .reduce((sum, key) => sum + (parseFloat(amounts[key]) || 0), 0);
  }, [payments, amounts]);

  // ===== Comparación segura con tolerancia de decimales
  const totalsMatch = useMemo(() => {
    const expected = Number(selectedOrderModal?.totalAmount || 0);
    const entered = Number(totalEntered || 0);
    return Math.abs(expected - entered) < 0.01; // margen de error decimal
  }, [totalEntered, selectedOrderModal]);

  //Confirmar cierre de orden (modal)
  const handleConfirmCloseOrder = async () => {
    if (!selectedOrderModal) return;
    if (!totalsMatch) {
      setWarning(true);
      return;
    }

    const paymentInfo = {
      methods: Object.keys(payments).filter((m) => payments[m]),
      amounts,
    };

    await onCloseOrder?.(selectedOrderModal.id, paymentInfo);
    dispatch(fetchActiveCashRegister());
    dispatch(fetchPendingOrders());
    dispatch(getDataOrders());
    setIsDialogOpen(false);
    setSelectedOrderModal(null);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center font-mono font-bold py-12 text-muted-foreground">
        No hay órdenes 🤔
      </div>
    );
  }

  const newestOrderId = data[0]?.id;

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto scale-95">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "ID",
                "ID de Usuario",
                "Cliente",
                "Importe",
                "Estado",
                "Última actualización",
                "Acciones",
              ].map((head) => (
                <TableHead key={head}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => {
              const isSelected = selectedOrderTable?.id === order.id;
              return (
                <motion.tr
                  key={order.id}
                  initial={
                    order.id === newestOrderId
                      ? { backgroundColor: "#bbf7d0" }
                      : { backgroundColor: "#ffffff" }
                  }
                  animate={{
                    backgroundColor: isSelected ? "#fde68a" : "#ffffff",
                  }}
                  transition={{ duration: 0.5 }}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectTableOrder(order)}
                >
                  <TableCell className="w-16 px-3 py-4 text-sm font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell className="w-32 px-2 py-4 text-sm overflow-hidden">
                    {order.userId}
                  </TableCell>
                  <TableCell className="w-32 px-2 py-4 text-sm overflow-hidden">
                    {order.userName}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm">
                    ${formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm">
                    {order.status}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm">
                    {formatDate(order.updatedAt || order.createdAt)}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-gray-600 hover:text-blue-600"
                        title="Editar Orden"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(order.id)}
                        className="text-gray-600 hover:text-red-600"
                        title="Eliminar Orden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDialog(order)}
                        className="text-gray-600 hover:text-green-600 flex items-center gap-1"
                        title="Cerrar Orden"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Cerrar
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PaginationOrders
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {/* 🧾 Dialog para cierre de orden */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cerrar Orden</DialogTitle>
            <DialogDescription>
              Selecciona los métodos de pago y sus montos para cerrar la orden{" "}
              {selectedOrderModal?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrderModal && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-medium">
                    {selectedOrderModal.userName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg">
                    ${formatCurrency(selectedOrderModal.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Total ingresado:</span>
                  <span
                    className={
                      totalsMatch
                        ? "text-green-600 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    ${formatCurrency(totalEntered)}
                  </span>
                </div>
                {!totalsMatch && warning && (
                  <p className="text-red-500 text-xs">
                    El total ingresado no coincide con el total de la orden
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Métodos de Pago</Label>
                <div className="space-y-2">
                  {paymentOptions.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={key}
                          checked={payments[key] || false}
                          onCheckedChange={() => handleCheckboxChange(key)}
                        />
                        <Label
                          htmlFor={key}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Label>
                      </div>
                      {payments[key] && (
                        <Input
                          type="number"
                          placeholder="Monto"
                          value={amounts[key] || ""}
                          onChange={(e) =>
                            handleAmountChange(key, e.target.value)
                          }
                          className="w-28"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmCloseOrder} disabled={!totalsMatch}>
              Confirmar Cierre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersTableEnhanced;
