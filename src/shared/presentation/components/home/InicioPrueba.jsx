"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSalesData } from "@/sales/presentation/hooks/useSalesData.js";
import { useSalesHistory } from "@/sales/presentation/hooks/useSalesHistory.js";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Banknote, BarChart3, CreditCard, ShoppingBag } from "lucide-react";

export default function SalesDashboardWeek() {
  const {
    totalEarnings,
    chartData,
    cashRegisterAnalysis,
    loading: dataLoading,
  } = useSalesData();

  const { updateFilters, refreshData, orders, cashRegisterHistory, loading } = useSalesHistory();

  // ⚙️ Forzar que el filtro global sea "week" al montar
  useEffect(() => {
    updateFilters({ dateRange: "week" });
    refreshData();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const totalOrders = orders?.length || 0;
  const isLoading = loading || dataLoading;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-indigo-50 text-gray-800 p-6 md:p-10 space-y-10 rounded-lg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600">
          Ventas de la Semana
        </h1>
        <p className="text-sm text-gray-500">
          Resumen automático de los últimos 7 días
        </p>
      </motion.div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total ventas */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Ventas</CardTitle>
              <BarChart3 className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">
                {isLoading ? "Cargando..." : `$${totalEarnings.toLocaleString("es-AR")}`}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Órdenes cerradas */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
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

        {/* Caja esperada */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Caja Esperada</CardTitle>
              <Banknote className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">
                {cashRegisterAnalysis?.expectedFinalAmount
                  ? `$${cashRegisterAnalysis.expectedFinalAmount.toLocaleString("es-AR")}`
                  : "$0"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Última actualización */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Última Actualización</CardTitle>
              <CreditCard className="h-5 w-5 text-rose-500" />
            </CardHeader>
            <CardContent>
              <p className="text-lg text-rose-500 font-semibold">
                {cashRegisterAnalysis
                  ? new Date(cashRegisterAnalysis.lastUpdate).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gráfico semanal */}
      <motion.div
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h3 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-500" /> Tendencia de Ventas Semanales
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: "#64748b" }} />
              <YAxis stroke="#94a3b8" tick={{ fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#1e293b",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#ec4899", r: 4 }}
                activeDot={{ r: 7, stroke: "#6366f1", fill: "#ec4899" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Caja actual */}
      <motion.div
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h3 className="text-lg font-semibold text-emerald-600 mb-4 flex items-center gap-2">
          <Banknote className="h-5 w-5 text-emerald-500" /> Detalle de Caja Activa
        </h3>
        {cashRegisterAnalysis ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Efectivo</p>
              <p className="text-xl font-semibold text-emerald-600">
                ${cashRegisterAnalysis.expectedCashAmount.toLocaleString("es-AR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Débito</p>
              <p className="text-xl font-semibold text-indigo-600">
                ${cashRegisterAnalysis.expectedDebitAmount.toLocaleString("es-AR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Crédito</p>
              <p className="text-xl font-semibold text-violet-600">
                ${cashRegisterAnalysis.expectedCreditAmount.toLocaleString("es-AR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transferencia</p>
              <p className="text-xl font-semibold text-rose-500">
                ${cashRegisterAnalysis.expectedTransferAmount.toLocaleString("es-AR")}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay una caja activa actualmente.</p>
        )}
      </motion.div>
    </div>
  );
}
