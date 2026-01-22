import { useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import {
  Pencil,
  Trash2,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Smartphone,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import PaginationOrders from "./PaginationOrders"
import { getDataOrders } from "@/orders/application/orderSlice"
import {
  fetchActiveCashRegister,
  fetchPendingOrders,
} from "@/sales/application/salesThunks"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

const paymentOptions = [
  { key: "efectivo", label: "Efectivo", icon: DollarSign },
  { key: "credito", label: "Crédito", icon: CreditCard },
  { key: "debito", label: "Débito", icon: Smartphone },
  { key: "transferencia", label: "Transferencia", icon: Smartphone },
]

const OrdersTableEnhanced = ({
  data = [],
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  onCloseOrder,
  setSelectedOrder: parentSetSelectedOrder,
}) => {
  const dataItems = useSelector((state) => state.items.data)
  const dispatch = useDispatch()

  const [selectedOrderTable, setSelectedOrderTable] = useState(null)
  const [selectedOrderModal, setSelectedOrderModal] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [payments, setPayments] = useState({})
  const [amounts, setAmounts] = useState({})
  const [warning, setWarning] = useState(false)

  const formatDate = (date) =>
    new Date(date).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

  // ===== Selección de fila
  const handleSelectTableOrder = (order) => {
    if (selectedOrderTable?.id === order.id) {
      setSelectedOrderTable(null)
      return
    }

    const fullOrder = {
      ...order,
      items: dataItems.filter((item) => item.orderId === order.id),
      createdAt: formatDate(order.createdAt),
      updatedAt: formatDate(order.updatedAt || new Date()),
    }

    setSelectedOrderTable(fullOrder)
  }

  // ===== Editar orden
  const handleEditOrder = (order) => {
    const fullOrder = {
      ...order,
      items: dataItems.filter((item) => item.orderId === order.id),
      createdAt: formatDate(order.createdAt),
      updatedAt: formatDate(order.updatedAt || new Date()),
    }

    parentSetSelectedOrder?.(fullOrder)
  }

  // ===== Abrir modal cierre
  const handleOpenDialog = (order) => {
    const fullOrder = {
      ...order,
      items: dataItems.filter((item) => item.orderId === order.id),
      createdAt: formatDate(order.createdAt),
      updatedAt: formatDate(order.updatedAt || new Date()),
    }

    setSelectedOrderModal(fullOrder)
    setPayments({})
    setAmounts({})
    setWarning(false)
    setIsDialogOpen(true)
  }

  const handleCheckboxChange = (method) => {
    setPayments((prev) => ({ ...prev, [method]: !prev[method] }))
    if (!payments[method]) {
      setAmounts((prev) => ({ ...prev, [method]: 0 }))
    }
  }

  const handleAmountChange = (method, value) => {
    const numericValue = parseFloat(value)
    setAmounts((prev) => ({
      ...prev,
      [method]: isNaN(numericValue) ? 0 : numericValue,
    }))
  }

  // ===== Total ingresado
  const totalEntered = useMemo(() => {
    return Object.keys(payments)
      .filter((m) => payments[m])
      .reduce((sum, key) => sum + (parseFloat(amounts[key]) || 0), 0)
  }, [payments, amounts])

  // ===== Comparación con tolerancia decimal
  const totalsMatch = useMemo(() => {
    const expected = Number(selectedOrderModal?.totalAmount || 0)
    const entered = Number(totalEntered || 0)
    return Math.abs(expected - entered) < 0.01
  }, [totalEntered, selectedOrderModal])

  const handleConfirmCloseOrder = async () => {
    if (!selectedOrderModal) return

    if (!totalsMatch) {
      setWarning(true)
      return
    }

    const paymentInfo = {
      methods: Object.keys(payments).filter((m) => payments[m]),
      amounts,
    }

    await onCloseOrder?.(selectedOrderModal.id, paymentInfo)

    dispatch(fetchActiveCashRegister())
    dispatch(fetchPendingOrders())
    dispatch(getDataOrders())

    setIsDialogOpen(false)
    setSelectedOrderModal(null)
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center font-mono font-bold text-[hsl(var(--muted-foreground))]">
        No hay órdenes 🤔
      </div>
    )
  }

  const newestOrderId = data[0]?.id

  return (
    <>
      <div className="overflow-x-auto rounded-lg bg-[hsl(var(--background-unit))] shadow scale-95">
        <Table>
        <TableHeader className="bg-[hsl(var(--dashboard))]">
            <TableRow>
              {[
                "ID",
                "ID Usuario",
                "Cliente",
                "Importe",
                // "Estado",
                "Tipo de entrega",
                "Dirección de entrega",
                "Última actualización",
                "Acciones",
              ].map((head) => (
                <TableHead key={head}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((order) => {
              const isSelected = selectedOrderTable?.id === order.id

              return (
                <motion.tr
                  key={order.id}
                  initial={
                    order.id === newestOrderId
                      ? { backgroundColor: "hsl(var(--green))" }
                      : { backgroundColor: "hsl(var(--background-unit))" }
                  }
                  animate={{
                    backgroundColor: isSelected
                      ? "hsl(var(--yellow)/0.45)"
                      : "hsl(var(--background-unit))",
                  }}
                  transition={{ duration: 0.4 }}
                  className={`cursor-pointer hover:bg-[hsl(var(--stroke))]
                   ${isSelected ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"}`}
                  onClick={() => handleSelectTableOrder(order)}
                >
                  <TableCell className="w-16 px-3 py-4 text-sm font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell className="w-32 px-2 py-4 text-sm">
                    {order.userId}
                  </TableCell>
                  <TableCell className="w-32 px-2 py-4 text-sm">
                    {order.userName}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm text-[hsl(var(--green))] font-bold">
                    ${formatCurrency(order.totalAmount)}
                  </TableCell>
                  {/* <TableCell className="px-3 py-4 text-sm">
                    {order.status}
                  </TableCell> */}
                  <TableCell className="px-3 py-4 text-sm text-center">
                    {order.deliveryType}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm text-center">
                    {order.deliveryAddress || "-"}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm">
                    {formatDate(order.updatedAt || order.createdAt)}
                  </TableCell>
                  <TableCell className="px-1 py-2 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-[hsl(var(--primary))] hover:cursor-pointer hover:bg-[hsl(var(--dashboard))] p-1 rounded"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDelete?.(order.id)}
                        className="text-[hsl(var(--destructive))] hover:cursor-pointer hover:bg-[hsl(var(--stroke))] p-1 rounded"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleOpenDialog(order)}
                        className="flex items-center gap-1 text-[hsl(var(--green))] hover:cursor-pointer hover:bg-[hsl(var(--dashboard))] p-1 rounded"
                        title="Cerrar"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Cerrar
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <PaginationOrders
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {/* Dialog cierre de orden */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cerrar Orden</DialogTitle>
            <DialogDescription>
              Selecciona los métodos de pago para cerrar la orden{" "}
              {selectedOrderModal?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrderModal && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--orders-muted))]">
                    Cliente:
                  </span>
                  <span className="font-medium">
                    {selectedOrderModal.userName}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--orders-muted))]">
                    Total:
                  </span>
                  <span className="text-lg font-bold">
                    ${formatCurrency(selectedOrderModal.totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Total ingresado:</span>
                  <span
                    className={
                      totalsMatch
                        ? "font-bold text-[hsl(var(--orders-success))]"
                        : "font-bold text-[hsl(var(--orders-danger))]"
                    }
                  >
                    ${formatCurrency(totalEntered)}
                  </span>
                </div>

                {!totalsMatch && warning && (
                  <p className="text-xs text-[hsl(var(--orders-danger))]">
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
                          onCheckedChange={() =>
                            handleCheckboxChange(key)
                          }
                        />
                        <Label
                          htmlFor={key}
                          className="flex cursor-pointer items-center gap-2"
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
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmCloseOrder}
              disabled={!totalsMatch}
            >
              Confirmar Cierre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OrdersTableEnhanced
