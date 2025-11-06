"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  LineChart,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const salesData = [
  { name: "Lun", ventas: 4200 },
  { name: "Mar", ventas: 3800 },
  { name: "Mié", ventas: 5200 },
  { name: "Jue", ventas: 6100 },
  { name: "Vie", ventas: 7000 },
  { name: "Sáb", ventas: 6500 },
  { name: "Dom", ventas: 4800 },
];

export default function DashboardHome() {
  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center px-6 py-10">
      {/* --- Header animado --- */}
      {/* <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          Bienvenido al Panel de Control
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Tu punto de partida para administrar, analizar y escalar tu negocio.
          Aquí encontrarás métricas clave, análisis de ventas y un resumen de tu
          actividad reciente.
        </p>
      </motion.div> */}

      {/* --- Cards métricas principales --- */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        <MetricCard
          icon={<DollarSign className="w-8 h-8 text-green-500" />}
          title="Ventas Totales"
          value="$45.200"
          description="en los últimos 7 días"
        />
        <MetricCard
          icon={<TrendingUp className="w-8 h-8 text-blue-500" />}
          title="Ganancia Neta"
          value="$12.400"
          description="incremento del 8% esta semana"
        />
        <MetricCard
          icon={<ShoppingCart className="w-8 h-8 text-yellow-500" />}
          title="Órdenes Cerradas"
          value="183"
          description="últimos 7 días"
        />
        <MetricCard
          icon={<Users className="w-8 h-8 text-purple-500" />}
          title="Clientes Nuevos"
          value="54"
          description="última semana"
        />
      </motion.div>

      {/* --- Gráfico de ventas --- */}
      {/* <motion.div
        className="w-full max-w-5xl mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-2xl shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart3 className="text-blue-600" /> Rendimiento de Ventas
            </CardTitle>
            <CardDescription>
              Evolución semanal de las ventas en tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb" }}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div> */}

      {/* --- Sección de features --- */}
      {/* <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        <FeatureCard
          icon={<Package className="w-10 h-10 text-blue-600" />}
          title="Gestión de Productos"
          description="Controla tus productos, variantes, precios y stock de forma centralizada."
        />
        <FeatureCard
          icon={<LineChart className="w-10 h-10 text-green-600" />}
          title="Análisis Inteligente"
          description="Visualiza métricas de rendimiento y detecta tendencias en tus ventas."
        />
        <FeatureCard
          icon={<Users className="w-10 h-10 text-purple-600" />}
          title="Clientes y Fidelización"
          description="Obtén insights sobre tus clientes y mejora su experiencia de compra."
        />
      </motion.div>

      <motion.div
        className="mt-20 text-center text-gray-500 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        🚀 Este panel sigue evolucionando — pronto podrás generar reportes
        automáticos, segmentar clientes y más.
      </motion.div> */}
    </div>
  );
}

const MetricCard = ({ icon, title, value, description }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-start hover:shadow-xl transition-all duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-sm text-gray-500">{description}</p>
  </motion.div>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300"
    whileHover={{ scale: 1.05 }}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);
