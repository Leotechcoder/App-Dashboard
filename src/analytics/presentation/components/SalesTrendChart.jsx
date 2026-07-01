import { useMemo } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Activity } from "lucide-react"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-[hsl(var(--card))] p-3 shadow-md text-xs space-y-1">
      <p className="font-semibold text-[hsl(var(--foreground))]">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: ${formatCurrency(p.value, 0)}
        </p>
      ))}
    </div>
  )
}

/**
 * SalesTrendChart
 *
 * Gráfico de línea que compara la evolución diaria de ventas
 * entre dos períodos. Construye los datos a partir de analytics.comparison
 * si existen, y de analytics.salesByHour como fallback para período único.
 *
 * Para el gráfico de comparativa de períodos se necesita el endpoint
 * /analytics/by-hour ejecutado dos veces (una por período). Esto se
 * orquesta desde AnalyticsDashboard pasando los datos como props.
 *
 * Props:
 *  - period1Data: array[{ label, totalRevenue }] — período base
 *  - period2Data: array[{ label, totalRevenue }] — período actual
 *  - period1Label: string — ej. "Mes anterior"
 *  - period2Label: string — ej. "Este mes"
 */
export function SalesTrendChart({
  period1Data = [],
  period2Data = [],
  period1Label = "Período anterior",
  period2Label = "Período actual",
}) {
  const loading = useSelector((state) => state.analytics.loading)

  // Construir dataset unificado por índice de día
  const chartData = useMemo(() => {
    const maxLen = Math.max(period1Data.length, period2Data.length)
    return Array.from({ length: maxLen }, (_, i) => ({
      label:    period2Data[i]?.label || period1Data[i]?.label || `Día ${i + 1}`,
      periodo1: period1Data[i]?.totalRevenue ?? 0,
      periodo2: period2Data[i]?.totalRevenue ?? 0,
    }))
  }, [period1Data, period2Data])

  const hasData = chartData.some((d) => d.periodo1 > 0 || d.periodo2 > 0)

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" /> Evolución de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52 rounded bg-[hsl(var(--muted))] animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-[hsl(var(--primary))]" />
          Evolución de Ventas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">
            Sin datos para los períodos seleccionados
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
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
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-[hsl(var(--foreground))]">
                    {value === "periodo1" ? period1Label : period2Label}
                  </span>
                )}
              />
              {/* Período anterior — línea punteada gris */}
              {period1Data.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="periodo1"
                  name="periodo1"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
              {/* Período actual — línea sólida primary */}
              <Line
                type="monotone"
                dataKey="periodo2"
                name="periodo2"
                stroke="hsl(142 71% 45%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
