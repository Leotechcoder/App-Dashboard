import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, Package } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                    STYLES                                  */
/* -------------------------------------------------------------------------- */

const metricVariants = {
  success: {
    card: `
      bg-[hsl(var(--green)/0.5)]
      border border-[hsl(var(--border))]
      hover:contrast-120
    `,
    icon: "text-[hsl(var(--muted-foreground))]",
    label: "text-[hsl(var(--muted-foreground))]",
  },
  warning: {
    card: `
      bg-[hsl(var(--purpure)/0.5)]
      border border-[hsl(var(--border))]
      hover:contrast-110
    `,
    icon: "text-[hsl(var(--muted-foreground))]",
    label: "text-[hsl(var(--foreground))]",
  },
  info: {
    card: `
      bg-[hsl(var(--primary)/0.4)]
      border border-[hsl(var(--border))]
      hover:contrast-140
    `,
    icon: "text-[hsl(var(--muted-foreground))]",
    label: "text-[hsl(var(--muted-foreground))]",
  },
};

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export function SalesMetrics({ totalEarnings, orders }) {
  const metrics = [
    {
      label: "Total de Ganancias",
      value: `$${totalEarnings.toLocaleString("es-AR")}`,
      variant: "success",
      icon: DollarSign,
      footer: `De ${orders.length} órdenes cerradas`,
    },
    {
      label: "Fecha Actual",
      value: format(new Date(), "dd MMM", { locale: es }),
      variant: "warning",
      icon: Calendar,
      footer: format(new Date(), "yyyy", { locale: es }),
    },
    {
      label: "Órdenes Cerradas",
      value: orders.length,
      variant: "info",
      icon: Package,
      footer: "Pagadas o entregadas",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {metrics.map((metric, index) => {
        const styles = metricVariants[metric.variant];
        const Icon = metric.icon;

        return (
          <motion.div
            key={metric.label}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "transition-transform hover:scale-[1.03] shadow-sm",
                styles.card
              )}
            >
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>

                <Icon className={cn("h-4 w-4", styles.icon)} />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {metric.footer}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
