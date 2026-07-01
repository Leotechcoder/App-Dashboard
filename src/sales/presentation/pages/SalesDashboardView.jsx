import { useEffect, useState } from "react"
import { useSalesData } from "../hooks/useSalesData"
import { useCashRegister } from "../hooks/useCashRegister"
import { useSalesHistory } from "../hooks/useSalesHistory"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SalesFilters } from "../components/SalesFilters"
import { SalesChart } from "../components/SalesChart"
import { SalesTable } from "../components/SalesTable"
import { CloseCashRegisterDialog } from "../components/CloseCashRegisterDialog"
import { CashRegisterSummary } from "../components/CashRegisterSummary"
import { CashRegisterBanner } from "../components/CashRegisterBanner"
import { SalesMetrics } from "../components/SalesMetrics"

import { Package, ClipboardList } from "lucide-react"

import { AnimatePresence, motion } from "framer-motion"
import { useSelector } from "react-redux"

import OrderCard from "../components/OrderSalesSheet"
import OrdersPage from "@/orders/presentation/pages/OrdersPage"

import { useScrollLock } from "@/shared/hook/useScrollLock"
import { useScrollTo } from "@/shared/hook/useScrollTo"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function SalesDashboardView() {
  const {
    orders,
    totalEarnings,
    cashRegister,
    cashRegisterAnalysis,
    sessionOrders,
    loading,
    filters,
  } = useSalesData()

  const { pendingOrders } = useSelector((state) => state.sales)
  const { handleOpenCashRegister, handleCloseCashRegister, loading: cashLoading } = useCashRegister()
  const { updateFilters } = useSalesHistory()

  useEffect(() => {
    window.scrollTo({ behavior: "smooth" })
  }, [])

  const [closeDialog, setCloseDialog]         = useState(false)
  const [selectedOrderCard, setSelectedOrderCard] = useState(null)

  const { setScrollTo, tableRef } = useScrollTo({ offset: 20 })

  useScrollLock(!!selectedOrderCard || closeDialog)

  // ── Handlers de caja ─────────────────────────────────────────────────────
  const handleOpen = async (initialAmount) => {
    const result = await handleOpenCashRegister(initialAmount)
    if (result?.type?.includes("fulfilled")) {
      toast.info(`Caja abierta con $${initialAmount.toFixed(2)}`)
    } else {
      toast.error("No se pudo abrir la caja")
    }
  }

  const handleClose = async (finalAmount) => {
    await handleCloseCashRegister(finalAmount)
    setCloseDialog(false)
    await updateFilters({
      startDate: new Date().setHours(0, 0, 0, 0),
      endDate:   new Date().setHours(23, 59, 59, 999),
    })
  }

  const isCashRegisterOpen = cashRegister?.status === "open"

  const fadeUp = {
    initial:    { opacity: 0, y: -16 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 px-4 md:px-6 bg-background py-2 rounded-lg"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        {...fadeUp}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestión de Ventas
        </h2>

        {isCashRegisterOpen && (
          <Button variant="destructive" onClick={() => setCloseDialog(true)}>
            Cerrar Caja
          </Button>
        )}
      </motion.div>

      {/* ── Banner: caja cerrada ────────────────────────────────────────── */}
      {!isCashRegisterOpen && (
        <motion.div {...fadeUp}>
          <CashRegisterBanner onOpen={handleOpen} loading={cashLoading} />
        </motion.div>
      )}

      {/* ── Resumen: caja abierta ───────────────────────────────────────── */}
      {isCashRegisterOpen && cashRegister && (
        <motion.div {...fadeUp}>
          <CashRegisterSummary
            cashRegister={cashRegister}
            analysis={cashRegisterAnalysis}
          />
        </motion.div>
      )}

      {/* ── Tabs: pendientes / ventas cerradas ──────────────────────────── */}
      <motion.div {...fadeUp}>
        <Tabs defaultValue="pending" className="space-y-3">
          <TabsList className="flex flex-wrap gap-2">

            <TabsTrigger
              value="pending"
              className={cn(
                "flex items-center gap-2 flex-1 md:flex-none",
                "data-[state=inactive]:border-accent",
                "data-[state=inactive]:hover:bg-accent/90",
                "data-[state=active]:bg-primary",
                "data-[state=active]:text-primary-foreground"
              )}
            >
              <ClipboardList className="h-4 w-4" />
              Órdenes Pendientes
              {pendingOrders.length > 0 && (
                <span className="
                  ml-1 rounded-full px-2 py-0.5 text-xs
                  bg-green
                  border border-green
                  text-primary-foreground
                ">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="sales"
              className={cn(
                "flex items-center gap-2 flex-1 md:flex-none",
                "data-[state=inactive]:border-accent",
                "data-[state=inactive]:hover:bg-accent/90",
                "data-[state=active]:bg-primary",
                "data-[state=active]:text-primary-foreground"
              )}
            >
              <Package className="h-4 w-4" />
              Ventas Cerradas
            </TabsTrigger>
          </TabsList>

          {/* Pending */}
          <TabsContent value="pending">
            <motion.div {...fadeUp}>
              <Card ref={tableRef}>
                <CardContent className="p-0">
                  <OrdersPage setScrollTo={setScrollTo} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Sales */}
          <TabsContent value="sales" className="space-y-4">
            <motion.div {...fadeUp}>
              <SalesFilters filters={filters} onFiltersChange={updateFilters} />
            </motion.div>

            <motion.div {...fadeUp}>
              <SalesMetrics orders={orders} totalEarnings={totalEarnings} />
            </motion.div>

            <motion.div {...fadeUp}>
              <SalesChart orders={orders} />
            </motion.div>

            <motion.div {...fadeUp}>
              <Card>
                <CardHeader className="text-foreground">
                  <CardTitle>Historial de Ventas Cerradas</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {loading ? (
                    <div className="py-8 text-center text-muted-foreground">
                      Cargando órdenes...
                    </div>
                  ) : orders.length > 0 ? (
                    <SalesTable orders={orders} onSelectOrder={setSelectedOrderCard} />
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No hay órdenes cerradas en este período
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}
      <CloseCashRegisterDialog
        open={closeDialog}
        onOpenChange={setCloseDialog}
        onConfirm={handleClose}
        cashRegister={cashRegister}
        orders={sessionOrders}
      />

      {/* ── Order Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedOrderCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-end backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-lg bg-card shadow-xl"
              initial={{ scale: 0.9, x: 100 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0.9, x: 100 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              <OrderCard
                order={selectedOrderCard}
                onBack={() => setSelectedOrderCard(null)}
                className="h-[calc(100dvh-145px)] overflow-y-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
