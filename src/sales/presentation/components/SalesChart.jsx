"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"

export function SalesChart({ orders = [] }) {
  const salesByDay = orders.reduce((acc, order) => {
    const date = new Date(order.paidAt || order.createdAt).toLocaleDateString(
      "es-ES",
      { day: "2-digit", month: "short" }
    )

    acc[date] = (acc[date] || 0) + order.total
    return acc
  }, {})

  const chartData = Object.entries(salesByDay).map(([date, total]) => ({
    date,
    total,
  }))

  const isEmpty = chartData.length === 0

  return (
    <Card
    >
      <CardHeader>
        <CardTitle
          className="flex items-center gap-2"
          style={{ color: "hsl(var(--primary))" }}
        >
          <TrendingUp className="h-5 w-5" />
          Ventas por Día
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          <div
            className="py-12 text-center text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            No hay datos de ventas para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--chart-grid))"
              />

              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--chart-muted))" }}
                className="text-xs"
              />

              <YAxis
                tick={{ fill: "hsl(var(--chart-muted))" }}
                className="text-xs"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--chart-tooltip-bg))",
                  border: "1px solid hsl(var(--chart-tooltip-border))",
                  borderRadius: "8px",
                  color: "hsl(var(--chart-tooltip-text))",
                }}
                formatter={(value) => [`$${value.toFixed(2)}`, "Total"]}
              />

              <Bar
                dataKey="total"
                fill="hsl(var(--chart-bar-primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
