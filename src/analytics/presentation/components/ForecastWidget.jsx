import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import { TrendingUp, RefreshCw } from "lucide-react"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"
import { fetchForecast } from "../../application/analyticsThunks"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-[hsl(var(--card))] p-3 shadow-md text-xs space-y-1">
      <p className="font-semibold text-[hsl(var(--foreground))]">{label}</p>
      <p className="text-[hsl(var(--green))]">
        Ventas: ${formatCurrency(payload[0]?.value, 0)}
      </p>
    </div>
  )
}

/**
 * ForecastWidget
 *
 * Muestra:
 *  - Historial de ventas semanales (barras reales)
 *  - Línea de proyección del mes en curso
 *  - KPIs: promedio semanal y proyección mensual
 *
 * Lee de analytics.forecast (slice Redux).
 */
export function ForecastWidget() {
  const dispatch = useDispatch()
  const forecast = useSelector((state) => state.analytics.forecast)
  const loading  = useSelector((state) => state.analytics.loading)
  const [weeks,  setWeeks] = useState(4)

  const load = (w) => dispatch(fetchForecast({ weeks: w }))

  useEffect(() => { load(weeks) }, [])

  const chartData = forecast?.history?.map((w, i) => {
    const start = new Date(w.weekStart)
    const label = start.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })
    return { label, totalRevenue: w.totalRevenue, semana: i + 1 }
  }) ?? []

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[hsl(var(--primary))]" />
            Proyección de Ventas
          </CardTitle>

          {/* Control de semanas */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Últimas <span className="font-semibold text-[hsl(var(--foreground))]">{weeks}</span> semanas
            </span>
            <input
              type="range"
              min={2}
              max={12}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-24 accent-[hsl(var(--primary))]"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => load(weeks)}
              disabled={loading}
              className="h-7 gap-1 text-xs hover:cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              Calcular
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* KPIs de proyección */}
        {forecast && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Promedio semanal</p>
              <p className="text-xl font-bold text-[hsl(var(--primary))]">
                ${formatCurrency(forecast.weeklyAvg, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Proyección mensual</p>
              <p className="text-xl font-bold text-[hsl(var(--green))]">
                ${formatCurrency(forecast.projectedMonth, 0)}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                (promedio × 4.33 semanas)
              </p>
            </div>
          </div>
        )}

        {/* Gráfico */}
        {loading ? (
          <div className="h-48 rounded bg-[hsl(var(--muted))] animate-pulse" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">
            Sin datos históricos suficientes
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${formatCurrency(v, 0)}`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={64}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Línea de promedio = proyección */}
              {forecast?.weeklyAvg > 0 && (
                <ReferenceLine
                  y={forecast.weeklyAvg}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="5 5"
                  label={{
                    value: "Promedio",
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "hsl(var(--primary))",
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="totalRevenue"
                stroke="hsl(142 71% 45%)"
                strokeWidth={2}
                fill="url(#forecastGradient)"
                dot={{ r: 3, fill: "hsl(142 71% 45%)" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
