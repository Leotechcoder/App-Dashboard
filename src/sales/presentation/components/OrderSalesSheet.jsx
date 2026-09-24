import { useMemo } from "react"
import { useSelector } from "react-redux"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Store,
  Truck,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

/* ============================================================
   Configuración
============================================================ */

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    dot: "bg-yellow-500",
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },

  ready: {
    label: "Listo",
    dot: "bg-blue-500",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },

  "ready-to-pay": {
    label: "Lista para cobrar",
    dot: "bg-yellow-500",
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },

  delivered: {
    label: "Entregado",
    dot: "bg-green-500",
    className:
      "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
  },

  paid: {
    label: "Pagado",
    dot: "bg-green-500",
    className:
      "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
  },

  cancelled: {
    label: "Cancelado",
    dot: "bg-red-500",
    className:
      "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
}

const DELIVERY_CONFIG = {
  delivery: {
    label: "Delivery",
    icon: Truck,
  },

  local: {
    label: "Retiro en local",
    icon: Store,
  },

  table: {
    label: "Mesa",
    icon: Store,
  },
}

const PAYMENT_LABELS = {
  efectivo: "Efectivo",
  cash: "Efectivo",

  debito: "Débito",
  debit: "Débito",

  credito: "Crédito",
  credit: "Crédito",

  transferencia: "Transferencia",
  transfer: "Transferencia",
  transf: "Transferencia",
}

/* ============================================================
   Helpers
============================================================ */

function getStatusConfig(status) {
  return (
    STATUS_CONFIG[String(status ?? "").toLowerCase()] ??
    STATUS_CONFIG.pending
  )
}

function getDeliveryConfig(deliveryType) {
  return (
    DELIVERY_CONFIG[
      String(deliveryType ?? "").toLowerCase()
    ] ?? {
      label: "Sin especificar",
      icon: Store,
    }
  )
}

function getPaymentLabel(method) {
  return (
    PAYMENT_LABELS[String(method ?? "").toLowerCase()] ??
    method ??
    "Otro"
  )
}

function getOrderItems(order, items) {
  if (
    Array.isArray(order?.items) &&
    order.items.length > 0
  ) {
    return order.items
  }

  return items.filter(
    (item) =>
      String(item.orderId) === String(order?.id)
  )
}

function getItemName(item) {
  return (
    item.productName ||
    item.name ||
    item.product?.name ||
    "Producto"
  )
}

function getItemDescription(item) {
  return (
    item.description ||
    item.productDescription ||
    item.product?.description ||
    "—"
  )
}

function getItemQuantity(item) {
  return Number(item.quantity) || 0
}

function getItemUnitPrice(item) {
  return Number(
    item.unitPrice ??
      item.unit_price ??
      item.price ??
      item.product?.price ??
      0
  )
}

function getItemSubtotal(item) {
  const quantity = getItemQuantity(item)
  const unitPrice = getItemUnitPrice(item)

  return quantity * unitPrice
}

function getItemTaxRate(item) {
  const value =
    item.taxRate ??
    item.tax_rate ??
    item.iva ??
    item.ivaRate ??
    item.product?.taxRate ??
    item.product?.tax_rate

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null
  }

  return Number(value)
}

function getItemDiscount(item) {
  const value =
    item.discount ??
    item.discountAmount ??
    item.discount_amount

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null
  }

  return Number(value)
}

function formatDate(value) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatDateTime(value) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function getCustomerName(order) {
  return (
    order?.customerName ||
    order?.userName ||
    "Cliente sin nombre"
  )
}

function getCustomerAddress(order) {
  return (
    order?.deliveryAddress ||
    order?.delivery_address ||
    "Sin dirección registrada"
  )
}

function getSourceLabel(source) {
  const labels = {
    pos: "Punto de venta",
    app: "Aplicación",
    whatsapp: "WhatsApp",
    n8n: "Automatización",
  }

  return (
    labels[String(source ?? "").toLowerCase()] ||
    source ||
    "Sin especificar"
  )
}

