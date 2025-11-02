export class Order {
  constructor({ id, userId, userName, totalAmount, status, itemsId, createdAt, updatedAt, deliveryType }) {
    this.id = id
    this.userId = userId
    this.userName = userName
    this.totalAmount = totalAmount
    this.status = status
    this.deliveryType = deliveryType
    this.itemsId = itemsId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  // Ejemplo: Lógica de dominio (validaciones, estados, etc.)
  isPaid() {
    return this.status?.toLowerCase() === "abonada"
  }

   toObject() {
    return { ...this }
  }
}


export class OrderEntity {
  constructor(data = {}) {
    this.id = data.id
    this.orderNumber = data.orderNumber || data.id
    this.customerId = data.customerId || data.userId || null
    this.customerName = data.customerName || data.userName || "Cliente"
    this.total = Number(data.total || data.totalAmount || 0)
    this.status = data.status || "pending"
    this.paymentInfo = data.paymentInfo || null
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || null
    this.paidAt = data.paidAt || null
    this.deliveredAt = data.deliveredAt || null
    this.deliveryType = data.deliveryType || "Retiro en local"
    this.cashRegisterId = data.cashRegisterId || null
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
