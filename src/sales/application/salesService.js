import { Order, OrderEntity } from "@/orders/domain/order";
import { CashRegisterEntity } from "../domain/cashRegisterEntity";

export class SalesService {
  constructor(repository) {
    this.repository = repository;
  }

  // -------------------------
  // Capa de orquestación
  // -------------------------

  async getPendingOrders() {
    const data = await this.repository.getPendingOrders();
    return data.map((order) => new Order(order).toObject());
  }

  async getClosedOrders(startDate, endDate) {
    const res = await this.repository.getClosedOrders(startDate, endDate);
    if (!res) return { totalEarnings: 0, count: 0, orders: [] };

    let orders = [];
    let totalEarnings = 0;
    let count = 0;

    if (Array.isArray(res)) {
      orders = res.map((o) => new OrderEntity(o).toObject());
      totalEarnings = SalesService.calculateTotalSales(orders);
      count = orders.length;
    } else {
      orders = (res.orders || []).map((o) => new OrderEntity(o).toObject());
      totalEarnings =
        res.totalEarnings ?? SalesService.calculateTotalSales(orders);
      count = res.count ?? orders.length;
    }

    return { totalEarnings, count, orders };
  }

  async processPayment(orderId, paymentInfo) {
    const activeCash = await this.repository.getActiveCashRegister();
    if (!activeCash) throw new Error("No hay una caja abierta");
    const result = await this.repository.closeOrder(orderId, paymentInfo);
    return new OrderEntity(result).toObject();
  }

  async deliverOrder(orderId) {
    const result = await this.repository.markOrderAsDelivered(orderId);
    return new OrderEntity(result).toObject();
  }

  async openCashRegister(initialAmount, openedBy = "system") {
    const result = await this.repository.openCashRegister(
      initialAmount,
      openedBy
    );
    return new CashRegisterEntity(result).toObject();
  }

  async closeCashRegister(
    cashRegisterId,
    finalAmount,
    closedBy = "system",
    orders = []
  ) {
    const closedRegister = await this.repository.closeCashRegister(
      cashRegisterId,
      finalAmount,
      closedBy
    );
    const registerObj = new CashRegisterEntity(closedRegister).toObject();

    const totalSales = SalesService.calculateTotalSales(orders || []);
    const discrepancy = SalesService.calculateDiscrepancy(
      registerObj.initial_amount ?? registerObj.initialAmount ?? 0,
      finalAmount,
      totalSales
    );
    const analysis = SalesService.analyzeDiscrepancy(discrepancy);

    return {
      ...registerObj,
      orders: orders.map((o) => new OrderEntity(o).toObject()),
      totalSales,
      discrepancy,
      analysis,
    };
  }

  async getCashRegisterHistory() {
    const data = await this.repository.getCashRegisterHistory();
    return data.map((r) => new CashRegisterEntity(r).toObject());
  }

  async getActiveCashRegister() {
    const data = await this.repository.getActiveCashRegister();
    return data ? new CashRegisterEntity(data).toObject() : null;
  }

  // -------------------------
  // Métodos estáticos utilitarios
  // -------------------------

  static calculateTotalSales(orders = []) {
    return orders.reduce((sum, order) => {
      const v = order.total ?? order.totalAmount ?? 0;
      return sum + Number(v || 0);
    }, 0);
  }

  static calculateDiscrepancy(
    initialAmount = 0,
    finalAmount = 0,
    ordersTotal = 0
  ) {
    const expectedAmount =
      Number(initialAmount || 0) + Number(ordersTotal || 0);
    const actualAmount = Number(finalAmount || 0);
    return actualAmount - expectedAmount;
  }

  static analyzeDiscrepancy(discrepancy) {
    const eps = 0.01;
    if (Math.abs(discrepancy) <= eps) {
      return {
        type: "balanced",
        message: "La caja cerró correctamente",
        severity: "success",
      };
    } else if (discrepancy > 0) {
      return {
        type: "surplus",
        message: "La caja cerró con más dinero del esperado",
        severity: "warning",
      };
    } else {
      return {
        type: "deficit",
        message: "La caja cerró con menos dinero del esperado",
        severity: "error",
      };
    }
  }