function getTableNumber(order) {
  return (
    order?.tableId ??
    order?.table_id ??
    null
  )
}

function getPaymentEntries(order) {
  const amounts =
    order?.paymentInfo?.amounts ??
    order?.payment_info?.amounts ??
    {}

  return Object.entries(amounts).filter(
    ([, value]) => Number(value) > 0
  )
}

/* ============================================================
   Barcode visual
============================================================ */

function OrderBarcode({ value }) {
  const normalizedValue = String(value ?? "000000")

  /*
   * Generamos una secuencia visual estable a partir del ID.
   * No pretende ser un código de barras escaneable:
   * es solamente un elemento visual del comprobante.
   */
  const bars = useMemo(() => {
    const source = normalizedValue
      .split("")
      .map((char) => char.charCodeAt(0))
      .join("")

    return Array.from(
      { length: 42 },
      (_, index) => {
        const char =
          source[index % source.length] || "0"

        return Number(char) % 3 === 0
          ? "w-[3px]"
          : Number(char) % 2 === 0
            ? "w-[2px]"
            : "w-[1px]"
      }
    )
  }, [normalizedValue])

  return (
    <div className="flex shrink-0 flex-col items-end">
      <div className="flex h-12 items-stretch gap-[2px] overflow-hidden">
        {bars.map((width, index) => (
          <span
            key={index}
            className={`${width} bg-foreground`}
          />
        ))}
      </div>

      <span className="mt-1 font-mono text-[9px] tracking-wide text-muted-foreground">
        {normalizedValue}
      </span>
    </div>
  )
}

/* ============================================================
   Badge estado
============================================================ */

