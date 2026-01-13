import { motion } from "framer-motion";
import { BarChart3, ShoppingBag } from "lucide-react";
import { useSalesData } from "@/sales/presentation/hooks/useSalesData.js";
import { useSalesHistory } from "@/sales/presentation/hooks/useSalesHistory.js";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { formatDateToArg } from "@/shared/utils/formatDateToArg";
import { PaymentMethodsChart } from "./SalesMethodsChart";
import TopProductsTable from "./TopProductsTable";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SalesDashboardHome() {
  const { totalEarnings, chartData, loading, filters, orders } = useSalesData();
  const { updateFilters } = useSalesHistory();

  const handleFilterChange = (newFilter) =>
    updateFilters({ dateRange: newFilter });

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const totalOrders = orders?.length || 0;

  return (
    <motion.div
      className="
        min-h-screen w-full p-6 space-y-6
        bg-[hsl(var(--background))]
        text-[hsl(var(--foreground))]
      "
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="
          flex items-center justify-between
          rounded-xl p-5
          border
          bg-[hsl(var(--background-unit))]
          border-[hsl(var(--border))]
        "
      >
        <h3 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
          Ventas recientes
        </h3>

        <Select value={filters.dateRange} onValueChange={handleFilterChange}>
          <SelectTrigger
            className="
              w-fit rounded-md p-2 text-sm
              border
              bg-[hsl(var(--background-unit-2))]
              border-[hsl(var(--border))]
            "
          >
            <SelectValue placeholder="Seleccionar rango" />
          </SelectTrigger>

          <SelectContent className="bg-[hsl(var(--background-unit-2))]">
            <SelectItem value="today">Hoy</SelectItem>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mes</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Métricas */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total ventas */}
        <motion.div variants={fadeUp}>
          <Card
            className="
              border shadow-sm transition hover:shadow-md
              bg-[hsl(var(--background-unit))]
              border-[hsl(var(--border))]
              text-[hsl(var(--foreground))]
            "
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">
                Total de Ventas
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-[hsl(var(--primary))]">
                {loading ? "Cargando..." : `$${formatCurrency(totalEarnings, 0)}`}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Órdenes */}
        <motion.div variants={fadeUp}>
          <Card
            className="
              border shadow-sm transition hover:shadow-md
              bg-[hsl(var(--background-unit))]
              border-[hsl(var(--border))]
              text-[hsl(var(--foreground))]
            "
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">
                Órdenes Cerradas
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-[hsl(var(--primary))]" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-[hsl(var(--primary))]">
                {loading ? "..." : totalOrders}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={fadeUp}>
        <PaymentMethodsChart />
      </motion.div>

      <motion.div variants={fadeUp}>
        <TopProductsTable orders={orders} />
      </motion.div>
    </motion.div>
  );
}
