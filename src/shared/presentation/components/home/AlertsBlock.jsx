import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Info, CheckCircle2, RefreshCw } from "lucide-react"

const BASE_URL = import.meta.env.VITE_ROUTE_API

const ICON_MAP = {
  danger:  <AlertCircle className="h-4 w-4 text-[hsl(var(--destructive))] shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-[hsl(var(--yellow))] shrink-0" />,
  info:    <Info className="h-4 w-4 text-[hsl(var(--primary))] shrink-0" />,
}

const BADGE_CLASS = {
  danger:  "bg-[hsl(var(--destructive))] text-white",
  warning: "bg-[hsl(var(--yellow))] text-[hsl(var(--foreground))]",
  info:    "bg-[hsl(var(--primary))] text-white",
}

/**
 * AlertsBlock — Fase 4
 *
 * Consume GET /api/alerts para obtener alertas del backend en lugar
 * de calcularlas en el cliente. Se refresca automáticamente cada 2 min.
 *
 * Tipos de alerta del backend:
 *  - danger  → DELAYED_ORDERS
 *  - warning → CASH_NOT_OPEN
 *  - info    → NO_SALES_PRODUCTS
 */
export function AlertsBlock() {
  const [alerts,  setAlerts]  = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE_URL}/alerts`, { credentials: "include" })
      if (!res.ok) throw new Error("Error al obtener alertas")
      setAlerts(await res.json())
    } catch (err) {
      setError(err.message)
      // Fallback silencioso — no rompemos el OperationCenter si falla
    } finally {
      setLoading(false)
    }
  }, [])

  // Carga inicial + refresco automático cada 2 minutos
  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Alertas Operativas
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAlerts}
            disabled={loading}
            className="h-6 w-6 p-0 hover:cursor-pointer"
            title="Actualizar alertas"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
            No se pudieron cargar las alertas del servidor.
          </p>
        )}

        {!loading && alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--green))]">
            <CheckCircle2 className="h-4 w-4" />
            Sin alertas activas
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 rounded-lg border p-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ICON_MAP[alert.type] ?? ICON_MAP.info}
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <Badge className={`shrink-0 text-xs ${BADGE_CLASS[alert.type] ?? BADGE_CLASS.info}`}>
                    Activa
                  </Badge>
                </div>
                {alert.detail && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))] pl-6">
                    {alert.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
