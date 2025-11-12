"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClosedOrders } from "@/sales/application/salesThunks";
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

export const PaymentMethodsChart = () => {
  const dispatch = useDispatch();
  const { closedOrders } = useSelector((store) => store.sales);

  useEffect(() => {
    if (!closedOrders || closedOrders.length === 0) {
      dispatch(fetchClosedOrders());
    }
  }, [dispatch]);

  // 🔹 Preparamos la data para el gráfico
  const data = useMemo(() => {
    if (!closedOrders || closedOrders.length === 0) return [];

    const map = {};

    // Primero filtrar y ordenar las órdenes
    const sortedOrders = [...closedOrders]
      .filter((order) => order.paidAt && order.paymentInfo?.amounts)
      .sort((a, b) => new Date(a.paidAt) - new Date(b.paidAt));

    sortedOrders.forEach((order) => {
      if (!order.paidAt || !order.paymentInfo?.amounts) return;

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

      map[date].efectivo += parseFloat(amounts.efectivo || 0);
      map[date].debito += parseFloat(amounts.debito || 0);
      map[date].credito += parseFloat(amounts.credito || 0);
      map[date].transferencia += parseFloat(amounts.transferencia || 0);
    });

    // Convertimos el map a array ordenado
    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [closedOrders]);

  if (!data.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
      <p className="text-muted-foreground text-sm">
        No hay datos suficientes para mostrar el gráfico de métodos de pago.
      </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-indigo-400 mb-4">
        Métodos de Pago más Usados
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#475569" }}
            tickMargin={10}
          />
          <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
          <Tooltip
            labelFormatter={(label) => `Fecha: ${label}`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
          <Legend verticalAlign="top" height={36} />

          {/* Barras apiladas por método */}
          <Bar dataKey="efectivo" stackId="a" fill="#22c55e" />
          <Bar dataKey="debito" stackId="a" fill="#3b82f6" />
          <Bar dataKey="credito" stackId="a" fill="#a855f7" />
          <Bar dataKey="transferencia" stackId="a" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
