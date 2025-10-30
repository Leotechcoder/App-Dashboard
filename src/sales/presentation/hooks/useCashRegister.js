
import { useEffect } from "react"
import {
  fetchActiveCashRegister,
  openCashRegister,
  closeCashRegister,
  fetchClosedOrders,
} from "../../application/salesThunks"
import { useDispatch, useSelector } from "react-redux"

export function useCashRegister() {
  const dispatch = useDispatch()
  const { activeCashRegister, loading, error } = useSelector((state) => state.sales)

  useEffect(() => {
    dispatch(fetchActiveCashRegister())
  }, [dispatch])

  const handleOpenCashRegister = async (initialAmount, openedBy = "Usuario") => {
    const result = await dispatch(openCashRegister({ initialAmount, openedBy }))
    return result
  }

  const handleCloseCashRegister = async (finalAmount, closedBy = "Usuario") => {
    if (!activeCashRegister) return

    // Obtener órdenes del rango de tiempo de la caja
    const ordersResult = await dispatch(
      fetchClosedOrders({
        startDate: activeCashRegister.openedAt,
        endDate: new Date().toISOString(),
      }),
    )

    const orders = ordersResult.payload || []

    const result = await dispatch(
      closeCashRegister({
        cashRegisterId: activeCashRegister.id,
        finalAmount,
        closedBy,
        orders,
      }),
    )

    return result
  }

  return {
    activeCashRegister,
    loading,
    error,
    handleOpenCashRegister,
    handleCloseCashRegister,
  }
}
