import { useMemo } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShoppingBag, ReceiptText } from "lucide-react"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

/**
 * DaySalesBlock
 * KPIs del día: total vendido, cantidad de órdenes, ticket promedio.
 * Calcula en el cliente filtrando sales.closedOrders por paid_at === hoy.
 * No necesita un endpoint nuevo — los datos ya están en el slice.
 */
export function DaySalesBlock() {
  const closedOrders = useSelector((state) => state.sales.closedOrders)

  const { total, count, ticket } = useMemo(() => {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayOrders = closedOrders.filter((o) => {
      const paidAt = o.paidAt || o.paid_at || o.createdAt
      return paidAt && new Date(paidAt) >= todayStart
    })

    const total  = todayOrders.reduce((s, o) => s + (Number(o.totalAmount || o.total) || 0), 0)
    const count  = todayOrders.length
    const ticket = count > 0 ? total / count : 0

    return { total, count, ticket }
  }, [closedOrders])

  const stats = [
    { label: "Vendido hoy",     value: `$${formatCurrency(total, 0)}`,  icon: TrendingUp,  color: "text-[hsl(var(--green))]" },
    { label: "Órdenes",         value: count,                            icon: ShoppingBag, color: "text-[hsl(var(--primary))]" },
    { label: "Ticket promedio", value: `$${formatCurrency(ticket, 0)}`,  icon: ReceiptText, color: "text-[hsl(var(--purpure))]" },
  ]

  return (
    <Card className="h-full border-[hsl(var(--border))]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Ventas del Día
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{label}</p>
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}