/**
 * ChartTooltip — tooltip reutilizable para todos los graficos Recharts
 *
 * Props de Recharts (pasados automáticamente via content={<ChartTooltip />}):
 *   active    boolean
 *   payload   array
 *   label     string | number
 *
 * Props adicionales opcionales:
 *   formatter   (value, name) => string   — formatea cada valor
 *   labelFormatter (label) => string      — formatea el label principal
 */
export const ChartTooltip = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}) => {
  if (!active || !payload?.length) return null

  const displayLabel = labelFormatter ? labelFormatter(label) : label

  return (
    <div className="rounded-lg border bg-[hsl(var(--chart-tooltip-bg))] border-[hsl(var(--chart-tooltip-border))] p-3 shadow-md text-xs space-y-1 min-w-[120px]">
      {displayLabel != null && (
        <p className="font-semibold text-[hsl(var(--chart-tooltip-text))] mb-1">
          {displayLabel}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="flex justify-between gap-4">
          <span className="text-[hsl(var(--muted-foreground))]">{entry.name}</span>
          <span className="font-medium">
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </p>
      ))}
    </div>
  )
}
