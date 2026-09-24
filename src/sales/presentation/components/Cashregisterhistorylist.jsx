
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { History, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatCurrency } from "@/shared/utils/formatPriceLocal"

function getDurationLabel(openedAt, closedAt) {
  if (!openedAt || !closedAt) return "—"
  const ms = new Date(closedAt) - new Date(openedAt)
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return `${h}h ${m}m`
}

/**
 * CashRegisterHistoryList
 *
 * Lista de cierres de caja pasados (solo cajas con status "closed"),
 * ordenados del más reciente al más antiguo. Al hacer click en una fila
 * se abre el detalle completo del cierre vía onSelect(register).
 *
 * Props:
 *  - history: CashRegisterEntity[] — típicamente state.sales.cashRegisterHistory
 *  - onSelect: (register) => void
 */
export function CashRegisterHistoryList({ history = [], onSelect }) {
  const closedRegisters = [...history]
    .filter((r) => r.status === "closed" && r.closedAt)
    .sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <History className="h-4 w-4 text-[hsl(var(--primary))]" />
          Historial de Cierres de Caja
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {closedRegisters.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Todavía no hay cierres de caja registrados
          </p>
        ) : (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apertura</TableHead>
                  <TableHead>Cierre</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Abierta por</TableHead>
                  <TableHead>Cerrada por</TableHead>
                  <TableHead className="text-right">Monto Inicial</TableHead>
                  <TableHead className="text-right">Monto Final</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {closedRegisters.map((register) => (
                  <TableRow
                    key={register.id}
                    onClick={() => onSelect(register)}
                    className="cursor-pointer hover:bg-muted group"
                  >
                    <TableCell>
                      {format(new Date(register.openedAt), "dd MMM yyyy, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(register.closedAt), "dd MMM yyyy, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getDurationLabel(register.openedAt, register.closedAt)}
                      </Badge>
                    </TableCell>
                    <TableCell>{register.openedBy}</TableCell>
                    <TableCell>{register.closedBy || "—"}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${formatCurrency(register.initialAmount)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green">
                      {register.finalAmount != null ? `$${formatCurrency(register.finalAmount)}` : "—"}
                    </TableCell>
                    <TableCell className="w-8">
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}