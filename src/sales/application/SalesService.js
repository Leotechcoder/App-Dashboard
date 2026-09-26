import { Order, OrderEntity } from "@/orders/domain/Order";
import { CashRegisterEntity } from "../domain/CashRegisterEntity";

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

    if (!res) {
      return {
        totalEarnings: 0,
        count: 0,
        orders: [],
      };
    }

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

    return {
      totalEarnings,
      count,
      orders,
    };
  }

  async processPayment(orderId, paymentInfo) {
    const activeCash = await this.repository.getActiveCashRegister();

    if (!activeCash) {
      throw new Error("No hay una caja abierta");
    }

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

    const paymentSummary = SalesService.calculatePaymentSummary(orders);

    const totalSales = paymentSummary.total;

    const discrepancy = SalesService.calculateDiscrepancy(
      registerObj.initial_amount ?? registerObj.initialAmount ?? 0,
      finalAmount,
      paymentSummary.cash
    );

    const analysis = SalesService.analyzeDiscrepancy(discrepancy);

    return {
      ...registerObj,
      orders: orders.map((o) => new OrderEntity(o).toObject()),
      totalSales,
      paymentSummary,
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

    return data
      ? new CashRegisterEntity(data).toObject()
      : null;
  }

  // -------------------------
  // Ventas
  // -------------------------

  /**
   * Calcula el total de ventas utilizando el total
   * registrado en cada orden.
   *
   * Este valor representa el total de la venta,
   * independientemente del método de pago.
   */
  static calculateTotalSales(orders = []) {
    return orders.reduce((sum, order) => {
      const value = order?.total ?? order?.totalAmount ?? 0;

      return sum + (Number(value) || 0);
    }, 0);
  }

  /**
   * Calcula métricas generales de ventas.
   */
  static calculateSalesMetrics(orders = []) {
    const total = this.calculateTotalSales(orders);
    const count = orders.length;
    const average = count > 0 ? total / count : 0;

    const totalItems = orders.reduce((sum, order) => {
      if (typeof order?.getTotalItems === "function") {
        return sum + order.getTotalItems();
      }

      if (Array.isArray(order?.items)) {
        return (
          sum +
          order.items.reduce(
            (itemsSum, item) =>
              itemsSum + (Number(item.quantity ?? item.qty ?? 0) || 0),
            0
          )
        );
      }

      return sum;
    }, 0);

    return {
      total,
      count,
      average,
      totalItems,
    };
  }

  // -------------------------
  // Métodos de pago
  // -------------------------

  /**
   * Obtiene los importes registrados en paymentInfo
   * independientemente de si vienen como paymentInfo
   * o payment_info.
   */
  static getPaymentAmounts(order) {
    if (!order) return {};

    const paymentInfo =
      order.paymentInfo ??
      order.payment_info;

    if (!paymentInfo) return {};

    const amounts = paymentInfo.amounts;

    if (!amounts || typeof amounts !== "object") {
      return {};
    }

    return amounts;
  }

  /**
   * Normaliza el nombre de un método de pago.
   *
   * Esto permite aceptar tanto:
   *
   * efectivo / cash
   * debito / debit
   * credito / credit
   * transferencia / transfer / transf
   */
  static normalizePaymentMethod(method) {
    if (!method) return "other";

    switch (String(method).trim().toLowerCase()) {
      case "efectivo":
      case "cash":
        return "cash";

      case "debito":
      case "debit":
        return "debit";

      case "credito":
      case "credit":
        return "credit";

      case "transferencia":
      case "transfer":
      case "transf":
        return "transfer";

      default:
        return "other";
    }
  }

  /**
   * Calcula cuánto dinero fue aplicado a cada método
   * de pago dentro de una orden.
   *
   * IMPORTANTE:
   * Para efectivo utiliza el monto registrado en
   * paymentInfo.amounts.efectivo/cash.
   *
   * Ese monto debe representar lo aplicado a la venta,
   * NO el dinero físico entregado por el cliente.
   *
   * Ejemplo:
   *
   * Orden: $10.000
   * Cliente entrega: $15.000
   * Vuelto: $5.000
   *
   * amounts.efectivo debe ser:
   * $10.000
   */
  static calculatePaymentSummary(orders = []) {
    const totals = {
      cash: 0,
      debit: 0,
      credit: 0,
      transfer: 0,
      other: 0,
      total: 0,
    };

    if (!Array.isArray(orders)) {
      return totals;
    }

    orders.forEach((order) => {
      const amounts = this.getPaymentAmounts(order);

      Object.entries(amounts).forEach(([method, value]) => {
        const amount = Number(value) || 0;

        if (amount <= 0) return;

        const normalizedMethod =
          this.normalizePaymentMethod(method);

        totals[normalizedMethod] += amount;
      });
    });

    totals.total =
      totals.cash +
      totals.debit +
      totals.credit +
      totals.transfer +
      totals.other;

    return totals;
  }

  /**
   * Devuelve solamente las ventas cobradas en efectivo.
   *
   * Se mantiene para compatibilidad con el código existente.
   */
  static filterCashOrders(orders = []) {
    if (!Array.isArray(orders)) return [];

    return orders.filter((order) => {
      const paymentMethod =
        order?.paymentMethod ??
        order?.payment_method;

      if (paymentMethod) {
        const normalized =
          this.normalizePaymentMethod(paymentMethod);

        return normalized === "cash";
      }

      const paymentInfo =
        order?.paymentInfo ??
        order?.payment_info;

      if (
        paymentInfo?.methods &&
        Array.isArray(paymentInfo.methods)
      ) {
        return paymentInfo.methods.some(
          (method) =>
            this.normalizePaymentMethod(method) === "cash"
        );
      }

      const amounts = this.getPaymentAmounts(order);

      return Object.entries(amounts).some(
        ([method, value]) =>
          this.normalizePaymentMethod(method) === "cash" &&
          Number(value) > 0
      );
    });
  }

  /**
   * Calcula el total vendido en órdenes que tienen
   * efectivo como método de pago.
   *
   * NOTA:
   * Si existen pagos mixtos, para obtener el importe
   * realmente cobrado en efectivo se debe utilizar
   * calculateTotalCashAmount().
   */
  static calculateCashSales(orders = []) {
    const cashOrders = this.filterCashOrders(orders);

    return this.calculateTotalSales(cashOrders);
  }

  /**
   * Calcula el importe de efectivo aplicado a una orden.
   */
  static calculateCashAmount(order) {
    const amounts = this.getPaymentAmounts(order);

    if (!amounts) return 0;

    const cashAmount =
      amounts.efectivo ??
      amounts.cash ??
      0;

    return Number(cashAmount) || 0;
  }

  /**
   * Total de efectivo realmente aplicado a las ventas.
   *
   * Este es el valor que debe utilizarse para calcular
   * cuánto efectivo debería existir en caja.
   */
  static calculateTotalCashAmount(orders = []) {
    if (!Array.isArray(orders)) return 0;

    return orders.reduce(
      (sum, order) =>
        sum + this.calculateCashAmount(order),
      0
    );
  }

  /**
   * Totaliza los importes por método de pago.
   *
   * Se mantiene como alias de compatibilidad.
   */
  static calculateTotalByPaymentMethod(orders = []) {
    const summary =
      this.calculatePaymentSummary(orders);

    return {
      cash: summary.cash,
      debit: summary.debit,
      credit: summary.credit,
      transfer: summary.transfer,
      other: summary.other,
    };
  }

  // -------------------------
  // Caja
  // -------------------------

  /**
   * Calcula la diferencia entre el efectivo contado
   * y el efectivo que debería existir en caja.
   *
   * IMPORTANTE:
   * ordersTotal debe representar únicamente
   * efectivo aplicado a las ventas.
   */
  static calculateDiscrepancy(
    initialAmount = 0,
    finalAmount = 0,
    cashSales = 0
  ) {
    const expectedAmount =
      Number(initialAmount || 0) +
      Number(cashSales || 0);

    const actualAmount =
      Number(finalAmount || 0);

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
    }

    if (discrepancy > 0) {
      return {
        type: "surplus",
        message: "La caja cerró con más dinero del esperado",
        severity: "warning",
      };
    }

    return {
      type: "deficit",
      message: "La caja cerró con menos dinero del esperado",
      severity: "error",
    };
  }

  // -------------------------
  // Filtros
  // -------------------------

  static filterOrdersByTimeRange(
    orders = [],
    startTime,
    endTime
  ) {
    if (!startTime && !endTime) return orders;

    const start = startTime
      ? new Date(startTime)
      : new Date(0);

    const end = endTime
      ? new Date(endTime)
      : new Date();

    return orders.filter((order) => {
      const date = new Date(
        order?.paidAt ??
          order?.paid_at ??
          order?.createdAt ??
          order?.created_at
      );

      return date >= start && date <= end;
    });
  }

  static filterSessionOrders(
    orders = [],
    startIso,
    endIso
  ) {
    if (!Array.isArray(orders)) return [];

    if (!startIso) return orders;

    const start = new Date(startIso);

    const end = endIso
      ? new Date(endIso)
      : new Date();

    return orders.filter((order) => {
      const paidDate = new Date(
        order?.paidAt ??
          order?.paid_at ??
          order?.createdAt ??
          order?.created_at
      );

      return paidDate >= start && paidDate <= end;
    });
  }

  static groupOrdersByDate(orders = []) {
    const grouped = {};

    orders.forEach((order) => {
      const raw =
        order?.paidAt ??
        order?.paid_at ??
        order?.createdAt ??
        order?.created_at;

      const date = raw
        ? new Date(raw).toLocaleDateString()
        : "Sin fecha";

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(order);
    });

    return grouped;
  }
}