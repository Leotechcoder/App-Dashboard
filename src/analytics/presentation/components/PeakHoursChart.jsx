import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { Clock } from "lucide-react"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-[hsl(var(--card))] p-3 shadow-md text-xs space-y-1">
      <p className="font-semibold text-[hsl(var(--foreground))]">
        {String(label).padStart(2, "0")}:00 hs
      </p>
      <p className="text-[hsl(var(--muted-foreground))]">
        Órdenes:{" "}
        <span className="font-medium text-[hsl(var(--foreground))]">
          {payload[0]?.payload?.ordersCount}
        </span>
      </p>
      <p className="text-[hsl(var(--muted-foreground))]">
        Revenue:{" "}
        <span className="font-medium text-[hsl(var(--green))]">
          ${formatCurrency(payload[0]?.value, 0)}
        </span>
      </p>
    </div>
  )
}

/**
 * PeakHoursChart
 * Bar chart de ventas agrupadas por hora del día (0-23).
 * Pinta en verde las horas con mayor volumen y en gris las vacías.
 * Lee de analytics.salesByHour (slice Redux).
 */
export function PeakHoursChart() {
  const salesByHour = useSelector((state) => state.analytics.salesByHour)
  const loading     = useSelector((state) => state.analytics.loading)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" /> Picos de Venta por Hora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded bg-[hsl(var(--muted))] animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // Calcular el máximo para colorear relativamente
  const maxRevenue = Math.max(...salesByHour.map((h) => h.totalRevenue), 1)

  // Mostrar solo horas con etiqueta cada 2h para no saturar el eje X
  const tickFormatter = (hour) =>
    hour % 2 === 0 ? `${String(hour).padStart(2, "0")}h` : ""

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
          Picos de Venta por Hora
        </CardTitle>
      </CardHeader>
      <CardContent>
        {salesByHour.every((h) => h.totalRevenue === 0) ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">
            Sin datos para el período seleccionado
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesByHour} barSize={14}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tickFormatter={tickFormatter}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${formatCurrency(v, 0)}`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted)/0.4)" }} />
              <Bar dataKey="totalRevenue" radius={[4, 4, 0, 0]}>
                {salesByHour.map((entry, index) => {
                  const intensity = entry.totalRevenue / maxRevenue
                  // Opacidad proporcional al volumen — barra vacía = gris tenue
                  const opacity = entry.totalRevenue === 0 ? 0.15 : 0.4 + intensity * 0.6
                  return (
                    <Cell
                      key={index}
                      fill={
                        entry.totalRevenue === 0
                          ? "hsl(var(--muted-foreground))"
                          : "hsl(142 71% 45%)"
                      }
                      fillOpacity={opacity}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
