import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { formatDateToArg } from "@/shared/utils/formatDateToArg";
import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const PaymentMethodsChart = () => {
  const { closedOrders } = useSelector((store) => store.sales);

  const data = useMemo(() => {
    if (!closedOrders?.length) return [];

    const map = {};

    const sortedOrders = [...closedOrders]
      .filter((o) => o.paidAt && o.paymentInfo?.amounts)
      .sort((a, b) => new Date(a.paidAt) - new Date(b.paidAt));

    sortedOrders.forEach((order) => {
      const date = formatDateToArg(order.paidAt);
      const { amounts } = order.paymentInfo;

      if (!map[date]) {
        map[date] = {
          date,
          efectivo: 0,
          debito: 0,
          credito: 0,
          transferencia: 0,
        };
      }

      map[date].efectivo += Number(amounts.efectivo || 0);
      map[date].debito += Number(amounts.debito || 0);
      map[date].credito += Number(amounts.credito || 0);
      map[date].transferencia += Number(amounts.transferencia || 0);
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [closedOrders]);

  if (!data.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center pt-6 ">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            No hay datos suficientes para mostrar el gráfico.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
        <CardTitle className="text-base">
          Tendencia de ventas por método de pago
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--chart-grid))"
            />

            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />

            <Tooltip
              labelFormatter={(label) => `Fecha: ${label}`}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
            />

            <Legend verticalAlign="top" height={36} />

            <Bar dataKey="efectivo" stackId="a" fill="hsl(var(--green)/0.9)" />
            <Bar dataKey="debito" stackId="a" fill="hsl(var(--yellow)/0.9)" />
            <Bar dataKey="credito" stackId="a" fill="hsl(var(--primary))" />
            <Bar
              dataKey="transferencia"
              stackId="a"
              fill="hsl(var(--purpure)/0.9)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