  static filterOrdersByTimeRange(orders = [], startTime, endTime) {
    if (!startTime && !endTime) return orders;
    const start = startTime ? new Date(startTime) : new Date(0);
    const end = endTime ? new Date(endTime) : new Date();
    return orders.filter((order) => {
      const d = new Date(
        order.paidAt ?? order.paid_at ?? order.createdAt ?? order.created_at
      );
      return d >= start && d <= end;
    });
  }

  static groupOrdersByDate(orders = []) {
    const grouped = {};
    orders.forEach((order) => {
      const raw =
        order.paidAt ?? order.paid_at ?? order.createdAt ?? order.created_at;
      const date = raw ? new Date(raw).toLocaleDateString() : "Sin fecha";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(order);
    });
    return grouped;
  }

  static calculateSalesMetrics(orders = []) {
    const total = this.calculateTotalSales(orders);
    const count = orders.length;
    const average = count > 0 ? total / count : 0;
    const totalItems = orders.reduce((sum, order) => {
      if (typeof order.getTotalItems === "function")
        return sum + order.getTotalItems();
      if (Array.isArray(order.items))
        return (
          sum +
          order.items.reduce((s, it) => s + (it.quantity ?? it.qty ?? 0), 0)
        );
      return sum;
    }, 0);

    return { total, count, average, totalItems };
  }

  static filterCashOrders(orders = []) {
    return orders.filter((order) => {
      const method = order.paymentMethod ?? order.payment_method;
      if (method) return method === "cash" || method === "efectivo";
      const pi = order.paymentInfo ?? order.payment_info;
      if (pi && pi.methods && Array.isArray(pi.methods)) {
        return pi.methods.includes("efectivo") || pi.methods.includes("cash");
      }
      return false;
    });
  }

  static calculateCashSales(orders = []) {
    const cashOrders = this.filterCashOrders(orders);
    return this.calculateTotalSales(cashOrders);
  }

  /** Calcular el monto en efectivo por orden */
  static calculateCashAmount(order) {
    if (!order) return 0;

    // Buscar dentro de paymentInfo o payment_info
    const pi = order.paymentInfo ?? order.payment_info;
    if (!pi) return 0;

    // Buscar campo 'amounts'
    const amounts = pi.amounts ?? {};
    const efectivo =
      amounts.efectivo ?? amounts.cash ?? amounts["efectivo"] ?? 0;

    // Convertir a número
    return Number(efectivo) || 0;
  }

  //Totaliza todos los montos en efectivo
  static calculateTotalCashAmount(orders = []) {
    return orders.reduce(
      (sum, order) => sum + this.calculateCashAmount(order),
      0
    );
  }

  // Totaliza montos por método de pago
  static calculateTotalByPaymentMethod(orders = []) {
    const totals = {
      cash: 0,
      debit: 0,
      credit: 0,
      transfer: 0,
      other: 0,
    };

    orders.forEach((order) => {
      const pi = order.paymentInfo ?? order.payment_info;
      if (!pi) return;

      const amounts = pi.amounts ?? {};
      for (const [method, value] of Object.entries(amounts)) {
        const val = Number(value) || 0;
        switch (method.toLowerCase()) {
          case "efectivo":
          case "cash":
            totals.cash += val;
            break;
          case "debito":
          case "debit":
            totals.debit += val;
            break;
          case "credito":
          case "credit":
            totals.credit += val;
            break;
          case "transferencia":
          case "transfer":
          case "transf":
            totals.transfer += val;
            break;
          default:
            totals.other += val;
        }
      }
    });

    return totals;
  }

  static filterSessionOrders(orders = [], startIso, endIso) {
    if (!Array.isArray(orders)) return [];
    if (!startIso) return orders;

    const start = new Date(startIso);
    const end = endIso ? new Date(endIso) : new Date();

    return orders.filter((order) => {
      const paidDate = new Date(
        order.paidAt ?? order.paid_at ?? order.createdAt ?? order.created_at
      );
      return paidDate >= start && paidDate <= end;
    });
  }
}
