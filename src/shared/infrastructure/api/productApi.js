import BaseApi from "./BaseApi"
import dotenv from 'dotenv';

if(process.env.FRONTEND_ENV !== 'production'){
  dotenv.config(); 
}

class ProductApi extends BaseApi {
  constructor() {
    super(process.env.ROUTE_API)
  }

  getProducts() {
    return this.get("/products")
  }

  getProductById(id) {
    return this.get(`/products/${id}`)
  }

  createProduct(product) {
    return this.post("/products", product)
  }

  updateProduct(product) {
    return this.patch(`/products/${product.id_}`, product)
  }

  deleteProduct(id) {
    return this.delete(`/products/${id}`)
  }
}

export const productApi = new ProductApi()

