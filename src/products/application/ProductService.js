// src/modules/products/application/ProductService.js

import { Product } from "../domain/Product";

export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts() {
    const { products } = await this.productRepository.getAll();

    return products.map(
      (p) =>
        new Product({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          stock: p.stock,
          description: p.description,
          available: p.available,
          images: p.images || [], // ← NUEVO
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })
    );
  }

  async getProductById(id) {
    return await this.productRepository.getById(id);
  }

  async createProduct(data) {
    const { product, message } = await this.productRepository.create(data);

    const createdProduct = new Product({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      available: product.available,
      images: product.images || [], // ← NUEVO
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });

    return { createdProduct, message };
  }

  async updateProduct(id, data) {
    const { product, message } = await this.productRepository.update(id, data);

    const updatedProduct = new Product({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      available: product.available,
      images: product.images || [], // ← NUEVO
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });

    return { updatedProduct, message };
  }

  async deleteProduct(id) {
    return await this.productRepository.delete(id);
  }
}
