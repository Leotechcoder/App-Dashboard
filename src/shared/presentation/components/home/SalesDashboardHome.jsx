import { motion } from "framer-motion";
import { BarChart3, ShoppingBag } from "lucide-react";
import { useSalesData } from "@/sales/presentation/hooks/useSalesData.js";
import { useSalesHistory } from "@/sales/presentation/hooks/useSalesHistory.js";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { formatDateToArg } from "@/shared/utils/formatDateToArg";
import { PaymentMethodsChart } from "./SalesMethodsChart";
import SalesChartHome from "./SalesTrendChart";
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
  const { totalEarnings, chartData, loading: dataLoading, filters, orders } = useSalesData();
  const { updateFilters } = useSalesHistory();
  

  const transformOrdersDates = chartData.map((order) => ({
    ...order,
    date: formatDateToArg(order.date),
  }));

  const handleFilterChange = (newFilter) =>
    updateFilters({ dateRange: newFilter });

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.4 } },
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const totalOrders = orders?.length || 0;
  const isLoading = dataLoading;

  return (
    <motion.div
      className="min-h-screen w-full bg-transparent text-gray-800 p-6 space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="text-center space-y-2 flex justify-between w-full bg-gray-50 rounded-xl border border-gray-400 shadow-sm p-5"
      >
        <h3 className="text-3xl md:text-2xl font-semibold text-indigo-400">
          Ventas recientes
        </h3>

        <Select value={filters.dateRange} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-fit border border-gray-300 bg-gray-50 text-sm rounded-md p-2">
            <SelectValue placeholder="Seleccionar rango" />
          </SelectTrigger>
          <SelectContent className={'bg-background'}>
            <SelectItem value="today">Hoy</SelectItem>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mes</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Métricas */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div variants={fadeUp}>
          <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Ventas</CardTitle>
              <BarChart3 className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">
                {isLoading ? "Cargando..." : `$${formatCurrency(totalEarnings, 0)}`}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Órdenes Cerradas</CardTitle>
              <ShoppingBag className="h-5 w-5 text-violet-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-violet-600">
                {isLoading ? "..." : totalOrders}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={fadeUp}>
        <SalesChartHome data={transformOrdersDates} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <PaymentMethodsChart />
      </motion.div>

      <motion.div variants={fadeUp}>
        <TopProductsTable orders={orders} />
      </motion.div>
    </motion.div>
  );
}
