// src/modules/sales/infrastructure/SalesRepository.js
import { SalesApi } from "../salesApi2.js"

export class SalesRepository {
  async getPendingOrders() {
    return await SalesApi.getPendingOrders()
  }

  async getClosedOrders(startDate, endDate) {
    return await SalesApi.getClosedOrders(startDate, endDate)
  }

  async closeOrder(orderId, paymentInfo) {
    return await SalesApi.closeOrder(orderId, paymentInfo)
  }

  async markOrderAsDelivered(orderId) {
    return await SalesApi.markOrderAsDelivered(orderId)
  }

  async openCashRegister(initialAmount) {
    return await SalesApi.openCashRegister(initialAmount)
  }

  async closeCashRegister(cashRegisterId, finalAmount) {
    return await SalesApi.closeCashRegister(cashRegisterId, finalAmount)
  }

  async getActiveCashRegister() {
    return await SalesApi.getActiveCashRegister()
  }

  async getCashRegisterHistory() {
    return await SalesApi.getCashRegisterHistory()
  }
}
