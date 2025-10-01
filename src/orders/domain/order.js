export class Order {
    constructor(id, userId, userName, totalAmount, status, itemsId, createdAt, updatedAt) {
      this.id = id
      this.userId = userId
      this.userName = userName
      this.totalAmount = totalAmount
      this.status = status
      this.itemsId = itemsId
      this.createdAt = createdAt
      this.updatedAt = updatedAt
    }
  }
  
  