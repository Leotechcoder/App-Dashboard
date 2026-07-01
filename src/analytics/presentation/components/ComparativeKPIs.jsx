import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, GitCompare } from "lucide-react"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

/**
 * Calcula la variación porcentual entre dos valores.
 * Retorna null si el valor base es 0 (no se puede calcular).
 */
function calcVariation(base, current) {
  if (!base || base === 0) return null
  return ((current - base) / base) * 100
}

function VariationBadge({ pct }) {
  if (pct === null) return (
    <span className="flex items-center gap-0.5 text-xs text-[hsl(var(--muted-foreground))]">
      <Minus className="h-3 w-3" /> Sin base
    </span>
  )

  const isPos = pct >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${
      isPos ? "text-[hsl(var(--green))]" : "text-[hsl(var(--destructive))]"
    }`}>
      {isPos
        ? <TrendingUp className="h-3 w-3" />
        : <TrendingDown className="h-3 w-3" />
      }
      {isPos ? "+" : ""}{pct.toFixed(1)}%
    </span>
  )
}

function KPICard({ label, period1Value, period2Value, format = "currency" }) {
  const variation = calcVariation(period1Value, period2Value)
  const fmt = (v) => format === "currency"
    ? `$${formatCurrency(v, 0)}`
    : String(v)

  return (
    <Card className="border-[hsl(var(--border))]">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Período 2 (actual) */}
        <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
          {fmt(period2Value)}
        </p>

        {/* Variación */}
        <VariationBadge pct={variation} />

        {/* Período 1 (base) */}
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          vs {fmt(period1Value)} período anterior
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * ComparativeKPIs
 *
 * Muestra 3 KPIs comparativos (ventas, órdenes, ticket promedio)
 * entre dos períodos seleccionados por el usuario.
 * Lee de analytics.comparison (slice Redux).
 */
export function ComparativeKPIs() {
  const comparison = useSelector((state) => state.analytics.comparison)
  const loading    = useSelector((state) => state.analytics.loading)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-[hsl(var(--muted))] animate-pulse" />
                <div className="h-8 w-32 rounded bg-[hsl(var(--muted))] animate-pulse" />
                <div className="h-3 w-20 rounded bg-[hsl(var(--muted))] animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!comparison) return (
    <Card className="border-dashed">
      <CardContent className="py-8 text-center">
        <GitCompare className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--muted-foreground))]" />
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Seleccioná dos períodos para ver la comparativa
        </p>
      </CardContent>
    </Card>
  )

  const { period1, period2 } = comparison

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KPICard
        label="Ventas totales"
        period1Value={period1.totalRevenue}
        period2Value={period2.totalRevenue}
        format="currency"
      />
      <KPICard
        label="Órdenes cerradas"
        period1Value={period1.ordersCount}
        period2Value={period2.ordersCount}
        format="number"
      />
      <KPICard
        label="Ticket promedio"
        period1Value={period1.avgTicket}
        period2Value={period2.avgTicket}
        format="currency"
      />
    </div>
  )
}
