import { Product } from "../domain/Product"


export class ProductService {
    constructor(productRepository) {
      this.productRepository = productRepository
    }
  
  async  getAllProducts() {
      const { products } =  await this.productRepository.getAll()
      return products.map(p => new Product(
          p.id, 
          p.name, 
          p.price, 
          p.category, 
          p.stock, 
          p.imageUrl, 
          p.description, 
          p.available, 
          p.createdAt, 
          p.updatedAt)
        )
    }
  
  async  getProductById(id) {
      return this.productRepository.getById(id)
    }
  
  async  createProduct(data) {
      const {product, message} = await this.productRepository.create(data);
      const createdProduct = new Product(
        product.id,
        product.name, 
        product.price, 
        product.category, 
        product.stock, 
        product.imageUrl, 
        product.description, 
        product.available, 
        product.createdAt, 
      )
      return ({ createdProduct, message })
    }
  
  async  updateProduct(data) {
      const {product, message} = await this.productRepository.update(data);
      const updateProduct = new Product(
        product.id,
        product.name, 
        product.price, 
        product.category, 
        product.stock, 
        product.imageUrl, 
        product.description, 
        product.available, 
        product.createdAt, 
        product.updatedAt
      )
      return ({ updateProduct, message })
    }
  
  async  deleteProduct(id) {
      return await this.productRepository.delete(id)
    }
  }
  
  