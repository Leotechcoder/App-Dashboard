import { ProductRepository } from "../application/ProductRepository"
import { productApi } from "../../shared/infrastructure/api/productApi"

export class ProductRepositoryImpl extends ProductRepository {
  constructor(api = productApi) {
    super()
    this.api = api
  }

  async getAll() {
    return await this.api.getProducts()
  }

  async getById(id) {
    return await this.api.getProductById(id)
  }

  async create(product) {
    return await this.api.createProduct(product)
  }

  async update(id, product) {
    return await this.api.updateProduct(id, product)
  }

  async delete(id) {
    return await this.api.deleteProduct(id)
  }
}

