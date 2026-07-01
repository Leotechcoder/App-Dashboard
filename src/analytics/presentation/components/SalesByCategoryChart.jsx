import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { LayoutGrid } from "lucide-react"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

// Colores usando variables CSS del tema no son compatibles con recharts
// → usamos una paleta fija coherente con el diseño
const COLORS = [
  "hsl(142 71% 45%)",  // green
  "hsl(217 91% 60%)",  // blue
  "hsl(262 83% 58%)",  // purple
  "hsl(38 92% 50%)",   // yellow/amber
  "hsl(0 84% 60%)",    // red
  "hsl(192 91% 36%)",  // teal
  "hsl(24 95% 53%)",   // orange
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border bg-[hsl(var(--card))] p-3 shadow-md text-xs space-y-1">
      <p className="font-semibold text-[hsl(var(--foreground))]">{d.category}</p>
      <p className="text-[hsl(var(--muted-foreground))]">
        Unidades: <span className="font-medium text-[hsl(var(--foreground))]">{d.quantity}</span>
      </p>
      <p className="text-[hsl(var(--muted-foreground))]">
        Revenue: <span className="font-medium text-[hsl(var(--green))]">${formatCurrency(d.totalRevenue, 0)}</span>
      </p>
    </div>
  )
}

/**
 * SalesByCategoryChart
 * Pie chart de ventas agrupadas por producto/categoría.
 * Lee de analytics.salesByCategory (slice Redux).
 */
export function SalesByCategoryChart() {
  const salesByCategory = useSelector((state) => state.analytics.salesByCategory)
  const loading         = useSelector((state) => state.analytics.loading)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" /> Ventas por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded bg-[hsl(var(--muted))] animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // Limitar a top 7 para legibilidad
  const data = salesByCategory.slice(0, 7)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-[hsl(var(--primary))]" />
          Ventas por Producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">
            Sin datos para el período seleccionado
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                dataKey="totalRevenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-[hsl(var(--foreground))]">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
