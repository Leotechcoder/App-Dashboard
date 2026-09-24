import { useEffect } from "react";
import {
  openCashRegister,
  closeCashRegister,
  fetchClosedOrders,
} from "../../application/salesThunks";
import { useDispatch, useSelector } from "react-redux";
import { formatLocal } from "@/shared/utils/formatDateToArg";

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
