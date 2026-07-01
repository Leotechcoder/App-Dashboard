import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { BarChart3, RefreshCw, GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// Fase 2 — thunks
import {
  fetchTopProducts,
  fetchSalesByCategory,
  fetchSalesByHour,
  // Fase 3
  fetchSalesComparison,
} from "../../application/analyticsThunks"
import { setAnalyticsFilters } from "../../application/analyticsSlice"

// Fase 2 — widgets
import { TopProductsWidget }    from "../components/TopProductsWidget"
import { SalesByCategoryChart } from "../components/SalesByCategoryChart"
import { PeakHoursChart }       from "../components/PeakHoursChart"

// Fase 3 — widgets
import { ComparativeKPIs }      from "../components/ComparativeKPIs"
import { SalesTrendChart }      from "../components/SalesTrendChart"
import { LowRotationProducts }  from "../components/LowRotationProducts"

// ── Helpers ───────────────────────────────────────────────────────────────
const toISODate = (date) => date.toISOString().split("T")[0]

const getDefaultRange = () => {
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { startDate: toISODate(start), endDate: toISODate(end) }
}

const getPrevMonthRange = () => {
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const end   = new Date(now.getFullYear(), now.getMonth(), 0)
  return { startDate: toISODate(start), endDate: toISODate(end) }
}

const fadeUp = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
}

