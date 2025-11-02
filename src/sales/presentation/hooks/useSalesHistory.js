"use client"

import { useEffect, useMemo } from "react"
import { fetchClosedOrders, fetchCashRegisterHistory } from "../../application/salesThunks"
import { setFilters } from "../../application/salesSlice"
import { useDispatch, useSelector } from "react-redux"

export function useSalesHistory() {
  const dispatch = useDispatch()
  const { orders, cashRegisterHistory, filters, loading } = useSelector((state) => state.sales)

  // 🔄 Ejecuta la carga de datos cuando cambian los filtros de fecha
  useEffect(() => {
    loadSalesData()
  }, [filters.dateRange, filters.startDate, filters.endDate])

  // 📅 Carga las órdenes cerradas y el historial de caja
  const loadSalesData = () => {
    const { startDate, endDate } = getDateRange()
    dispatch(fetchClosedOrders({ startDate, endDate }))
    dispatch(fetchCashRegisterHistory())
  }

  // 🧮 Calcula el rango de fechas según el filtro seleccionado
  const getDateRange = () => {
  const now = new Date();
  let startDate, endDate;

  switch (filters.dateRange) {
    case "today":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "week":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    case "month":
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    case "custom":
      startDate = filters.startDate ? new Date(filters.startDate) : new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = filters.endDate ? new Date(filters.endDate) : new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
  }

  // 🔹 Retornar en formato local (no UTC)
  const formatLocal = (d) =>
    d.toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" }).replace(" ", "T");

  return {
    startDate: formatLocal(startDate),
    endDate: formatLocal(endDate),
  };
};


  // 🧠 Filtra las órdenes por método de pago (además de la fecha)
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return []
    if (!filters.paymentMethod || filters.paymentMethod === "all") return orders

    return orders.filter(order => {
      const methods = order.payment_info?.methods || order.paymentInfo?.methods || []
      return methods.includes(filters.paymentMethod)
    })
  }, [orders, filters.paymentMethod])

  // 🧭 Actualiza los filtros globales
  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters))
  }

  // 🚀 Retorna el estado y acciones útiles
  return {
    orders: filteredOrders,
    cashRegisterHistory,
    filters,
    loading,
    updateFilters,
    refreshData: loadSalesData,
  }
}
