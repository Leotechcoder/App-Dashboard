"use client"

import { useState, useEffect } from "react"
import { fetchPendingOrders, closeOrder } from "../../application/salesThunks"
import { useSalesData } from "../hooks/useSalesData"
import { useCashRegister } from "../hooks/useCashRegister"
import { useSalesHistory } from "../hooks/useSalesHistory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesFilters } from "../components/SalesFilters"
import { SalesChart } from "../components/SalesChart"
import { SalesTable } from "../components/SalesTable"
import { PendingOrdersTable } from "../components/PendingOrdersTable"
import { OpenCashRegisterDialog } from "../components/OpenCashRegisterDialog"
import { CloseCashRegisterDialog } from "../components/CloseCashRegisterDialog"
import { CashRegisterSummary } from "../components/CashRegisterSummary"
import { DollarSign, Calendar, Package, Plus, ClipboardList } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"

export function SalesDashboardView() {
  const dispatch = useDispatch()
  const { orders, totalEarnings, chartData, cashRegister, cashRegisterAnalysis, sessionOrders, loading, filters } =
    useSalesData()
  const { pendingOrders } = useSelector((state) => state.sales)
  const { handleOpenCashRegister, handleCloseCashRegister } = useCashRegister()
  const { updateFilters } = useSalesHistory()

  const [openDialog, setOpenDialog] = useState(false)
  const [closeDialog, setCloseDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchPendingOrders())
  }, [dispatch])

  const handleFilterChange = (newFilters) => updateFilters(newFilters)
  const handleOpen = async (initialAmount) => { await handleOpenCashRegister(initialAmount); setOpenDialog(false) }
  const handleClose = async (finalAmount) => { await handleCloseCashRegister(finalAmount); setCloseDialog(false) }
  const handleCloseOrder = async (orderId, paymentInfo) => {
    await dispatch(closeOrder({ orderId, paymentInfo }))
    dispatch(fetchPendingOrders())
  }

  const isCashRegisterOpen = cashRegister && cashRegister.status === "open"

  return (
    <div className="space-y-6 pb-20 px-4 md:px-6 lg:px-16 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Control de caja e historial de ventas</h2>
          <span></span>
          {/* <p className="text-muted-foreground">Control de caja e historial de ventas</p> */}
        </div>
        {isCashRegisterOpen && (
          <Button onClick={() => setCloseDialog(true)} variant="destructive" className="self-start md:self-auto">
            Cerrar Caja
          </Button>
        )}
      </div>

      {/* Cash Register Summary */}
      {cashRegister && <CashRegisterSummary cashRegister={cashRegister} analysis={cashRegisterAnalysis} />}

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="pending" className="gap-2 flex-1 md:flex-none">
            <ClipboardList className="h-4 w-4" /> Órdenes Pendientes
            {pendingOrders.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {pendingOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sales" className="gap-2 flex-1 md:flex-none">
            <Package className="h-4 w-4" /> Ventas Cerradas
          </TabsTrigger>
        </TabsList>

        {/* Pending Orders Tab */}
        <TabsContent value="pending" className="space-y-4 overflow-x-auto">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes Pendientes de Cierre</CardTitle>
            </CardHeader>
            <CardContent>
              <PendingOrdersTable orders={pendingOrders} onCloseOrder={handleCloseOrder} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <SalesFilters filters={filters} onFiltersChange={handleFilterChange} />

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Ganancias</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">De {orders.length} órdenes cerradas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Fecha Actual</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{format(new Date(), "dd MMM", { locale: es })}</div>
                <p className="text-xs text-muted-foreground">{format(new Date(), "yyyy", { locale: es })}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Órdenes Cerradas</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">Pagadas o entregadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <SalesChart orders={orders} />

          {/* Sales Table */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Ventas Cerradas</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Cargando órdenes...</div>
              ) : orders.length > 0 ? (
                <SalesTable orders={orders} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay órdenes cerradas en este período
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Button */}
      <AnimatePresence>
        {!isCashRegisterOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setOpenDialog(true)}>
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <OpenCashRegisterDialog open={openDialog} onOpenChange={setOpenDialog} onConfirm={handleOpen} />
      <CloseCashRegisterDialog
        open={closeDialog}
        onOpenChange={setCloseDialog}
        onConfirm={handleClose}
        cashRegister={cashRegister}
        orders={sessionOrders}
      />
    </div>
  )
}

