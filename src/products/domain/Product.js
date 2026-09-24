

export class Product {
  constructor({
    id,
    name,
    price,
    category,
    stock,
    description,
    available,
    images = [],
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.description = description;
    this.available = available;
    this.images = images; // ← importante
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
