import { ProductRepository } from "../application/ProductRepository"

export class ProductRepositoryImpl extends ProductRepository {
  constructor(api) {
    super()
    this.api = api
  }

  async getAll() {
    // Implement API call to get all products
  }

  async getById(id) {
    // Implement API call to get a product by id
  }

  async create(product) {
    // Implement API call to create a product
  }

  async update(product) {
    // Implement API call to update a product
  }

  async delete(id) {
    // Implement API call to delete a product
  }
}

