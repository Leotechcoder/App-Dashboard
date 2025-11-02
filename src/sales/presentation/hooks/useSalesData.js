import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSalesHistory } from "./useSalesHistory";
import { useCashRegister } from "./useCashRegister";
import { SalesService } from "../../application/salesService";

export function useSalesData() {
  const { orders, filters, loading } = useSalesHistory();
  const { activeCashRegister } = useCashRegister();
  const { cashRegisterHistory } = useSelector((state) => state.sales);

  // 🔹 Total general de ventas (todas las órdenes)
  const totalEarnings = useMemo(() => {
    if (!orders?.length) return 0;

    // Si no se seleccionó un método o es "todos", sumamos el total completo
    if (!filters.paymentMethod || filters.paymentMethod === "all") {
      return orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    }

    // Filtrar las órdenes que contengan el método elegido
    const filteredOrders = orders.filter((order) => {
      const methods =
        order.payment_info?.methods || order.paymentInfo?.methods || [];
      return methods.includes(filters.paymentMethod);
    });

    // Sumar solo el monto correspondiente al método dentro de amounts
    const total = filteredOrders.reduce((sum, order) => {
      const amount = Number(
        order.payment_info?.amounts?.[filters.paymentMethod] ||
          order.paymentInfo?.amounts?.[filters.paymentMethod] ||
          0
      );
      return sum + amount;
    }, 0);

    return total;
  }, [orders, filters.paymentMethod]);

  // 🔹 Datos para los gráficos (agrupación por fecha)
  const chartData = useMemo(() => {
    if (!orders?.length) return [];

    const groupedByDate = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString("es-AR");
      if (!acc[date]) acc[date] = { date, total: 0, count: 0 };
      acc[date].total += Number(order.total) || 0;
      acc[date].count += 1;
      return acc;
    }, {});

    return Object.values(groupedByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [orders]);

  // 🔹 Filtrar las órdenes correspondientes a la sesión de caja activa
  const sessionOrders = useMemo(() => {
    if (!activeCashRegister) return [];

    const startIso = activeCashRegister.openedAt
      ? new Date(activeCashRegister.openedAt).toISOString()
      : null;

    const endIso = activeCashRegister.closedAt
      ? new Date(activeCashRegister.closedAt).toISOString()
      : new Date().toISOString();

    if (!startIso) return [];

    const ordersInRange = SalesService.filterOrdersByTimeRange(
      orders,
      startIso,
      endIso
    );

    // Filtrar solo las órdenes con método efectivo
    let cashOrders = SalesService.filterSessionOrders(ordersInRange, startIso, endIso);


    // 🔸 Incluir solo órdenes cerradas o completadas
    const closedStatusRegex = /closed|paid|completed|cancelled/i;
    cashOrders = cashOrders.filter(
      (o) =>
        o.closedAt ||
        (o.status && closedStatusRegex.test(String(o.status))) ||
        o.isClosed === true
    );

    return cashOrders;
  }, [orders, activeCashRegister]);

  // 🔹 Calcular totales de la caja activa
const cashRegisterAnalysis = useMemo(() => {
  if (!activeCashRegister) return null;

  const initial = Number(activeCashRegister.initialAmount) || 0;
  const totalByMethod = SalesService.calculateTotalByPaymentMethod(sessionOrders);

  const totalCash = totalByMethod.cash || 0;
  const totalDebit = totalByMethod.debit || 0;
  const totalCredit = totalByMethod.credit || 0;
  const totalTransfer = totalByMethod.transfer || 0;

  const totalExpected = totalCash + totalDebit + totalCredit + totalTransfer;

  return {
    expectedTotal: totalExpected,
    expectedCashAmount: totalCash,
    expectedDebitAmount: totalDebit,
    expectedCreditAmount: totalCredit,
    expectedTransferAmount: totalTransfer,
    ordersCount: sessionOrders.length,
    initialAmount: initial,
    expectedFinalAmount: initial + totalCash,
    lastUpdate: new Date().toISOString(),
  };
}, [activeCashRegister, sessionOrders]);

  // 🔹 Retornar datos preparados para el dashboard
  return {
    orders,
    totalEarnings,
    chartData,
    cashRegister: activeCashRegister,
    cashRegisterAnalysis,
    sessionOrders,
    loading,
    filters,
    cashRegisterHistory,
  };
}
