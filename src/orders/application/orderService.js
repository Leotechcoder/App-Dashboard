import { formatPrice } from "../../shared/utils/formatPriceOrders";

export class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async getOrders() {
    return await this.orderRepository.getAll();
  }

  async createOrder(order) {
    // Validaciones o formateos antes de enviar
    order.totalAmount = formatPrice(order.totalAmount ?? 0);
    return await this.orderRepository.create(order);
  }

  async updateOrder(order) {
    order.totalAmount = formatPrice(order.totalAmount ?? 0);
    return await this.orderRepository.update(order);
  }

  async deleteOrder(orderId) {
    return await this.orderRepository.delete(orderId);
  }
}
