"use client";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const fadeDown = {
  hidden: { opacity: 0, y: -15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const WelcomeHeader = () => {
  const username = useSelector((store) => store.users.username);

  return (
    <motion.div variants={fadeDown}>
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader className="flex flex-row items-center space-x-4 p-6">
          <div className="bg-indigo-100 p-3 rounded-xl shadow-sm">
            <LayoutDashboard className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-indigo-600">
              ¡Bienvenido, {username || "usuario"}!
            </CardTitle>
            <CardDescription className="text-slate-600 mt-1">
              Aquí tienes un resumen del rendimiento de las ventas.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default WelcomeHeader;
