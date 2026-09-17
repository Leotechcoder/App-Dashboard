
import { motion } from "framer-motion"
import {
  Activity,
} from "lucide-react"

import { CashStatusBlock } from "./CashStatusBlock"
import { PendingOrdersBlock } from "./PendingOrdersBlock"
import { DaySalesBlock } from "./DaySalesBlock"
import { AlertsBlock } from "./AlertsBlock"

const sectionAnimation = {
  hidden: {
    opacity: 0,
    y: 10,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: 0.1,
      ease: "easeOut",
    },
  },
}

export function OperationCenter() {
  return (
    <motion.section
      variants={sectionAnimation}
      initial="hidden"
      animate="show"
      className="px-6 pb-6"
    >
      {/* =====================================================
          Encabezado
      ====================================================== */}

      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Centro Operativo
            </h2>

            <p className="text-xs text-muted-foreground">
              Información clave de tu negocio en tiempo real.
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          Bloques operativos
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CashStatusBlock />

        <PendingOrdersBlock />

        <DaySalesBlock />

        <AlertsBlock />
      </div>
    </motion.section>
  )
}
