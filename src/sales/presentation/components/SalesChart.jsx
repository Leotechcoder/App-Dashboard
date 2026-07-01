"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { TrendingUp } from "lucide-react"

export function SalesChart({ orders = [] }) {
  const salesByDay = orders.reduce((acc, order) => {
    const date = new Date(
      order.paidAt || order.createdAt
    ).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    })

    acc[date] = (acc[date] || 0) + order.total

    return acc
  }, {})

  const chartData = Object.entries(salesByDay).map(
    ([date, total]) => ({
      date,
      total,
    })
  )

  const isEmpty = chartData.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5" />
          Ventas por Día
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No hay datos de ventas para mostrar
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={chartData}>
              <CartesianGrid
                stroke="hsl(var(--chart-grid))"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{
                  fill: "hsl(var(--chart-muted))",
                }}
              />

              <YAxis
                className="text-xs"
                tick={{
                  fill: "hsl(var(--chart-muted))",
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    "hsl(var(--chart-tooltip-bg))",

                  border:
                    "1px solid hsl(var(--chart-tooltip-border))",

                  borderRadius: 8,

                  color:
                    "hsl(var(--chart-tooltip-text))",
                }}
                formatter={(value) => [
                  `$${value.toFixed(2)}`,
                  "Total",
                ]}
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