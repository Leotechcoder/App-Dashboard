import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Plus, Search, LayoutGrid, RefreshCw, Armchair, CircleCheck, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/shared/presentation/components/utils/ConfirmDialog"
import { TableGrid } from "../components/TableGrid"
import { TableFormModal } from "../components/TableFormModal"
import { TableOrderEditor } from "../components/TableOrderEditor"
import CloseOrderDialog from "@/orders/presentation/components/ordersTable/CloseOrderDialog"
import { useTablesWithStatus } from "../hooks/useTablesWithStatus"
import { getDataTables, createDataTable, updateDataTable, deleteDataTable } from "../../application/tableSlice"
import { closeOrder, fetchPendingOrders } from "@/sales/application/salesThunks"

const FILTERS = [
  { key: "all", label: "Total de mesas", icon: <Armchair /> },
  { key: "available", label: "Disponibles", icon: <CircleCheck /> },
  { key: "occupied", label: "Ocupadas", icon: <ReceiptText /> },
  { key: "ready-to-pay", label: "Listas para cobrar", icon: <ReceiptText /> },
]

export default function TablesPage() {
  const dispatch = useDispatch()
  const tables = useSelector((s) => s.tables.data)
  const isLoading = useSelector((s) => s.tables.isLoading)
  const orders = useSelector((s) => s.orders.data)

  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [formModal, setFormModal] = useState({ open: false, table: null })
  const [orderEditor, setOrderEditor] = useState(null)   // table seleccionada (pending)
  const [payDialog, setPayDialog] = useState(null)        // orden seleccionada (ready-to-pay)
  const [confirmDelete, setConfirmDelete] = useState({ open: false, table: null })

  useEffect(() => { dispatch(getDataTables()) }, [dispatch])

  const enrichedTables = useTablesWithStatus(tables, orders)
  const stats = {
    all: enrichedTables.length,
    available: enrichedTables.filter((t) => t.status.key === "available").length,
    occupied: enrichedTables.filter((t) => t.status.key === "occupied").length,
    "ready-to-pay": enrichedTables.filter((t) => t.status.key === "ready-to-pay").length,
  }
  const visibleTables = enrichedTables.filter(
    (t) => (filter === "all" || t.status.key === filter) && String(t.number).includes(query)
  )

  const openTable = (table) => {
    if (table.status.key === "ready-to-pay") setPayDialog(table.status.order)
    else setOrderEditor(table)
  }

  const handleCreateOrUpdate = async (values) => {
    const action = formModal.table
      ? updateDataTable({ id: formModal.table.id, data: values })
      : createDataTable(values)
    const result = await dispatch(action)
    if (result.error) return toast.error(result.payload || "No se pudo guardar la mesa")
    toast.success(formModal.table ? "Mesa actualizada" : "Mesa creada")
    setFormModal({ open: false, table: null })
  }

  const handleConfirmDelete = async () => {
    const result = await dispatch(deleteDataTable(confirmDelete.table.id))
    if (result.error) toast.error(result.payload || "No se pudo eliminar la mesa")
    else toast.success("Mesa eliminada")
  }

  const handleConfirmPayment = async (orderId, paymentInfo) => {
    await dispatch(closeOrder({ orderId, paymentInfo }))
    dispatch(fetchPendingOrders())
    setPayDialog(null)
    toast.success("Mesa cobrada")
  }

  return (
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <LayoutGrid className="size-4" /> Operación del salón
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Mesas</h1>
          <p className="mt-2 text-sm text-muted-foreground">Seleccioná una mesa para cargar una orden o cobrarla.</p>
        </div>
        <Button onClick={() => setFormModal({ open: true, table: null })}>
          <Plus className="size-4" /> Nueva mesa
        </Button>
      </header>

      <section className="grid gap-3 py-6 sm:grid-cols-4">
        {FILTERS.map((f) => (
          <Card
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`cursor-pointer transition ${filter === f.key ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"}`}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">{f.icon}</span>
              <span>
                <span className="block text-2xl font-semibold text-foreground">{stats[f.key]}</span>
                <span className="text-xs text-muted-foreground">{f.label}</span>
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por número" className="pl-9" />
        </div>
        <button onClick={() => dispatch(getDataTables())} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:cursor-pointer">
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} /> Actualizar
        </button>
      </div>

      <div className="py-6">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-card" />)}
          </div>
        ) : (
          <TableGrid
            tables={visibleTables}
            onSelect={openTable}
            onEdit={(table) => setFormModal({ open: true, table })}
            onDelete={(table) => setConfirmDelete({ open: true, table })}
          />
        )}
      </div>

      {formModal.open && (
        <TableFormModal
          table={formModal.table}
          open={formModal.open}
          onOpenChange={(open) => setFormModal({ open, table: open ? formModal.table : null })}
          onSubmit={handleCreateOrUpdate}
        />
      )}

      {orderEditor && (
        <TableOrderEditor
          table={orderEditor}
          order={orderEditor.status.order}
          onClose={() => setOrderEditor(null)}
          onSaved={() => setOrderEditor(null)}
        />
      )}

      {payDialog && (
        <CloseOrderDialog
          order={payDialog}
          open={!!payDialog}
          onOpenChange={(open) => !open && setPayDialog(null)}
          onConfirm={handleConfirmPayment}
        />
      )}

      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete((p) => ({ ...p, open }))}
        onConfirm={handleConfirmDelete}
        title="Eliminar mesa"
        description={`¿Eliminar la mesa ${confirmDelete.table?.number}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="destructive"
      />
    </motion.main>
  )
}
