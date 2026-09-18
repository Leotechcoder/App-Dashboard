  // Entidad de dominio para la caja registradora
  export class CashRegisterEntity {
    constructor(data = {}) {
      this.id = data.id
      this.openedAt = data.openedAt || data.opened_at || null
      this.closedAt = data.closedAt || data.closed_at || null

      // Conversión segura de montos
      this.initialAmount = Number(data.initialAmount || data.initial_amount || 0)
      this.finalAmount = data.finalAmount
        ? Number(data.finalAmount)
        : data.final_amount
        ? Number(data.final_amount)
        : null

      this.status = data.status || "open" // 'open' | 'closed'
      this.openedBy = data.openedBy || data.opened_by || "Desconocido"
      this.closedBy = data.closedBy || data.closed_by || null
    }

    isOpen() {
      return this.status === "open"
    }

    isClosed() {
      return this.status === "closed"
    }

    getDuration() {
      if (!this.closedAt || !this.openedAt) return null
      return new Date(this.closedAt) - new Date(this.openedAt)
    }

    toObject() {
      return { ...this }
    }
  }


  // Entidad de dominio para órdenes de venta
  export class SaleOrderEntity {
    constructor(data = {}) {
      this.id = data.id
      this.orderNumber = data.orderNumber || data.id
      this.customerName = data.customerName || data.userName || "Cliente"
      this.total = Number(data.total || data.totalAmount || data.total_amount || 0)
      this.status = data.status || "pending" // 'pending' | 'paid' | 'delivered'
      this.paymentMethod = data.paymentMethod || data.paymentInfo || "cash"
      this.createdAt = data.createdAt || new Date().toISOString()
      this.paidAt = data.paidAt || null
      this.deliveredAt = data.deliveredAt || null
    }

    isPaid() {
      return this.status === "paid" || this.status === "delivered"
    }

    isDelivered() {
      return this.status === "delivered"
    }

  }

