import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Plus, Trash2, ReceiptText } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import {
  createDataOrder,
  updateDataOrder,
} from "@/orders/application/orderSlice"

import { getData } from "@/orders/application/itemSlice"

import { formatCurrency } from "@/shared/utils/formatPriceLocal"
import { idGenerator } from "@/shared/infrastructure/utils/idGenerator"

/**
 * Carga/edita los productos de la orden abierta de una mesa.
 *
 * Guardar dispara UNA sola request:
 *  - orden nueva      -> POST /orders (sin cambios)
 *  - orden existente  -> PATCH /orders/:id con `items` completo. El
 *    backend hace el diff (crear/actualizar/borrar) y recalcula el total;
 *    el front ya no arma ni manda ese diff.
 *  - "marcar lista para cobrar" va en el MISMO PATCH que guarda los items
 *    (manda `items` + `status` juntos), no en dos requests separadas.
 */
export function TableOrderEditor({ table, order, onClose, onSaved }) {
  const dispatch = useDispatch()

  const products = useSelector((state) => state.products.data)
  const allItems = useSelector((state) => state.items.data)

  const [isSaving, setIsSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const originalItems = useMemo(
    () => (order ? allItems.filter((item) => item.orderId === order.id) : []),
    [allItems, order]
  )

  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(
      originalItems.map((item) => ({
        dbId: item.id,
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        description: item.description || "",
      }))
    )
  }, [originalItems])

  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category).filter(Boolean))].sort((a, b) =>
        String(a).localeCompare(String(b))
      ),
    [products]
  )

  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.category === selectedCategory),
    [products, selectedCategory]
  )

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + Number(i.unitPrice) * Number(i.quantity), 0),
    [cart]
  )

  const addProduct = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: Number(i.quantity) + 1 } : i
        )
      }
      return [
        ...prev,
        { dbId: null, productId: product.id, productName: product.name, unitPrice: product.price, quantity: 1, description: "" },
      ]
    })
  }

  const removeProduct = (productId) => {
    setCart((prev) =>
      prev.flatMap((i) => {
        if (i.productId !== productId) return [i]
        return Number(i.quantity) > 1 ? [{ ...i, quantity: Number(i.quantity) - 1 }] : []
      })
    )
  }

  // Payload para PATCH /orders/:id → item con `id` (existente) o sin `id`
  // (nuevo). El backend decide qué crear/actualizar/borrar.
  const itemsForSync = () =>
    cart.map((i) => ({
      ...(i.dbId ? { id: i.dbId } : {}),
      productId: i.productId,
      productName: i.productName,
      description: i.description,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    }))

  // Payload para POST /orders (orden nueva) → acá `id` es obligatorio para
  // todos los items, se genera en el cliente como en el resto de la app.
  const itemsForCreate = () =>
    cart.map((i) => ({
      id: idGenerator("Items"),
      productId: i.productId,
      productName: i.productName,
      description: i.description,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    }))

  const handleSave = async ({ markReady = false } = {}) => {
    if (!cart.length) return false
    setIsSaving(true)
    try {
      if (!order) {
        await dispatch(
          createDataOrder({
            userId: `Mesa-${table.number}`,
            userName: `Mesa ${table.number}`,
            status: "pending",
            deliveryType: "table",
            tableId: table.id,
            source: "pos",
            items: itemsForCreate(),
            totalAmount: total,
          })
        ).unwrap()
      } else {
        const data = { items: itemsForSync() }
        if (markReady) data.status = "ready-to-pay"
        await dispatch(updateDataOrder({ id: order.id, data })).unwrap()
      }

      dispatch(getData())
      toast.success(markReady ? `Mesa ${table.number} lista para cobrar` : "Orden de la mesa guardada")
      onSaved?.()
      return true
    } catch (error) {
      toast.error(error?.message || "No se pudo guardar la orden")
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleMarkReadyToPay = () => {
    if (!order || !cart.length || isSaving) return
    handleSave({ markReady: true })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="
          flex
          h-[80vh]
          w-[calc(100%-2rem)]
          max-w-3xl
          flex-col
          overflow-hidden
        "
      >
        {/* =================================
            HEADER
        ================================== */}
        <DialogHeader className="shrink-0">
          <DialogTitle>Mesa {table.number}</DialogTitle>
          <DialogDescription>Agregá productos a la orden de esta mesa.</DialogDescription>
        </DialogHeader>

        {/* =================================
            CONTENIDO PRINCIPAL — ALTURA FIJA
        ================================== */}
        <div
          className="
            grid
            min-h-0
            flex-1
            grid-cols-1
            gap-6
            overflow-hidden
            md:grid-cols-2
          "
        >
          {/* =================================
              PRODUCTOS
          ================================== */}
          <section className="flex min-h-0 flex-col overflow-hidden">
            <div className="shrink-0">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Productos</h3>

              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                <Button
                  type="button"
                  size="sm"
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className="shrink-0"
                >
                  Todos
                </Button>

                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="shrink-0"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
              <div className="grid gap-2">
                {filteredProducts.length === 0 ? (
                  <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-muted-foreground">
                    No hay productos para este filtro.
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="
                        flex items-center justify-between gap-3 rounded-xl border border-border
                        bg-background px-4 py-3 text-left transition
                        hover:cursor-pointer hover:border-primary/50 hover:bg-primary/5
                      "
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {product.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ${formatCurrency(product.price)}
                        </span>
                      </span>
                      <Plus className="size-4 shrink-0 text-primary" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* =================================
              DETALLE
          ================================== */}
          <section className="flex min-h-0 flex-col overflow-hidden">
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Detalle de la orden</h3>
              <span className="text-xs text-muted-foreground">{cart.length} productos</span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
              {cart.length === 0 ? (
                <div className="flex min-h-32 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                  <ReceiptText className="mb-2 size-6" />
                  Aún no hay productos
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ${formatCurrency(item.unitPrice)}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-semibold text-foreground">
                          ${formatCurrency(Number(item.unitPrice) * Number(item.quantity))}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProduct(item.productId)}
                          aria-label={`Quitar ${item.productName}`}
                          className="text-muted-foreground transition hover:cursor-pointer hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =================================
            TOTAL FIJO
        ================================== */}
        <div className="mb-4 flex shrink-0 items-center justify-between border-t border-border pt-4">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-2xl font-semibold text-primary">${formatCurrency(total)}</span>
        </div>

        {/* =================================
            FOOTER FIJO
        ================================== */}
        <div className="flex shrink-0 flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={!order || !cart.length || isSaving}
            onClick={handleMarkReadyToPay}
          >
            Marcar lista para cobrar
          </Button>

          <Button type="button" disabled={!cart.length || isSaving} onClick={() => handleSave()}>
            {isSaving ? "Guardando..." : "Guardar orden"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}