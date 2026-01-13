"use client";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const fadeDown = {
  hidden: { opacity: 0, y: -15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const WelcomeHeader = () => {
  const username = useSelector((store) => store.users.username);

  return (
    <motion.div variants={fadeDown}>
      <Card
        className="
          bg-[hsl(var(--background))]
          text-[hsl(var(--foreground))]
          border-none
          shadow-none
        "
      >
        <CardHeader
          className="
            flex flex-row items-center gap-4 p-6
          "
        >
          {/* ICON */}
          <div
            className="
              rounded-xl p-3
              bg-[hsl(var(--accent))]
              text-[hsl(var(--blue))]
              shadow-sm
            "
          >
            <LayoutDashboard className="w-7 h-7" />
          </div>

          {/* TEXT */}
          <div>
            <CardTitle
              className="
                text-2xl font-semibold
                text-[hsl(var(--foreground))]
              "
            >
              ¡Bienvenido, {username || "usuario"}!
            </CardTitle>

            <CardDescription
              className="
                mt-1
                text-[hsl(var(--muted-foreground))]
              "
            >
              Aquí tienes un resumen del rendimiento de las ventas.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default WelcomeHeader;
