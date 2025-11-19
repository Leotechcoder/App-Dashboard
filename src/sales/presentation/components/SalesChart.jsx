"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

export function SalesChart({ orders = [] }) {
  // Agrupar ventas por día
  const salesByDay = orders.reduce((acc, order) => {
    const date = new Date(order.paidAt || order.createdAt).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    })

    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += order.total

    return acc
  }, {})

  const chartData = Object.entries(salesByDay).map(([date, total]) => ({
    date,
    total,
  }))

  if (chartData.length === 0) {
    return (
      <Card className={'bg-gray-50'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ventas por Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">No hay datos de ventas para mostrar</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={'bg-gray-50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Ventas por Día
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, "Total"]}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