// ── Componente de filtros reutilizable ────────────────────────────────────
function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange, onApply, shortcuts }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-col sm:flex-row items-end gap-3 flex-wrap">
          {shortcuts && (
            <div className="flex gap-2 flex-wrap">
              {shortcuts.map((s) => (
                <Button
                  key={s.key}
                  variant="outline"
                  size="sm"
                  onClick={s.onClick}
                  className="hover:cursor-pointer text-xs"
                >
                  {s.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-[hsl(var(--muted-foreground))]">Desde</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartChange(e.target.value)}
                className="h-8 text-sm w-36"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[hsl(var(--muted-foreground))]">Hasta</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndChange(e.target.value)}
                className="h-8 text-sm w-36"
              />
            </div>
            <Button size="sm" onClick={onApply} className="h-8 gap-1.5 hover:cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" />
              Aplicar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Componente principal ──────────────────────────────────────────────────
export function AnalyticsDashboard() {
  const dispatch     = useDispatch()
  const defaultRange = getDefaultRange()
  const prevRange    = getPrevMonthRange()

  // ── Estado Fase 2 ─────────────────────────────────────────────────────
  const [startDate, setStartDate] = useState(defaultRange.startDate)
  const [endDate,   setEndDate]   = useState(defaultRange.endDate)

  // ── Estado Fase 3 — comparativa ───────────────────────────────────────
  const [p1Start, setP1Start] = useState(prevRange.startDate)
  const [p1End,   setP1End]   = useState(prevRange.endDate)
  const [p2Start, setP2Start] = useState(defaultRange.startDate)
  const [p2End,   setP2End]   = useState(defaultRange.endDate)

  // ── Fase 2: fetch de los 3 widgets ────────────────────────────────────
  const fetchPhase2 = async (start, end) => {
    if (!start || !end) { toast.error("Seleccioná un rango válido"); return }
    if (new Date(start) > new Date(end)) { toast.error("La fecha de inicio debe ser anterior a la de fin"); return }

    dispatch(setAnalyticsFilters({ startDate: start, endDate: end }))
    await Promise.all([
      dispatch(fetchTopProducts({ startDate: start, endDate: end, limit: 10 })),
      dispatch(fetchSalesByCategory({ startDate: start, endDate: end })),
      dispatch(fetchSalesByHour({ startDate: start, endDate: end })),
    ])
  }

  // ── Fase 3: fetch de comparativa ──────────────────────────────────────
  const fetchPhase3 = async (p1s, p1e, p2s, p2e) => {
    if (!p1s || !p1e || !p2s || !p2e) { toast.error("Completá todos los rangos"); return }
    await dispatch(fetchSalesComparison({ p1Start: p1s, p1End: p1e, p2Start: p2s, p2End: p2e }))
  }

  // Shortcuts Fase 2
  const makeShortcut = (key) => {
    const now = new Date()
    let start, end
    if (key === "today") {
      start = end = toISODate(now)
    } else if (key === "week") {
      const day = now.getDay() || 7
      start = toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1))
      end   = toISODate(now)
    } else if (key === "month") {
      start = toISODate(new Date(now.getFullYear(), now.getMonth(), 1))
      end   = toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    } else if (key === "lastmonth") {
      start = toISODate(new Date(now.getFullYear(), now.getMonth() - 1, 1))
      end   = toISODate(new Date(now.getFullYear(), now.getMonth(), 0))
    }
    setStartDate(start); setEndDate(end)
    fetchPhase2(start, end)
  }

  // Carga inicial
  useEffect(() => {
    fetchPhase2(defaultRange.startDate, defaultRange.endDate)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 px-4 md:px-6 py-2"
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* <BarChart3 className="h-6 w-6 text-[hsl(var(--primary))]" /> */}
        <h2 className="text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
          Gestión Comercial
        </h2>
      </div>

      {/* ── Tabs: Fase 2 / Fase 3 ─────────────────────────────────────── */}
      <Tabs defaultValue="comercial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="comercial" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Comercial
          </TabsTrigger>
          <TabsTrigger value="avanzada" className="gap-2">
            <GitCompare className="h-4 w-4" /> Analítica Avanzada
          </TabsTrigger>
        </TabsList>

        {/* ══ TAB FASE 2: Dashboard Comercial ════════════════════════════ */}
        <TabsContent value="comercial" className="space-y-4">
          <motion.div {...fadeUp}>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartChange={setStartDate}
              onEndChange={setEndDate}
              onApply={() => fetchPhase2(startDate, endDate)}
              shortcuts={[
                { key: "today",     label: "Hoy",          onClick: () => makeShortcut("today") },
                { key: "week",      label: "Esta semana",   onClick: () => makeShortcut("week") },
                { key: "month",     label: "Este mes",      onClick: () => makeShortcut("month") },
                { key: "lastmonth", label: "Mes anterior",  onClick: () => makeShortcut("lastmonth") },
              ]}
            />
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TopProductsWidget />
            <SalesByCategoryChart />
            <PeakHoursChart />
          </motion.div>
        </TabsContent>

        {/* ══ TAB FASE 3: Analítica Avanzada ═════════════════════════════ */}
        <TabsContent value="avanzada" className="space-y-6">

          {/* ── Sección comparativa ───────────────────────────────────── */}
          <motion.div {...fadeUp} className="space-y-3">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-[hsl(var(--primary))]" />
              Comparativa de Períodos
            </h3>

            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Período 1 */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                      Período base
                    </p>
                    <div className="flex gap-2">
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Desde</Label>
                        <Input type="date" value={p1Start} onChange={(e) => setP1Start(e.target.value)} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Hasta</Label>
                        <Input type="date" value={p1End} onChange={(e) => setP1End(e.target.value)} className="h-8 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Período 2 */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                      Período actual
                    </p>
                    <div className="flex gap-2">
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Desde</Label>
                        <Input type="date" value={p2Start} onChange={(e) => setP2Start(e.target.value)} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Hasta</Label>
                        <Input type="date" value={p2End} onChange={(e) => setP2End(e.target.value)} className="h-8 text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => fetchPhase3(p1Start, p1End, p2Start, p2End)}
                  className="mt-4 gap-1.5 hover:cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Comparar períodos
                </Button>
              </CardContent>
            </Card>

            {/* KPIs comparativos */}
            <ComparativeKPIs />

            {/* Gráfico de tendencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SalesTrendChart
                period1Label="Período base"
                period2Label="Período actual"
              />
            </div>
          </motion.div>

          {/* ── Sección baja rotación ─────────────────────────────────── */}
          <motion.div {...fadeUp} className="space-y-3">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[hsl(var(--destructive))]" />
              Baja Rotación de Productos
            </h3>

            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3">
                  Usá el rango de fechas del tab Comercial o seleccioná uno específico.
                </p>
                <DateRangeFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartChange={setStartDate}
                  onEndChange={setEndDate}
                  onApply={() => fetchPhase2(startDate, endDate)}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LowRotationProducts startDate={startDate} endDate={endDate} />
            </div>
          </motion.div>

        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
