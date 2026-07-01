import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

/**
 * TopProductsWidget
 * Tabla de los N productos más vendidos del período.
 * Lee de analytics.topProducts (slice Redux).
 */
export function TopProductsWidget() {
  const topProducts = useSelector((state) => state.analytics.topProducts)
  const loading     = useSelector((state) => state.analytics.loading)

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" /> Top Productos
        </CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 rounded bg-[hsl(var(--muted))] animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[hsl(var(--green))]" />
          Top Productos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">
            Sin datos para el período seleccionado
          </p>
        ) : (
          <div className="space-y-2">
            {topProducts.map((product, index) => {
              const maxQty = topProducts[0]?.quantity || 1
              const pct    = Math.round((product.quantity / maxQty) * 100)

              return (
                <div key={product.productName} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge
                        variant="outline"
                        className="shrink-0 w-6 h-6 p-0 flex items-center justify-center text-xs"
                      >
                        {index + 1}
                      </Badge>
                      <span className="truncate text-[hsl(var(--foreground))]">
                        {product.productName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        x{product.quantity}
                      </span>
                      <span className="text-xs font-semibold text-[hsl(var(--green))]">
                        ${formatCurrency(product.totalRevenue, 0)}
                      </span>
                    </div>
                  </div>
                  {/* Barra de progreso relativa al #1 */}
                  <div className="h-1.5 rounded-full bg-[hsl(var(--muted))]">
                    <div
                      className="h-1.5 rounded-full bg-[hsl(var(--green))] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
