
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import {
  BarChart3,
  RefreshCw,
  GitCompare,
  Package,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  fetchTopProducts,
  fetchSalesByCategory,
  fetchSalesByHour,
  fetchSalesComparison,
} from "../../application/analyticsThunks"

import { setAnalyticsFilters } from "../../application/analyticsSlice"

import { TopProductsWidget } from "../components/TopProductsWidget"
import { SalesByCategoryChart } from "../components/SalesByCategoryChart"
import { PeakHoursChart } from "../components/PeakHoursChart"

import { ComparativeKPIs } from "../components/ComparativeKPIs"
import { SalesTrendChart } from "../components/SalesTrendChart"
import { LowRotationProducts } from "../components/LowRotationProducts"

import { SalesTable } from "@/sales/presentation/components/SalesTable"
import { SalesChart } from "@/sales/presentation/components/SalesChart"
import { SalesMetrics } from "@/sales/presentation/components/SalesMetrics"
import { SalesFilters } from "@/sales/presentation/components/SalesFilters"
import OrderCard from "@/sales/presentation/components/OrderSalesSheet"

import { useSalesData } from "@/sales/presentation/hooks/useSalesData"
import { useSalesHistory } from "@/sales/presentation/hooks/useSalesHistory"

import { useScrollLock } from "@/shared/hook/useScrollLock"

import { cn } from "@/lib/utils"

/* ============================================================
   Helpers
============================================================ */

const toISODate = (date) =>
  date.toISOString().split("T")[0]

const getDefaultRange = () => {
  const now = new Date()

  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  )

  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  )

  return {
    startDate: toISODate(start),
    endDate: toISODate(end),
  }
}

const getPrevMonthRange = () => {
  const now = new Date()

  const start = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  )

  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  )

  return {
    startDate: toISODate(start),
    endDate: toISODate(end),
  }
}

/* ============================================================
   Animaciones
============================================================ */

const fadeSlide = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 10,
  },
  transition: {
    duration: 0.35,
    ease: "easeOut",
  },
}

/* ============================================================
   Date Range Filter
============================================================ */

