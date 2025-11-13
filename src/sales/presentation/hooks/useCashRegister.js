import { useEffect } from "react";
import {
  openCashRegister,
  closeCashRegister,
  fetchClosedOrders,
} from "../../application/salesThunks";
import { useDispatch, useSelector } from "react-redux";

export function useCashRegister() {
  const dispatch = useDispatch();
  const { activeCashRegister, loading, error } = useSelector(
    (state) => state.sales
  );

  const handleOpenCashRegister = async (
    initialAmount,
    openedBy = "Usuario"
  ) => {
    const result = await dispatch(
      openCashRegister({ initialAmount, openedBy })
    );
    return result;
  };

  const handleCloseCashRegister = async (finalAmount, closedBy = "Usuario") => {
    if (!activeCashRegister) return;

    const now = new Date();
    // 🔹 Retornar en formato local (no UTC)
    const formatLocal = (d) => {
      const local = new Date(d);
      // Ajusta manualmente el desfase horario
      const offsetMs = local.getTimezoneOffset() * 60 * 1000;
      const localISOTime = new Date(local.getTime() - offsetMs)
        .toISOString()
        .slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
      return `${localISOTime}-03:00`; // agrega el offset argentino
    };

    // Obtener órdenes del rango de tiempo de la caja
    const ordersResult = await dispatch(
      fetchClosedOrders({
        startDate: formatLocal(activeCashRegister.openedAt),
        endDate: formatLocal(now),
      })
    );

    const orders = ordersResult.payload || [];

    const result = await dispatch(
      closeCashRegister({
        cashRegisterId: activeCashRegister.id,
        finalAmount,
        closedBy,
        orders,
      })
    );

    return result;
  };

  return {
    activeCashRegister,
    loading,
    error,
    handleOpenCashRegister,
    handleCloseCashRegister,
  };
}
