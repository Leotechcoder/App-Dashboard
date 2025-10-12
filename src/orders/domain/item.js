// src/entities/Item.js (por ejemplo)
export class Item {
  constructor(id, productId, productName, description, unitPrice, quantity) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.description = description;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }

  // 🔄 Convierte a formato que espera la API
  toApiFormat() {
    return {
      product_id: this.productId,
      product_name: this.productName,
      description: this.description,
      unit_price: Number(this.unitPrice),
      quantity: Number(this.quantity),
    };
  }
}
