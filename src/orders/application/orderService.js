import { formatPrice } from "../../shared/utils/formatPriceOrders";

export class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async getOrders() {
    return await this.orderRepository.getAll();
  }

  async createOrder(order) {
    return await this.orderRepository.create(order);
  }
  
  // ✅ Nuevo método: actualizar orden existente
  async updateOrder(orderId, data) {
    if (!orderId) throw new Error("Falta el ID de la orden para actualizar");
    return await this.orderRepository.update(orderId, data);
  }
  async deleteOrder(orderId) {
    return await this.orderRepository.delete(orderId);
  }

}
