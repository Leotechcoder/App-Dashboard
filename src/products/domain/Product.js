export class Product {
    constructor(id, name, price, category, stock, image_url, description, available, cloudinaryId, created_at, updated_at) {
      this.id = id
      this.name = name
      this.price = price
      this.category = category
      this.stock = stock
      this.image_url = image_url
      this.description = description
      this.available = available
      this.cloudinaryId = cloudinaryId
      this.created_at = created_at
      this.updated_at = updated_at
    }
  }
  