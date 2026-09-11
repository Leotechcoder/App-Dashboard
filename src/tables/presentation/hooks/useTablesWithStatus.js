import { useMemo } from "react"

export function getTableStatus(tableId, orders = []) {
  const openOrder = orders.find(
    (o) => String(o.tableId) === String(tableId) && ["pending", "ready-to-pay"].includes(o.status)
  )
  if (!openOrder) return { key: "available", label: "Disponible" }
  if (openOrder.status === "ready-to-pay")
    return { key: "ready-to-pay", label: "Lista para cobrar", order: openOrder }
  return { key: "occupied", label: "Ocupada", order: openOrder }
}

export function useTablesWithStatus(tables = [], orders = []) {
  return useMemo(
    () => tables.map((t) => ({ ...t, status: getTableStatus(t.id, orders) })),
    [tables, orders]
  )
}
