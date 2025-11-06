"use client";

import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const WelcomeHeader = () => {
  const username = useSelector((store) => store.users.username);

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center space-x-4 p-6">
          <div className="bg-indigo-100 p-3 rounded-xl shadow-sm">
            <LayoutDashboard className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-800">
              ¡Bienvenido, {username || "usuario"}!
            </CardTitle>
            <CardDescription className="text-slate-600 mt-1">
              Aquí tienes un resumen del rendimiento y las métricas de las ventas en la aplicación.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default WelcomeHeader;
