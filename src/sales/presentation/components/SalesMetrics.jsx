import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ReceiptText, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

const metricVariants = {
  success: {
    card: "bg-[hsl(var(--metric-success-bg))] border-border",
    icon: "text-[hsl(var(--metric-success-icon))]",
  },
  primary: {
    card: "bg-[hsl(var(--metric-primary-bg))] border-border",
    icon: "text-[hsl(var(--metric-primary-icon))]",
  },
  purple: {
    card: "bg-[hsl(var(--metric-purple-bg))] border-border",
    icon: "text-[hsl(var(--metric-purple-icon))]",
  },
}

export function SalesMetrics({ totalEarnings, orders }) {
  const count = orders?.length ?? 0

  const averageTicket =
    count > 0
      ? totalEarnings / count
      : 0

  const metrics = [
    {
      label: "Total de Ganancias",
      value: `$${formatCurrency(totalEarnings, 0)}`,
      footer: `De ${count} ${count === 1 ? "orden cerrada" : "órdenes cerradas"}`,
      variant: "success",
      icon: DollarSign,
    },
    {
      label: "Ticket Promedio",
      value: `$${formatCurrency(averageTicket, 0)}`,
      footer:
        count > 0
          ? "Por orden en el período"
          : "Sin órdenes aún",
      variant: "primary",
      icon: ReceiptText,
    },
    {
      label: "Órdenes Cerradas",
      value: count,
      footer: "Pagadas o entregadas",
      variant: "purple",
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const variant = metricVariants[metric.variant]

        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.25,
              delay: index * 0.08,
            }}
          >
            <Card
              className={cn(
                "border shadow-sm transition-transform hover:scale-[1.02]",
                variant.card
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>

                <Icon
                  className={cn(
                    "h-4 w-4",
                    variant.icon
                  )}
                />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {metric.footer}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}