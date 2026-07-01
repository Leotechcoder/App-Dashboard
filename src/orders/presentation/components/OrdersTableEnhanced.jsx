import { useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import {
  Pencil, Trash2, CheckCircle2,
  DollarSign, CreditCard, Smartphone,
  Monitor, MessageCircle, LayoutGrid,
} from "lucide-react"

import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import PaginationOrders from "./PaginationOrders"
import { getDataOrders } from "@/orders/application/orderSlice"
import { fetchActiveCashRegister, fetchPendingOrders } from "@/sales/application/salesThunks"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"
import { getMinutesAgo, getAgeColor, formatMinutesAgo } from "@/shared/utils/formatDateToArg"
import { getOrderSource } from "../pages/OrdersPage"

// ── Semáforo ──────────────────────────────────────────────────────────────────
// Usamos clases de Tailwind semánticas directamente — sin hsl(var()) inline
const AGE_STYLES = {
  green: {
    dot:   "bg-green",
    badge: "bg-green/15 text-green border-green/30",
    label: "Verde",
  },
  yellow: {
    dot:   "bg-yellow",
    badge: "bg-yellow/15 text-yellow border-yellow/30",
    label: "Demorada",
  },
  destructive: {
    dot:   "bg-destructive",
    badge: "bg-destructive/12 text-destructive border-destructive/30",
    label: "Urgente",
  },
}

// ── Source badge ──────────────────────────────────────────────────────────────
const SOURCE_ICON_MAP = {
  pos:      Monitor,
  app:      Smartphone,
  whatsapp: MessageCircle,
  other:    LayoutGrid,
}

const SourceBadge = ({ userId }) => {
  const source = getOrderSource(userId)
  const Icon   = SOURCE_ICON_MAP[source.key] || LayoutGrid

  return (
    <span className={`source-badge source-badge--${source.key}`} title={source.description}>
      <Icon size={11} />
      {source.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
const paymentOptions = [
  { key: "efectivo",      label: "Efectivo",     icon: DollarSign },
  { key: "credito",       label: "Crédito",       icon: CreditCard },
  { key: "debito",        label: "Débito",        icon: Smartphone },
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
  const dispatch  = useDispatch()

  const [selectedOrderTable, setSelectedOrderTable] = useState(null)
  const [selectedOrderModal, setSelectedOrderModal] = useState(null)
  const [isDialogOpen, setIsDialogOpen]             = useState(false)
  const [payments, setPayments]                     = useState({})
  const [amounts,  setAmounts]                      = useState({})
  const [warning,  setWarning]                      = useState(false)

  const formatDate = (date) =>
    new Date(date).toLocaleString("es-AR", {
      day: "2-digit", month: "2-digit", year: "2-digit",
      hour: "2-digit", minute: "2-digit",
    })

  const buildFullOrder = (order) => ({
    ...order,
    items:     dataItems.filter((item) => item.orderId === order.id),
    createdAt: formatDate(order.createdAt),
    updatedAt: formatDate(order.updatedAt || new Date()),
  })

  const handleSelectTableOrder = (order) => {
    setSelectedOrderTable((prev) => prev?.id === order.id ? null : buildFullOrder(order))
  }

  const handleEditOrder = (order) => parentSetSelectedOrder?.(buildFullOrder(order))

  const handleOpenDialog = (order) => {
    setSelectedOrderModal(buildFullOrder(order))
    setPayments({})
    setAmounts({})
    setWarning(false)
    setIsDialogOpen(true)
  }

  const handleCheckboxChange = (method) => {
    setPayments((prev) => ({ ...prev, [method]: !prev[method] }))
    if (!payments[method]) setAmounts((prev) => ({ ...prev, [method]: 0 }))
  }

  const handleAmountChange = (method, value) => {
    const n = parseFloat(value)
    setAmounts((prev) => ({ ...prev, [method]: isNaN(n) ? 0 : n }))
  }

  const totalEntered = useMemo(() =>
    Object.keys(payments)
      .filter((m) => payments[m])
      .reduce((sum, key) => sum + (parseFloat(amounts[key]) || 0), 0),
  [payments, amounts])

  const totalsMatch = useMemo(() => {
    const expected = Number(selectedOrderModal?.totalAmount || 0)
    return Math.abs(expected - totalEntered) < 0.01
  }, [totalEntered, selectedOrderModal])

  const handleConfirmCloseOrder = async () => {
    if (!selectedOrderModal || !totalsMatch) { setWarning(true); return }
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
      <div className="orders-empty">
        <span className="orders-empty__icon">📋</span>
        <p>No hay órdenes para mostrar</p>
      </div>
    )
  }

  const newestOrderId = data[0]?.id

  return (
    <>
      <div className="orders-table-container">
        <Table>
          <TableHeader className="orders-table-header">
            <TableRow>
              {[
                "Estado", "Tiempo", "ID", "Origen", "Cliente",
                "Importe", "Tipo de entrega", "Dirección", "Actualización", "Acciones",
              ].map((head) => (
                <TableHead key={head} className="text-xs whitespace-nowrap">
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((order) => {
              const isSelected = selectedOrderTable?.id === order.id
              const minutes    = getMinutesAgo(order.createdAt)
              const colorKey   = getAgeColor(minutes)
              const ageStyle   = AGE_STYLES[colorKey]

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
                      ? "hsl(var(--yellow) / 0.45)"
                      : "hsl(var(--background-unit))",
                  }}
                  transition={{ duration: 0.4 }}
                  className={`orders-table-row cursor-pointer ${isSelected ? "orders-table-row--selected" : ""}`}
                  onClick={() => handleSelectTableOrder(order)}
                >
                  {/* Semáforo */}
                  <TableCell className="px-3 py-3">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${ageStyle.dot}`}
                      title={ageStyle.label}
                    />
                  </TableCell>

                  {/* Tiempo */}
                  <TableCell className="px-2 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium whitespace-nowrap ${ageStyle.badge}`}
                    >
                      {formatMinutesAgo(minutes)}
                    </Badge>
                  </TableCell>

                  {/* ID */}
                  <TableCell className="w-14 px-3 py-3 text-sm font-mono font-semibold">
                    #{order.id}
                  </TableCell>

                  {/* Origen */}
                  <TableCell className="px-2 py-3">
                    <SourceBadge userId={order.userId} />
                  </TableCell>

                  {/* Cliente */}
                  <TableCell className="w-32 px-2 py-3 text-sm">
                    {order.userName}
                  </TableCell>

                  {/* Importe */}
                  <TableCell className="px-3 py-3 text-sm font-bold text-green">
                    ${formatCurrency(order.totalAmount)}
                  </TableCell>

                  {/* Tipo entrega */}
                  <TableCell className="px-3 py-3 text-sm text-center capitalize">
                    {order.deliveryType}
                  </TableCell>

                  {/* Dirección */}
                  <TableCell className="px-3 py-3 text-sm text-center text-muted-foreground">
                    {order.deliveryAddress || ""}
                  </TableCell>

                  {/* Fecha */}
                  <TableCell className="px-3 py-3 text-xs text-muted-foreground">
                    {formatDate(order.updatedAt || order.createdAt)}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="px-1 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditOrder(order) }}
                        className="orders-action-btn orders-action-btn--edit"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete?.(order.id) }}
                        className="orders-action-btn orders-action-btn--delete"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenDialog(order) }}
                        className="orders-action-btn orders-action-btn--close"
                        title="Cerrar orden"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Cerrar</span>
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

      {/* Dialog — cierre de orden */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cerrar Orden #{selectedOrderModal?.id}</DialogTitle>
            <DialogDescription>
              Seleccioná los métodos de pago para cerrar la orden de{" "}
              <strong>{selectedOrderModal?.userName}</strong>
            </DialogDescription>
          </DialogHeader>

          {selectedOrderModal && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total a cobrar:</span>
                  <span className="text-lg font-bold">
                    ${formatCurrency(selectedOrderModal.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Total ingresado:</span>
                  <span className={`font-bold ${totalsMatch ? "text-green" : "text-destructive"}`}>
                    ${formatCurrency(totalEntered)}
                  </span>
                </div>
                {!totalsMatch && warning && (
                  <p className="text-xs text-destructive">
                    El total ingresado no coincide con el total de la orden
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Métodos de Pago</Label>
                <div className="space-y-2">
                  {paymentOptions.map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={key}
                          checked={payments[key] || false}
                          onCheckedChange={() => handleCheckboxChange(key)}
                        />
                        <Label htmlFor={key} className="flex cursor-pointer items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </Label>
                      </div>
                      {payments[key] && (
                        <Input
                          type="number"
                          placeholder="Monto"
                          value={amounts[key] || ""}
                          onChange={(e) => handleAmountChange(key, e.target.value)}
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
  )
}

export default OrdersTableEnhanced