function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onApply,
  shortcuts,
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-col items-end gap-3 sm:flex-row sm:flex-wrap">

          {shortcuts && (
            <div className="flex flex-wrap gap-2">
              {shortcuts.map((shortcut) => (
                <Button
                  key={shortcut.key}
                  variant="outline"
                  size="sm"
                  onClick={shortcut.onClick}
                  className="text-xs hover:cursor-pointer"
                >
                  {shortcut.label}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Desde
              </Label>

              <Input
                type="date"
                value={startDate}
                onChange={(event) =>
                  onStartChange(event.target.value)
                }
                className="h-8 w-36 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Hasta
              </Label>

              <Input
                type="date"
                value={endDate}
                onChange={(event) =>
                  onEndChange(event.target.value)
                }
                className="h-8 w-36 text-sm"
              />
            </div>

            <Button
              size="sm"
              onClick={onApply}
              className="h-8 gap-1.5 hover:cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Aplicar
            </Button>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ============================================================
   Componente principal
============================================================ */

export function AnalyticsDashboard() {
  const dispatch = useDispatch()

  const defaultRange = getDefaultRange()
  const prevRange = getPrevMonthRange()

  /* ==========================================================
     Estado Fase 2
  ========================================================== */

  const [startDate, setStartDate] = useState(
    defaultRange.startDate
  )

  const [endDate, setEndDate] = useState(
    defaultRange.endDate
  )

  /* ==========================================================
     Estado Fase 3
  ========================================================== */

  const [p1Start, setP1Start] = useState(
    prevRange.startDate
  )

  const [p1End, setP1End] = useState(
    prevRange.endDate
  )

  const [p2Start, setP2Start] = useState(
    defaultRange.startDate
  )

  const [p2End, setP2End] = useState(
    defaultRange.endDate
  )

  /* ==========================================================
     Ventas cerradas
  ========================================================== */

  const {
    orders,
    totalEarnings,
    loading,
  } = useSalesData()

  const {
    filters,
    updateFilters,
  } = useSalesHistory()

  const [selectedOrderCard, setSelectedOrderCard] =
    useState(null)

  useScrollLock(!!selectedOrderCard)

  /* ==========================================================
     Fetch Fase 2
  ========================================================== */

  const fetchPhase2 = async (start, end) => {
    if (!start || !end) {
      toast.error("Seleccioná un rango válido")
      return
    }

    if (new Date(start) > new Date(end)) {
      toast.error(
        "La fecha de inicio debe ser anterior a la de fin"
      )
      return
    }

    dispatch(
      setAnalyticsFilters({
        startDate: start,
        endDate: end,
      })
    )

    await Promise.all([
      dispatch(
        fetchTopProducts({
          startDate: start,
          endDate: end,
          limit: 10,
        })
      ),

      dispatch(
        fetchSalesByCategory({
          startDate: start,
          endDate: end,
        })
      ),

      dispatch(
        fetchSalesByHour({
          startDate: start,
          endDate: end,
        })
      ),
    ])
  }

  /* ==========================================================
     Fetch Fase 3
  ========================================================== */

  const fetchPhase3 = async (
    p1s,
    p1e,
    p2s,
    p2e
  ) => {
    if (!p1s || !p1e || !p2s || !p2e) {
      toast.error("Completá todos los rangos")
      return
    }

    await dispatch(
      fetchSalesComparison({
        p1Start: p1s,
        p1End: p1e,
        p2Start: p2s,
        p2End: p2e,
      })
    )
  }

  /* ==========================================================
     Shortcuts
  ========================================================== */

  const makeShortcut = (key) => {
    const now = new Date()

    let start
    let end

    if (key === "today") {
      start = end = toISODate(now)
    }

    if (key === "week") {
      const day = now.getDay() || 7

      start = toISODate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - day + 1
        )
      )

      end = toISODate(now)
    }

    if (key === "month") {
      start = toISODate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        )
      )

      end = toISODate(
        new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        )
      )
    }

    if (key === "lastmonth") {
      start = toISODate(
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        )
      )

      end = toISODate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        )
      )
    }

    setStartDate(start)
    setEndDate(end)

    fetchPhase2(start, end)
  }

  /* ==========================================================
     Carga inicial
  ========================================================== */

  useEffect(() => {
    fetchPhase2(
      defaultRange.startDate,
      defaultRange.endDate
    )
  }, [])

  /* ==========================================================
     Render
  ========================================================== */

  return (
    <main className="min-h-[95vh] w-full overflow-hidden">

      <AnimatePresence mode="wait">

        <motion.section
          key="analyticsDashboard"
          {...fadeSlide}
          className="w-full"
        >

          {/* ==================================================
              Header
          =================================================== */}

          <header className="mb-5 flex items-center px-6">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Gestión Comercial
                </h1>

                <p className="text-xs text-muted-foreground">
                  Analizá el rendimiento de tus ventas y obtené
                  información sobre tu negocio.
                </p>
              </div>

            </div>
          </header>

          {/* ==================================================
              Tabs
          =================================================== */}

          <section className="px-6">

            <Tabs
              defaultValue="comercial"
              className="space-y-5"
            >

              <TabsList className="flex flex-wrap gap-2">

                {/* Comercial */}

                <TabsTrigger
                  value="comercial"
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 md:flex-none",
                    "data-[state=inactive]:border-accent",
                    "data-[state=inactive]:hover:bg-accent/90",
                    "data-[state=active]:bg-primary/5",
                    "data-[state=active]:text-primary"
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  Comercial
                </TabsTrigger>

                {/* Ventas */}

                <TabsTrigger
                  value="sales"
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 md:flex-none",
                    "data-[state=inactive]:border-accent",
                    "data-[state=inactive]:hover:bg-accent/90",
                    "data-[state=active]:bg-primary/5",
                    "data-[state=active]:text-primary"
                  )}
                >
                  <Package className="h-4 w-4" />
                  Ventas Cerradas
                </TabsTrigger>

                {/* Analítica avanzada */}

                <TabsTrigger
                  value="avanzada"
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 md:flex-none",
                    "data-[state=inactive]:border-accent",
                    "data-[state=inactive]:hover:bg-accent/90",
                    "data-[state=active]:bg-primary/5",
                    "data-[state=active]:text-primary"
                  )}
                >
                  <GitCompare className="h-4 w-4" />
                  Analítica Avanzada
                </TabsTrigger>

              </TabsList>

              {/* ==================================================
                  TAB — COMERCIAL
              =================================================== */}

              <TabsContent
                value="comercial"
                className="space-y-5"
              >

                {/* Filtros */}

                <motion.div {...fadeSlide}>
                  <DateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                    onApply={() =>
                      fetchPhase2(
                        startDate,
                        endDate
                      )
                    }
                    shortcuts={[
                      {
                        key: "today",
                        label: "Hoy",
                        onClick: () =>
                          makeShortcut("today"),
                      },
                      {
                        key: "week",
                        label: "Esta semana",
                        onClick: () =>
                          makeShortcut("week"),
                      },
                      {
                        key: "month",
                        label: "Este mes",
                        onClick: () =>
                          makeShortcut("month"),
                      },
                      {
                        key: "lastmonth",
                        label: "Mes anterior",
                        onClick: () =>
                          makeShortcut("lastmonth"),
                      },
                    ]}
                  />
                </motion.div>

                {/* Widgets */}

                <motion.div
                  {...fadeSlide}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <TopProductsWidget />

                  <SalesByCategoryChart />

                  <PeakHoursChart />
                </motion.div>

              </TabsContent>

              {/* ==================================================
                  TAB — ANALÍTICA AVANZADA
              =================================================== */}

              <TabsContent
                value="avanzada"
                className="space-y-6"
              >

                {/* Comparativa */}

                <motion.section
                  {...fadeSlide}
                  className="space-y-4"
                >

                  <div className="flex items-center gap-2">
                    <GitCompare className="h-4 w-4 text-primary" />

                    <h2 className="text-sm font-semibold text-foreground">
                      Comparativa de Períodos
                    </h2>
                  </div>

                  <Card>
                    <CardContent className="pt-4">

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Período base */}

                        <div className="space-y-2">

                          <p className="text-xs font-medium text-muted-foreground">
                            Período base
                          </p>

                          <div className="flex gap-2">

                            <div className="flex-1 space-y-1">
                              <Label className="text-xs">
                                Desde
                              </Label>

                              <Input
                                type="date"
                                value={p1Start}
                                onChange={(event) =>
                                  setP1Start(
                                    event.target.value
                                  )
                                }
                                className="h-8 text-sm"
                              />
                            </div>

                            <div className="flex-1 space-y-1">
                              <Label className="text-xs">
                                Hasta
                              </Label>

                              <Input
                                type="date"
                                value={p1End}
                                onChange={(event) =>
                                  setP1End(
                                    event.target.value
                                  )
                                }
                                className="h-8 text-sm"
                              />
                            </div>

                          </div>
                        </div>

                        {/* Período actual */}

                        <div className="space-y-2">

                          <p className="text-xs font-medium text-muted-foreground">
                            Período actual
                          </p>

                          <div className="flex gap-2">

                            <div className="flex-1 space-y-1">
                              <Label className="text-xs">
                                Desde
                              </Label>

                              <Input
                                type="date"
                                value={p2Start}
                                onChange={(event) =>
                                  setP2Start(
                                    event.target.value
                                  )
                                }
                                className="h-8 text-sm"
                              />
                            </div>

                            <div className="flex-1 space-y-1">
                              <Label className="text-xs">
                                Hasta
                              </Label>

                              <Input
                                type="date"
                                value={p2End}
                                onChange={(event) =>
                                  setP2End(
                                    event.target.value
                                  )
                                }
                                className="h-8 text-sm"
                              />
                            </div>

                          </div>
                        </div>

                      </div>

                      <Button
                        size="sm"
                        onClick={() =>
                          fetchPhase3(
                            p1Start,
                            p1End,
                            p2Start,
                            p2End
                          )
                        }
                        className="mt-4 gap-1.5 hover:cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Comparar períodos
                      </Button>

                    </CardContent>
                  </Card>

                  <ComparativeKPIs />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SalesTrendChart
                      period1Label="Período base"
                      period2Label="Período actual"
                    />
                  </div>

                </motion.section>

                {/* Baja rotación */}

                <motion.section
                  {...fadeSlide}
                  className="space-y-4"
                >

                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-destructive" />

                    <h2 className="text-sm font-semibold text-foreground">
                      Baja Rotación de Productos
                    </h2>
                  </div>

                  <div className="rounded-xl border border-border bg-bg-unit p-4 shadow-sm">

                    <p className="mb-4 text-xs text-muted-foreground">
                      Usá el rango de fechas del tab Comercial
                      o seleccioná uno específico.
                    </p>

                    <DateRangeFilter
                      startDate={startDate}
                      endDate={endDate}
                      onStartChange={setStartDate}
                      onEndChange={setEndDate}
                      onApply={() =>
                        fetchPhase2(
                          startDate,
                          endDate
                        )
                      }
                    />

                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <LowRotationProducts
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </div>

                </motion.section>

              </TabsContent>

              {/* ==================================================
                  TAB — VENTAS CERRADAS
              =================================================== */}

              <TabsContent
                value="sales"
                className="space-y-5"
              >

                <motion.div {...fadeSlide}>
                  <SalesFilters
                    filters={filters}
                    onFiltersChange={updateFilters}
                  />
                </motion.div>

                <motion.div {...fadeSlide}>
                  <SalesMetrics
                    orders={orders}
                    totalEarnings={totalEarnings}
                  />
                </motion.div>

                <motion.div {...fadeSlide}>
                  <SalesChart orders={orders} />
                </motion.div>

                <motion.div {...fadeSlide}>

                  <Card>

                    <CardHeader>
                      <CardTitle>
                        Historial de Ventas Cerradas
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">

                      {loading ? (

                        <div className="py-8 text-center text-muted-foreground">
                          Cargando órdenes...
                        </div>

                      ) : orders.length > 0 ? (

                        <SalesTable
                          orders={orders}
                          onSelectOrder={
                            setSelectedOrderCard
                          }
                        />

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

          </section>

        </motion.section>

      </AnimatePresence>

      {/* ========================================================
          Order Sheet
      ========================================================= */}

      <AnimatePresence>
        {selectedOrderCard && (

          <motion.div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-background/40
              px-4
              backdrop-blur-sm
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="
                relative
                z-10
                flex
                h-[calc(100vh-1.5rem)]
                max-h-[900px]
                w-full
                max-w-3xl
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-bg-unit
                shadow-2xl
                sm:h-[calc(100vh-2.5rem)]
                lg:h-[calc(100vh-4rem)]
              "
              initial={{
                scale: 0.9,
                x: 100,
              }}
              animate={{
                scale: 1,
                x: 0,
              }}
              exit={{
                scale: 0.9,
                x: 100,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 18,
              }}
            >

              <OrderCard
                order={selectedOrderCard}
                onBack={() =>
                  setSelectedOrderCard(null)
                }
              />

            </motion.div>

          </motion.div>

        )}
      </AnimatePresence>

    </main>
  )}
