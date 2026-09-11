import { Pencil, Trash2, Users, Utensils } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const STATUS_BADGE = {
  available: "bg-green/10 text-green border-green/30",
  occupied: "bg-yellow/10 text-yellow border-yellow/30",
  "ready-to-pay": "bg-blue/10 text-blue border-blue/30",
}

export function TableCard({ table, onSelect, onEdit, onDelete }) {
  const isBusy = table.status.key !== "available"

  return (
    <Card
      onClick={() => onSelect(table)}
      className="group relative cursor-pointer transition hover:border-primary/50 hover:shadow-md"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-14 items-center justify-center border-2 border-primary/50 bg-primary/10 text-xl font-semibold text-primary ${
                table.shape === "round" ? "rounded-full" : "rounded-xl"
              }`}
            >
              {table.number}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Mesa {table.number}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {table.shape === "round" ? "Redonda" : "Cuadrada"}
              </p>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              aria-label={`Editar mesa ${table.number}`}
              onClick={(e) => { e.stopPropagation(); onEdit(table) }}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground hover:cursor-pointer"
            >
              <Pencil className="size-4" />
            </button>
            <button
              aria-label={`Eliminar mesa ${table.number}`}
              disabled={isBusy}
              title={isBusy ? "No podés eliminar una mesa ocupada" : "Eliminar mesa"}
              onClick={(e) => { e.stopPropagation(); onDelete(table) }}
              className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30 hover:cursor-pointer"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" /> Hasta {table.capacity} personas
          </div>
          <Badge variant="outline" className={STATUS_BADGE[table.status.key]}>
            {table.status.label}
          </Badge>
        </div>

        {isBusy && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Utensils className="size-3.5" /> Orden abierta
          </div>
        )}
      </CardContent>
    </Card>
  )
}
