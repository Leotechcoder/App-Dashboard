import BaseApi from "./BaseApi"

class ProductApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_ROUTE_API)
  }

  getProducts = async () => {
    return this.get("/products")
  }

  getProductById = async (id) => {
    return this.get(`/products/${id}`)
  }

  createProduct = async (product) => {
    return this.post("/products", product)
  }

  updateProduct = async (product) => {
    return this.patch(`/products/${product.id_}`, product)
  }

  deleteProduct = async (id) => {
    return this.delete(`/products/${id}`)
  }
}

export const productApi = new ProductApi()

