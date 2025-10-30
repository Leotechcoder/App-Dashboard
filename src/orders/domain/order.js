export class Order {
  constructor({ id, userId, userName, totalAmount, status, itemsId, createdAt, updatedAt }) {
    this.id = id
    this.userId = userId
    this.userName = userName
    this.totalAmount = totalAmount
    this.status = status
    this.itemsId = itemsId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  // Ejemplo: Lógica de dominio (validaciones, estados, etc.)
  isPaid() {
    return this.status?.toLowerCase() === "abonada"
  }
}


export class OrderEntity {
  constructor(data = {}) {
    this.id = data.id
    this.orderNumber = data.orderNumber || data.id
    this.customerName = data.customerName || data.userName || "Cliente"
    this.total = Number(data.total || data.totalAmount || 0)
    this.status = data.status || "pending"
    this.paymentInfo = data.paymentInfo || null
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

  toObject() {
    return { ...this }
  }
}
