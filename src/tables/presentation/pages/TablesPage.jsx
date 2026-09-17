
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { toast } from "sonner"

import {
  Plus,
  Search,
  LayoutGrid,
  RefreshCw,
  Armchair,
  CircleCheck,
  ReceiptText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import { ConfirmDialog } from "@/shared/presentation/components/utils/ConfirmDialog"

import { TableGrid } from "../components/TableGrid"
import { TableFormModal } from "../components/TableFormModal"
import { TableOrderEditor } from "../components/TableOrderEditor"

import CloseOrderDialog from "@/orders/presentation/components/ordersTable/CloseOrderDialog"

import { useTablesWithStatus } from "../hooks/useTablesWithStatus"

import {
  getDataTables,
  createDataTable,
  updateDataTable,
  deleteDataTable,
} from "../../application/tableSlice"

import {
  closeOrder,
  fetchPendingOrders,
} from "@/sales/application/salesThunks"

/* ============================================================
   Configuración
============================================================ */

const FILTERS = [
  {
    key: "all",
    label: "Total de mesas",
    icon: Armchair,
  },
  {
    key: "available",
    label: "Disponibles",
    icon: CircleCheck,
  },
  {
    key: "occupied",
    label: "Ocupadas",
    icon: ReceiptText,
  },
  {
    key: "ready-to-pay",
    label: "Listas para cobrar",
    icon: ReceiptText,
  },
]

const FILTER_ACTIVE_STYLES = {
  all: "border-primary/40 bg-primary/5",
  available:
    "border-[hsl(var(--green))]/40 bg-[hsl(var(--green))]/5",
  occupied:
    "border-[hsl(var(--yellow))]/40 bg-[hsl(var(--yellow))]/5",
  "ready-to-pay":
    "border-[hsl(var(--destructive))]/40 bg-[hsl(var(--destructive))]/5",
}

const fadeSlide = {
  initial: {
    opacity: 0,
    y: 10,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: 0.35,
    ease: "easeOut",
  },
}

/* ============================================================
   Página principal
============================================================ */

export default function TablesPage() {
  const dispatch = useDispatch()

  const tables = useSelector((state) => state.tables.data)
  const isLoading = useSelector((state) => state.tables.isLoading)
  const orders = useSelector((state) => state.orders.data)

  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")

  const [formModal, setFormModal] = useState({
    open: false,
    table: null,
  })

  const [orderEditor, setOrderEditor] = useState(null)

  const [payDialog, setPayDialog] = useState(null)

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    table: null,
  })

  /* ==========================================================
     Carga inicial
  ========================================================== */

  useEffect(() => {
    dispatch(getDataTables())
  }, [dispatch])

  /* ==========================================================
     Mesas enriquecidas
  ========================================================== */

  const enrichedTables = useTablesWithStatus(
    tables,
    orders
  )

  /* ==========================================================
     Estadísticas
  ========================================================== */

  const stats = {
    all: enrichedTables.length,

    available: enrichedTables.filter(
      (table) => table.status.key === "available"
    ).length,

    occupied: enrichedTables.filter(
      (table) => table.status.key === "occupied"
    ).length,

    "ready-to-pay": enrichedTables.filter(
      (table) => table.status.key === "ready-to-pay"
    ).length,
  }

  /* ==========================================================
     Filtros
  ========================================================== */

  const visibleTables = enrichedTables.filter((table) => {
    const matchesStatus =
      filter === "all" ||
      table.status.key === filter

    const matchesSearch = String(table.number)
      .toLowerCase()
      .includes(query.toLowerCase())

    return matchesStatus && matchesSearch
  })

  /* ==========================================================
     Handlers
  ========================================================== */

  const handleOpenTable = (table) => {
    if (table.status.key === "ready-to-pay") {
      setPayDialog(table.status.order)
      return
    }

    setOrderEditor(table)
  }

  const handleCreateOrUpdate = async (values) => {
    const action = formModal.table
      ? updateDataTable({
          id: formModal.table.id,
          data: values,
        })
      : createDataTable(values)

    const result = await dispatch(action)

    if (result.error) {
      toast.error(
        result.payload || "No se pudo guardar la mesa"
      )

      return
    }

    toast.success(
      formModal.table
        ? "Mesa actualizada"
        : "Mesa creada"
    )

    setFormModal({
      open: false,
      table: null,
    })
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete.table) return

    const result = await dispatch(
      deleteDataTable(confirmDelete.table.id)
    )

    if (result.error) {
      toast.error(
        result.payload || "No se pudo eliminar la mesa"
      )

      return
    }

    toast.success("Mesa eliminada")

    setConfirmDelete({
      open: false,
      table: null,
    })
  }

  const handleConfirmPayment = async (
    orderId,
    paymentInfo
  ) => {
    await dispatch(
      closeOrder({
        orderId,
        paymentInfo,
      })
    )

    dispatch(fetchPendingOrders())

    setPayDialog(null)

    toast.success("Mesa cobrada")
  }

  const handleRefresh = () => {
    dispatch(getDataTables())
  }

  /* ==========================================================
     Render
  ========================================================== */

  return (
    <motion.main
      {...fadeSlide}
      className="min-h-[95vh] w-full overflow-hidden"
    >
      {/* =====================================================
          Header
      ====================================================== */}

      <header className="mb-5 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Gestión de Mesas
            </h1>

            <p className="text-xs text-muted-foreground">
              Administrá el salón, las órdenes y los cobros de cada mesa.
            </p>
          </div>
        </div>

        <Button
          onClick={() =>
            setFormModal({
              open: true,
              table: null,
            })
          }
          className="hidden h-9 gap-2 sm:inline-flex"
        >
          <Plus className="h-4 w-4" />
          Nueva mesa
        </Button>
      </header>

      {/* =====================================================
          Acción móvil
      ====================================================== */}

      <section className="px-6 sm:hidden">
        <Button
          onClick={() =>
            setFormModal({
              open: true,
              table: null,
            })
          }
          className="h-10 w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva mesa
        </Button>
      </section>

      {/* =====================================================
          KPIs / Filtros
      ====================================================== */}

      <section className="grid gap-3 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
        {FILTERS.map((item) => {
          const Icon = item.icon
          const isActive = filter === item.key

          return (
            <motion.button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              whileTap={{ scale: 0.985 }}
              className={`
                rounded-xl border bg-bg-unit text-left
                transition-colors duration-150
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                ${
                  isActive
                    ? FILTER_ACTIVE_STYLES[item.key]
                    : "border-border hover:border-primary/30"
                }
              `}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                    ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {stats[item.key]}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              </CardContent>
            </motion.button>
          )
        })}
      </section>

      {/* =====================================================
          Barra de herramientas
      ====================================================== */}

      <section className="px-6">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-bg-unit p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Buscar por número de mesa..."
              className="h-9 border-border bg-background pl-9"
            />
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Badge
              variant="secondary"
              className="text-[10px]"
            >
              {visibleTables.length}{" "}
              {visibleTables.length === 1
                ? "mesa"
                : "mesas"}
            </Badge>

            <Button
              type="button"
              variant="ghost"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-9 gap-2 text-muted-foreground hover:text-primary"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />

              <span className="hidden sm:inline">
                Actualizar
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* =====================================================
          Grid de mesas
      ====================================================== */}

      <section className="px-6 py-5">
        {isLoading ? (
          <TablesSkeleton />
        ) : (
          <TableGrid
            tables={visibleTables}
            onSelect={handleOpenTable}
            onEdit={(table) =>
              setFormModal({
                open: true,
                table,
              })
            }
            onDelete={(table) =>
              setConfirmDelete({
                open: true,
                table,
              })
            }
          />
        )}
      </section>

      {/* =====================================================
          Modal crear / editar
      ====================================================== */}

      {formModal.open && (
        <TableFormModal
          table={formModal.table}
          open={formModal.open}
          onOpenChange={(open) =>
            setFormModal({
              open,
              table: open
                ? formModal.table
                : null,
            })
          }
          onSubmit={handleCreateOrUpdate}
        />
      )}

      {/* =====================================================
          Editor de orden
      ====================================================== */}

      {orderEditor && (
        <TableOrderEditor
          table={orderEditor}
          order={orderEditor.status.order}
          onClose={() => setOrderEditor(null)}
          onSaved={() => setOrderEditor(null)}
        />
      )}

      {/* =====================================================
          Cobro
      ====================================================== */}

      {payDialog && (
        <CloseOrderDialog
          order={payDialog}
          open={!!payDialog}
          onOpenChange={(open) =>
            !open && setPayDialog(null)
          }
          onConfirm={handleConfirmPayment}
        />
      )}

      {/* =====================================================
          Confirmación eliminación
      ====================================================== */}

      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={(open) =>
          setConfirmDelete((previous) => ({
            ...previous,
            open,
          }))
        }
        onConfirm={handleConfirmDelete}
        title="Eliminar mesa"
        description={`¿Eliminar la mesa ${confirmDelete.table?.number}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="destructive"
      />
    </motion.main>
  )
}

/* ============================================================
   Loading Skeleton
============================================================ */

const TablesSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-40 animate-pulse rounded-xl border border-border bg-bg-unit"
        />
      ))}
    </div>
  )
}
