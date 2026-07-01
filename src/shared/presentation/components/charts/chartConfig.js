/**
 * chartConfig — constantes y helpers compartidos para Recharts
 * Importar en cualquier componente de gráfico para mantener consistencia.
 */

export const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  green:   "hsl(var(--green))",
  blue:    "hsl(var(--blue))",
  yellow:  "hsl(var(--yellow))",
  salmon:  "hsl(var(--salmon))",
  purple:  "hsl(var(--purpure))",
  muted:   "hsl(var(--muted-foreground))",
  // Paleta secuencial para múltiples series
  series: [
    "hsl(var(--primary))",
    "hsl(var(--green))",
    "hsl(var(--yellow))",
    "hsl(var(--salmon))",
    "hsl(var(--purpure))",
    "hsl(var(--blue))",
  ],
}

export const CHART_DEFAULTS = {
  margin: { top: 10, right: 10, left: 0, bottom: 0 },
  animationDuration: 400,
  height: 300,
  gridStroke: "hsl(var(--chart-grid))",
  axisTickFill: "hsl(var(--chart-muted))",
}

/** Helper: formatea número como moneda argentina */
export const formatCurrencyChart = (value) =>
  `$${Number(value).toLocaleString("es-AR", { minimumFractionDigits: 0 })}`
