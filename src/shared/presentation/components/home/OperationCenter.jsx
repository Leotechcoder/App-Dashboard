import { CashStatusBlock } from "./CashStatusBlock"
import { PendingOrdersBlock } from "./PendingOrdersBlock"
import { DaySalesBlock } from "./DaySalesBlock"
import { AlertsBlock } from "./AlertsBlock"

export function OperationCenter() {
  return (
    <section className="space-y-6 px-5 ">

      <div>
        <h2 className="text-xl font-bold">
          Centro Operativo
        </h2>

        {/* <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Estado general del negocio en tiempo real.
        </p> */}
      </div>

      <div
        className="
          grid
          gap-4
          grid-cols-1
          md:grid-cols-2
        "
      >
        <CashStatusBlock />

        <PendingOrdersBlock />

        <DaySalesBlock />

        <AlertsBlock />
      </div>
    </section>
  )
}