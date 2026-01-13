"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

export function SalesFilters({ filters, onFiltersChange }) {
  const handleDateRangeChange = (value) => {
    onFiltersChange({ dateRange: value })
  }

  const handleStartDateChange = (e) => {
    onFiltersChange({ startDate: e.target.value })
  }

  const handleEndDateChange = (e) => {
    onFiltersChange({ endDate: e.target.value })
  }

  const handlePaymentChange = (value) => {
    onFiltersChange({ paymentMethod: value })
  }

  return (
    <Card>
      <CardContent
        className="
          pt-6
        "
        style={{ borderRadius: "var(--border)" }}
      >
        <div
          className="
            flex flex-col md:flex-row md:items-end
            gap-(--filters-gap)
          "
        >
          {/* -------- Rango de fecha -------- */}
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="dateRange"
              className="text-[hsl(var(--muted-foreground))]"
            >
              Rango de Fecha
            </Label>

            <Select
              value={filters.dateRange}
              onValueChange={handleDateRangeChange}
            >
              <SelectTrigger
                id="dateRange"
                className="w-(--filters-select-width) border border-[hsl(var(--border))]"
              >
                <SelectValue placeholder="Seleccionar rango" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mes</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* -------- Fechas personalizadas -------- */}
          {filters.dateRange === "custom" && (
            <div className="flex flex-1 gap-4 mr-8">
              <div className="flex-1 space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-[hsl(var(--muted-foreground))]"
                >
                  Fecha Inicio
                </Label>

                <div className="relative">
                  <Calendar
                    className="
                      absolute left-3 top-1/2 -translate-y-1/2
                      h-4 w-4
                      text-[hsl(var(--filters-input-icon))]
                    "
                  />

                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate || ""}
                    onChange={handleStartDateChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-[hsl(var(--filters-label-text))]"
                >
                  Fecha Fin
                </Label>

                <div className="relative">
                  <Calendar
                    className="
                      absolute left-3 top-1/2 -translate-y-1/2
                      h-4 w-4
                      text-[hsl(var(--filters-input-icon))]
                    "
                  />

                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate || ""}
                    onChange={handleEndDateChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* -------- Método de pago -------- */}
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="paymentMethod"
              className="text-[hsl(var(--muted-foreground))]"
            >
              Método de Pago
            </Label>

            <Select
              value={filters.paymentMethod || "all"}
              onValueChange={handlePaymentChange}
            >
              <SelectTrigger
                id="paymentMethod"
                className="w-(--filters-select-width)"
              >
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="debito">Débito</SelectItem>
                <SelectItem value="credito">Crédito</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
