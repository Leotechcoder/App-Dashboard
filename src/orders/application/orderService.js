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

  async deleteOrder(orderId) {
    return await this.orderRepository.delete(orderId);
  }
}
