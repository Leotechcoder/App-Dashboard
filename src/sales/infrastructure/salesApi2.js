const BASE_URL = "http://localhost:3000/api/sales"

export class SalesApi {
  static async getPendingOrders() {
    const res = await fetch(`${BASE_URL}/orders/pending`, { credentials: "include" })
    if (!res.ok) throw new Error("Error al obtener órdenes pendientes")
    return res.json()
  }

  static async getClosedOrders(startDate, endDate) {
    const url = `${BASE_URL}/orders/closed?startDate=${startDate}&endDate=${endDate}`
    const res = await fetch(url, { credentials: "include" })
    if (!res.ok) throw new Error("Error al obtener órdenes cerradas")
    return res.json()
  }

  static async closeOrder(orderId, paymentInfo) {
    const res = await fetch(`${BASE_URL}/orders/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentInfo }),
      credentials: "include"
    })
    if (!res.ok) throw new Error("Error al cerrar la orden")
    return res.json()
  }

  static async markOrderAsDelivered(orderId) {
    const res = await fetch(`${BASE_URL}/orders/deliver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
      credentials: "include"
    })
    if (!res.ok) throw new Error("Error al marcar como entregada")
    return res.json()
  }

  static async openCashRegister(initialAmount) {
    const res = await fetch(`${BASE_URL}/cash-registers/open`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initialAmount }),
      credentials: "include"
    })
    if (!res.ok) throw new Error("Error al abrir caja")
    return res.json()
  }

  static async closeCashRegister(cashRegisterId, finalAmount) {
    const res = await fetch(`${BASE_URL}/cash-registers/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cashRegisterId, finalAmount }),
      credentials: "include"
    })
    if (!res.ok) throw new Error("Error al cerrar caja")
    return res.json()
  }

  static async getCashRegisterHistory() {
    const res = await fetch(`${BASE_URL}/cash-registers/history`, { credentials: "include" })
    if (!res.ok) throw new Error("Error al obtener historial de cajas")
    return res.json()
  }

  static async getActiveCashRegister() {
    const res = await fetch(`${BASE_URL}/cash-registers/active`, { credentials: "include" })
    if (!res.ok) throw new Error("Error al obtener caja activa")
    return res.json()
  }
}
