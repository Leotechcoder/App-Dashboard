import { motion } from "framer-motion"
import { TableCard } from "./TableCard"

export function TableGrid({ tables, onSelect, onEdit, onDelete }) {
  if (!tables.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
        <p className="font-medium text-foreground">No hay mesas para mostrar</p>
        <p className="mt-2 text-sm text-muted-foreground">Ajustá el filtro o agregá una mesa nueva.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {tables.map((table) => (
        <TableCard key={table.id} table={table} onSelect={onSelect} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </motion.div>
  )
}
