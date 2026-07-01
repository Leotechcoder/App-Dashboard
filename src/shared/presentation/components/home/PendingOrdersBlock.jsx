import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, ArrowRight, AlertTriangle } from "lucide-react"
import { getMinutesAgo, getAgeColor, formatMinutesAgo } from "@/shared/utils/formatDateToArg"

const DOT_CLASSES = {
  green:       "bg-[hsl(var(--green))]",
  yellow:      "bg-[hsl(var(--yellow))]",
  destructive: "bg-[hsl(var(--destructive))]",
}

/**
 * PendingOrdersBlock
 * Muestra cantidad de pendientes, cuántas son urgentes y las 3 más antiguas.
 * Lee de sales.pendingOrders — sin nuevas llamadas API.
 */
export function PendingOrdersBlock() {
  const navigate = useNavigate()
  const pendingOrders = useSelector((state) => state.sales.pendingOrders)

  const urgent = pendingOrders.filter((o) => getMinutesAgo(o.createdAt) > 20)
  const oldest = [...pendingOrders]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(0, 3)

  return (
    <Card className={`h-full ${urgent.length > 0
      ? "border-[hsl(var(--destructive)/0.5)]"
      : "border-[hsl(var(--border))]"}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Pedidos Pendientes
        </CardTitle>
        <div className="flex items-center gap-1.5">
          {urgent.length > 0 && (
            <Badge className="bg-[hsl(var(--destructive))] text-white gap-1">
              <AlertTriangle className="h-3 w-3" />
              {urgent.length} urgente{urgent.length > 1 ? "s" : ""}
            </Badge>
          )}
          <Badge variant="outline">{pendingOrders.length} total</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {oldest.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))] py-2">
            Sin pedidos pendientes 🎉
          </p>
        ) : (
          <ul className="space-y-1.5">
            {oldest.map((order) => {
              const mins     = getMinutesAgo(order.createdAt)
              const colorKey = getAgeColor(mins)
              return (
                <li key={order.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${DOT_CLASSES[colorKey]}`} />
                    <span className="text-[hsl(var(--foreground))]">
                      #{order.id} — {order.userName || "Cliente"}
                    </span>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formatMinutesAgo(mins)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 gap-1.5 hover:cursor-pointer"
          onClick={() => navigate("/admin/ventas")}
        >
          Ver todas <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  )
}