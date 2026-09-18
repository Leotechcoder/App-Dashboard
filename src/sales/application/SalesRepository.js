// Interfaz del repositorio (contrato)
export class SalesRepository {
  async getClosedOrders(startDate, endDate) {
    throw new Error("Method not implemented")
  }

  async getCashRegisterHistory() {
    throw new Error("Method not implemented")
  }

  async openCashRegister(initialAmount, openedBy) {
    throw new Error("Method not implemented")
  }

  async closeCashRegister(cashRegisterId, finalAmount, closedBy) {
    throw new Error("Method not implemented")
  }

  async getActiveCashRegister() {
    throw new Error("Method not implemented")
  }

  async getCashRegisterById(id) {
    throw new Error("Method not implemented")
  }
}
