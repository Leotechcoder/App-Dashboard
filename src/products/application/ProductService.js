import { Product } from "../domain/Product"


export class ProductService {
    constructor(productRepository) {
      this.productRepository = productRepository
    }
  
  async  getAllProducts() {
      const { products } =  await this.productRepository.getAll()
      return products.map(p => new Product(
          p.id_, 
          p.name_, 
          p.price, 
          p.category, 
          p.stock, 
          p.image_url, 
          p.description, 
          p.available, 
          p.created_at, 
          p.updated_at)
        )
    }
  
  async  getProductById(id) {
      return this.productRepository.getById(id)
    }
  
  async  createProduct(product) {
      const {data, message} = await this.productRepository.create(product);
      const createdProduct = new Product(
        data.id_,
        data.name_, 
        data.price, 
        data.category, 
        data.stock, 
        data.image_url, 
        data.description, 
        data.available, 
        data.created_at, 
      )
      return ({ createdProduct, message })
    }
  
  async  updateProduct(product) {
      const {data, message} = await this.productRepository.update(product);
      const updateProduct = new Product(
        data.id_,
        data.name_, 
        data.price, 
        data.category, 
        data.stock, 
        data.image_url, 
        data.description, 
        data.available, 
        data.created_at, 
        data.updated_at
      )
      return ({ updateProduct, message })
    }
  
  async  deleteProduct(id) {
      return await this.productRepository.delete(id)
    }
  }
  
  