import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, Package } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const metricStyles = {
  green: "bg-green-50 border border-green-300 hover:bg-green-100 shadow-md",
  yellow: "bg-yellow-50 border border-yellow-300 hover:bg-yellow-100 shadow-md",
  blue: "bg-blue-50 border border-blue-300 hover:bg-blue-100 shadow-md",
};

export function SalesMetrics({ totalEarnings, orders }) {

  const metrics = [
    {
      label: "Total de Ganancias",
      value: `$${totalEarnings.toLocaleString("es-AR")}`,
      color: "green",
      icon: <DollarSign className="h-4 w-4 text-green-700" />,
      footer: `De ${orders.length} órdenes cerradas`,
    },
    {
      label: "Fecha Actual",
      value: format(new Date(), "dd MMM", { locale: es }),
      color: "yellow",
      icon: <Calendar className="h-4 w-4 text-yellow-700" />,
      footer: format(new Date(), "yyyy", { locale: es }),
    },
    {
      label: "Órdenes Cerradas",
      value: orders.length,
      color: "blue",
      icon: <Package className="h-4 w-4 text-blue-700" />,
      footer: "Pagadas o entregadas",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, delay: i * 0.1 }}
        >
          <Card className={cn("transition hover:scale-[1.03]", metricStyles[m.color])}>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{m.label}</CardTitle>
              {m.icon}
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
              <p className="text-xs text-muted-foreground">{m.footer}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