function StatusBadge({ status }) {
  const config = getStatusConfig(status)

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        font-medium
        ${config.className}
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${config.dot}
        `}
      />

      {config.label}
    </span>
  )
}

/* ============================================================
   Campo de detalle
============================================================ */

function DetailField({
  label,
  value,
  valueClassName = "",
}) {
  return (
    <div className="flex min-w-0 gap-2 text-[11px] leading-5">
      <span className="shrink-0 text-muted-foreground">
        {label}:
      </span>

      <span
        className={`min-w-0 truncate text-foreground/80 ${valueClassName}`}
      >
        {value || "—"}
      </span>
    </div>
  )
}

/* ============================================================
   OrderCard
============================================================ */

function OrderCard({ order, onBack }) {
  const items = useSelector(
    (state) => state.items.data || []
  )

  const orderItems = useMemo(
    () => getOrderItems(order, items),
    [order, items]
  )

  if (!order) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-bg-unit">
        <p className="text-sm text-muted-foreground">
          Cargando orden...
        </p>
      </div>
    )
  }

  const statusConfig = getStatusConfig(order.status)
  const deliveryConfig = getDeliveryConfig(
    order.deliveryType
  )

  const DeliveryIcon = deliveryConfig.icon

  const totalAmount = Number(
    order.totalAmount ??
      order.total ??
      0
  )

  const totalUnits = orderItems.reduce(
    (sum, item) =>
      sum + getItemQuantity(item),
    0
  )

  const calculatedSubtotal = orderItems.reduce(
    (sum, item) =>
      sum + getItemSubtotal(item),
    0
  )

  const paymentEntries =
    getPaymentEntries(order)

  const createdAt = order.createdAt
    ? new Date(order.createdAt)
    : null

  const tableNumber =
    getTableNumber(order)

  const customerName =
    getCustomerName(order)

  const customerAddress =
    getCustomerAddress(order)

  const sourceLabel =
    getSourceLabel(order.source)

  return (
    <div
      className="
      w-full
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        bg-bg-unit
      "
    >
      {/* ======================================================
          Header
      ====================================================== */}

      <header
        className="
          shrink-0
          border-b
          border-border/70
          bg-bg-unit
          px-5
          py-4
          sm:px-7
          sm:py-5
        "
      >
        <div className="flex items-start justify-between gap-5">
          {/* Información principal */}

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-border
                  bg-bg-unit-2
                  text-muted-foreground
                  transition-colors
                  hover:bg-bg-unit-3
                  hover:text-foreground
                "
                aria-label="Volver"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>

              <span className="text-[11px] text-muted-foreground">
                Ordenada por
              </span>
            </div>

            <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {customerName}
            </h2>

            <p className="mt-1 max-w-md text-xs leading-4 text-muted-foreground">
              {customerAddress}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />

              <span className="text-[10px] text-muted-foreground">
                Orden #{order.id}
              </span>
            </div>
          </div>

          {/* Origen + barcode */}

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <Store className="h-3.5 w-3.5 text-primary" />
              {sourceLabel}
            </div>

            <OrderBarcode value={order.id} />
          </div>
        </div>
      </header>

      {/* ======================================================
          Contenido con scroll interno
      ====================================================== */}

      <main
        className="
          min-h-0
          flex-1
          overflow-x-hidden
          overflow-y-auto
          overscroll-contain
          [scrollbar-gutter:stable]
        "
      >
        <div
          className="
            min-w-0
            px-5
            py-5
            sm:px-7
            sm:py-6
          "
        >
          {/* ==================================================
              Order Details
          ================================================== */}

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Detalles de la orden
              </h3>

              <span className="text-[10px] text-muted-foreground">
                {totalUnits}{" "}
                {totalUnits === 1
                  ? "unidad"
                  : "unidades"}
              </span>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-x-8
                gap-y-1
                border-y
                border-border/70
                py-3
                sm:grid-cols-2
              "
            >
              <DetailField
                label="ID"
                value={`#${order.id}`}
              />

              <DetailField
                label="Tipo"
                value={deliveryConfig.label}
              />

              <DetailField
                label="Fecha"
                value={formatDate(
                  order.createdAt
                )}
              />

              <DetailField
                label="Actualización"
                value={formatDateTime(
                  order.updatedAt
                )}
              />

              <DetailField
                label="Mesa"
                value={
                  tableNumber
                    ? `Mesa ${tableNumber}`
                    : "—"
                }
              />

              <DetailField
                label="Origen"
                value={sourceLabel}
              />

              <DetailField
                label="Cliente"
                value={customerName}
              />

              <DetailField
                label="Estado"
                value={statusConfig.label}
              />
            </div>
          </section>

          {/* ==================================================
              Productos
          ================================================== */}

          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />

                <h3 className="text-sm font-semibold text-foreground">
                  Productos
                </h3>
              </div>

              <span className="text-[10px] text-muted-foreground">
                {orderItems.length}{" "}
                {orderItems.length === 1
                  ? "producto"
                  : "productos"}
              </span>
            </div>

            {/* Scroll horizontal solamente para la tabla
                cuando la pantalla sea demasiado pequeña */}

            <div
              className="
                overflow-x-auto
                rounded-lg
                border
                border-border/70
              "
            >
              <table className="w-full min-w-[650px] border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/70 bg-bg-unit-2">
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">
                      Descripción
                    </th>

                    <th className="w-24 px-3 py-2.5 text-right font-medium text-muted-foreground">
                      Precio
                    </th>

                    <th className="w-14 px-3 py-2.5 text-center font-medium text-muted-foreground">
                      Cant.
                    </th>

                    <th className="w-16 px-3 py-2.5 text-center font-medium text-muted-foreground">
                      IVA
                    </th>

                    <th className="w-24 px-3 py-2.5 text-right font-medium text-muted-foreground">
                      Descuento
                    </th>

                    <th className="w-24 px-3 py-2.5 text-right font-medium text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orderItems.length > 0 ? (
                    orderItems.map(
                      (item, index) => {
                        const quantity =
                          getItemQuantity(item)

                        const unitPrice =
                          getItemUnitPrice(item)

                        const subtotal =
                          getItemSubtotal(item)

                        const taxRate =
                          getItemTaxRate(item)

                        const discount =
                          getItemDiscount(item)

                        return (
                          <tr
                            key={
                              item.id ??
                              `${order.id}-${index}`
                            }
                            className="
                              border-b
                              border-border/50
                              last:border-b-0
                            "
                          >
                            {/* Descripción */}

                            <td className="px-3 py-3">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground/85">
                                  {getItemName(item)}
                                </p>

                                <p className="mt-0.5 max-w-[260px] truncate text-[10px] text-muted-foreground">
                                  {getItemDescription(
                                    item
                                  )}
                                </p>
                              </div>
                            </td>

                            {/* Precio */}

                            <td className="whitespace-nowrap px-3 py-3 text-right text-muted-foreground">
                              {formatCurrency(
                                unitPrice
                              )}
                            </td>

                            {/* Cantidad */}

                            <td className="px-3 py-3 text-center text-muted-foreground">
                              {quantity}
                            </td>

                            {/* IVA */}

                            <td className="px-3 py-3 text-center text-muted-foreground">
                              {taxRate !== null
                                ? `${taxRate}%`
                                : "—"}
                            </td>

                            {/* Descuento */}

                            <td className="whitespace-nowrap px-3 py-3 text-right text-muted-foreground">
                              {discount !== null
                                ? `-${formatCurrency(
                                    Math.abs(
                                      discount
                                    )
                                  )}`
                                : "—"}
                            </td>

                            {/* Total */}

                            <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-foreground">
                              {formatCurrency(
                                subtotal
                              )}
                            </td>
                          </tr>
                        )
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-8 text-center text-xs text-muted-foreground"
                      >
                        No hay productos asociados
                        a esta orden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ==================================================
                Total
            ================================================== */}

            <div className="border-b border-border/70">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-foreground">
                  Total
                </span>

                <span className="text-xl font-bold tracking-tight text-foreground">
                  {formatCurrency(
                    totalAmount ||
                      calculatedSubtotal
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              Cliente / Entrega
          ================================================== */}

          <section className="mt-6 grid gap-6 border-b border-border/70 pb-5 sm:grid-cols-2">
            {/* Cliente */}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <UserRound className="h-3.5 w-3.5 text-primary" />

                <span className="text-[11px] font-medium text-muted-foreground">
                  Cliente
                </span>
              </div>

              <p className="text-sm font-semibold text-foreground">
                {customerName}
              </p>

              <p className="mt-1 max-w-xs text-xs leading-4 text-muted-foreground">
                {customerAddress}
              </p>
            </div>

            {/* Entrega */}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <DeliveryIcon className="h-3.5 w-3.5 text-primary" />

                <span className="text-[11px] font-medium text-muted-foreground">
                  Entrega
                </span>
              </div>

              <p className="text-sm font-semibold text-foreground">
                {deliveryConfig.label}
              </p>

              <p className="mt-1 text-xs leading-4 text-muted-foreground">
                {tableNumber
                  ? `Mesa ${tableNumber}`
                  : customerAddress}
              </p>
            </div>
          </section>

          {/* ==================================================
              Pago
          ================================================== */}

          {paymentEntries.length > 0 && (
            <section className="mt-5 border-b border-border/70 pb-5">
              <div className="mb-3 flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-primary" />

                <h3 className="text-[11px] font-medium text-muted-foreground">
                  Pago
                </h3>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {paymentEntries.map(
                  ([method, amount]) => (
                    <div
                      key={method}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-muted-foreground">
                        {getPaymentLabel(
                          method
                        )}
                      </span>

                      <span className="text-xs font-semibold text-foreground">
                        {formatCurrency(
                          Number(amount)
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* ==================================================
              Nota
          ================================================== */}

          <section className="mt-5 pb-2">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[11px] font-medium text-foreground">
                Nota
              </span>
            </div>

            <p className="max-w-3xl text-[11px] leading-5 text-muted-foreground">
              {order.note ||
                order.notes ||
                order.observations ||
                "Sin observaciones para esta orden."}
            </p>
          </section>

          {/* ==================================================
              Footer informativo
          ================================================== */}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/50 pt-4 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3 w-3" />
              {createdAt
                ? createdAt.toLocaleTimeString(
                    "es-AR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "—"}
            </span>

            {order.status === "paid" && (
              <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Orden pagada
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderCard
