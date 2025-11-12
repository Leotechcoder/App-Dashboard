import { motion } from "framer-motion";
import { BarChart3, ShoppingBag } from "lucide-react";
//Componentes shadcn
import { useSalesData } from "@/sales/presentation/hooks/useSalesData.js";
import { useSalesHistory } from "@/sales/presentation/hooks/useSalesHistory.js";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
//Funciones
import { formatDateToArg } from "@/shared/utils/formatDateToArg";
//Componentes
import { PaymentMethodsChart } from "./SalesMethodsChart";
import SalesChartHome from "./SalesTrendChart";
import TopProductsTable from "./TopProductsTable";
import { useEffect } from "react";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";

export default function SalesDashboardHome() {
  const { totalEarnings, chartData, loading: dataLoading, filters, orders } = useSalesData();
  const { updateFilters } = useSalesHistory();
  

  const transformOrdersDates = chartData.map((order) => ({
    ...order,
    date: formatDateToArg(order.date),
  }));

  const handleFilterChange = (newFilter) =>
    updateFilters({ dateRange: newFilter });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.10 } }, 
  };

  const totalOrders = orders?.length || 0;
  const isLoading =  dataLoading;

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-indigo-50 text-gray-800 p-6 md:p-10 space-y-10 border-slate-200 shadow-sm rounded-xl"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center space-y-2 flex justify-between w-full"
      >
        <div>
          <h3 className="text-3xl md:text-2xl font-semibold text-indigo-400">
            Ventas recientes
          </h3>
        </div>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm rounded-md p-2 focus:outline-none"
        >
          <option value="today">Hoy</option>
          <option value="week">Última Semana</option>
          <option value="month">Último Mes</option>
        </select>
      </motion.div>

      {/* Métricas principales */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div variants={fadeInUp}>
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

        <motion.div variants={fadeInUp}>
          <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Órdenes Cerradas</CardTitle>
              <ShoppingBag className="h-5 w-5 text-violet-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-violet-600">{isLoading ? "..." : totalOrders}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Gráfico de ventas totales */}
      <motion.div
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
        variants={fadeInUp}
      >
        <SalesChartHome data={transformOrdersDates} />
      </motion.div>

      {/* Gráfico de métodos de pago */}
      <motion.div variants={fadeInUp}>
        <PaymentMethodsChart />
      </motion.div>

      {/* Productos más vendidos */}
      <motion.div variants={fadeInUp}>
        <TopProductsTable orders={orders} />
      </motion.div>
    </motion.div>
  );
}
