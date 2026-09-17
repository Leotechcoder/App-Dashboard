
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ClipboardList, Wallet } from "lucide-react"
import { useSelector } from "react-redux"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CloseCashRegisterDialog } from "../components/CloseCashRegisterDialog"
import { CashRegisterSummary } from "../components/CashRegisterSummary"
import { CashRegisterBanner } from "../components/CashRegisterBanner"
import OrderCard from "../components/OrderSalesSheet"
import OrdersPage from "@/orders/presentation/pages/OrdersPage"

import { useSalesData } from "../hooks/useSalesData"
import { useCashRegister } from "../hooks/useCashRegister"
import { useSalesHistory } from "../hooks/useSalesHistory"

import { useScrollLock } from "@/shared/hook/useScrollLock"
import { useScrollTo } from "@/shared/hook/useScrollTo"

/* ============================================================
   Animaciones
============================================================ */

const fadeSlide = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 10,
  },
  transition: {
    duration: 0.35,
    ease: "easeOut",
  },
}

/* ============================================================
   Componente principal
============================================================ */

export function SalesDashboardView() {
  const {
    cashRegister,
    cashRegisterAnalysis,
    sessionOrders,
  } = useSalesData()

  const { pendingOrders } = useSelector((state) => state.sales)

  const {
    handleOpenCashRegister,
    handleCloseCashRegister,
    loading: cashLoading,
  } = useCashRegister()

  const { updateFilters } = useSalesHistory()

  const [closeDialog, setCloseDialog] = useState(false)
  const [selectedOrderCard, setSelectedOrderCard] = useState(null)

  const {
    setScrollTo,
    tableRef,
  } = useScrollTo({ offset: 20 })

  useScrollLock(!!selectedOrderCard || closeDialog)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  /* ==========================================================
     Handlers de caja
  ========================================================== */

  const handleOpen = async (initialAmount) => {
    const result = await handleOpenCashRegister(initialAmount)

    if (result?.type?.includes("fulfilled")) {
      toast.info(`Caja abierta con $${initialAmount.toFixed(2)}`)
    } else {
      toast.error("No se pudo abrir la caja")
    }
  }

  const handleClose = async (finalAmount) => {
    await handleCloseCashRegister(finalAmount)

    setCloseDialog(false)

    await updateFilters({
      startDate: new Date().setHours(0, 0, 0, 0),
      endDate: new Date().setHours(23, 59, 59, 999),
    })
  }

  const isCashRegisterOpen = cashRegister?.status === "open"

  return (
    <main className="min-h-[95vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">

        <motion.section
          key="salesDashboard"
          {...fadeSlide}
          className="w-full"
        >

          {/* ==================================================
              Header
          =================================================== */}

          <header className="mb-5 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Gestión de Caja
                </h1>

                <p className="text-xs text-muted-foreground">
                  Administrá la caja, las órdenes pendientes y las ventas.
                </p>
              </div>

            </div>

            {isCashRegisterOpen && (
              <Button
                variant="destructive"
                onClick={() => setCloseDialog(true)}
              >
                Cerrar Caja
              </Button>
            )}
          </header>

          {/* ==================================================
              Caja cerrada
          =================================================== */}

          {!isCashRegisterOpen && (
            <motion.section
              {...fadeSlide}
              className="px-6"
            >
              <CashRegisterBanner
                onOpen={handleOpen}
                loading={cashLoading}
              />
            </motion.section>
          )}

          {/* ==================================================
              Resumen de caja
          =================================================== */}

          {isCashRegisterOpen && cashRegister && (
            <motion.section
              {...fadeSlide}
              className="px-6"
            >
              <CashRegisterSummary
                cashRegister={cashRegister}
                analysis={cashRegisterAnalysis}
              />
            </motion.section>
          )}

          {/* ==================================================
              Tabs
          =================================================== */}

          <motion.section
            {...fadeSlide}
            className="mt-6 px-6"
          >
            <Tabs
              defaultValue="pending"
              className="space-y-3"
            >
              <TabsList className="flex flex-wrap gap-2">

                <TabsTrigger
                  value="pending"
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    md:flex-none
                    data-[state=inactive]:border-accent
                    data-[state=inactive]:hover:bg-accent/90
                    data-[state=active]:bg-primary/5
                    data-[state=active]:text-primary
                  "
                >
                  <ClipboardList className="h-4 w-4" />

                  Órdenes Pendientes

                  {pendingOrders.length > 0 && (
                    <span
                      className="
                        ml-1
                        rounded-full
                        border
                        border-accent
                        bg-accent
                        px-2
                        py-0.5
                        text-xs
                        text-primary
                      "
                    >
                      {pendingOrders.length}
                    </span>
                  )}
                </TabsTrigger>

              </TabsList>

              {/* ==================================================
                  Órdenes pendientes
              =================================================== */}

              <TabsContent value="pending">
                <motion.div {...fadeSlide}>
                  <section
                    ref={tableRef}
                    className="w-full"
                  >
                    <OrdersPage
                      setScrollTo={setScrollTo}
                    />
                  </section>
                </motion.div>
              </TabsContent>

            </Tabs>
          </motion.section>

        </motion.section>
      </AnimatePresence>

      {/* ========================================================
          Dialog cierre de caja
      ========================================================= */}

      <CloseCashRegisterDialog
        open={closeDialog}
        onOpenChange={setCloseDialog}
        onConfirm={handleClose}
        cashRegister={cashRegister}
        orders={sessionOrders}
      />

      {/* ========================================================
          Order Sheet
      ========================================================= */}

      <AnimatePresence>
        {selectedOrderCard && (
          <motion.div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-end
              bg-background/40
              px-4
              backdrop-blur-sm
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
                w-full
                max-w-5xl
                max-h-[95vh]
                overflow-hidden
                rounded-lg
                bg-card
                shadow-xl
              "
              initial={{
                scale: 0.9,
                x: 100,
              }}
              animate={{
                scale: 1,
                x: 0,
              }}
              exit={{
                scale: 0.9,
                x: 100,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 18,
              }}
            >
              <OrderCard
                order={selectedOrderCard}
                onBack={() => setSelectedOrderCard(null)}
                className="h-[calc(100dvh-145px)] overflow-y-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
