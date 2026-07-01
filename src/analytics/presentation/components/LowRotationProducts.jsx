import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { PackageX, RefreshCw } from "lucide-react"
import { fetchLowRotationProducts } from "../../application/analyticsThunks"
import { useSelector as useAppSelector } from "react-redux"

/**
 * LowRotationProducts
 *
 * Tabla de productos con ventas por debajo del umbral configurado.
 * El umbral se ajusta con un slider (1-20 unidades).
 * Al cambiar el umbral y aplicar, dispara fetchLowRotationProducts.
 *
 * Props:
 *  - startDate: string
 *  - endDate: string
 */
export function LowRotationProducts({ startDate, endDate }) {
  const dispatch     = useDispatch()
  const lowRotation  = useSelector((state) => state.analytics.lowRotation)
  const loading      = useSelector((state) => state.analytics.loading)

  const [threshold, setThreshold] = useState(5)

  const handleApply = () => {
    if (!startDate || !endDate) return
    dispatch(fetchLowRotationProducts({ startDate, endDate, threshold }))
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PackageX className="h-4 w-4 text-[hsl(var(--destructive))]" />
            Productos de Baja Rotación
          </CardTitle>

          {/* Control de umbral */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Umbral: <span className="font-semibold text-[hsl(var(--foreground))]">≤ {threshold} ud.</span>
            </span>
            <input
              type="range"
              min={1}
              max={20}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-28 accent-[hsl(var(--primary))]"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleApply}
              disabled={loading}
              className="h-7 gap-1.5 text-xs hover:cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              Aplicar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 rounded bg-[hsl(var(--muted))] animate-pulse" />
            ))}
          </div>
        ) : lowRotation.length === 0 ? (
          <div className="py-8 text-center">
            <PackageX className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--muted-foreground))]" />
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {startDate
                ? `Sin productos con ≤ ${threshold} unidades vendidas en el período`
                : "Seleccioná un período y aplicá para ver resultados"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--muted)/0.4)]">
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">Producto</TableHead>
                  <TableHead className="text-xs text-right">Unidades vendidas</TableHead>
                  <TableHead className="text-xs text-center">Alerta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowRotation.map((product, index) => (
                  <TableRow key={product.productName}>
                    <TableCell className="text-xs text-[hsl(var(--muted-foreground))] w-8">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {product.productName}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold text-[hsl(var(--destructive))]">
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="text-xs border-[hsl(var(--destructive)/0.4)] text-[hsl(var(--destructive))]"
                      >
                        {product.quantity === 0 ? "Sin ventas" : "Baja rotación"}
                      </Badge>
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
