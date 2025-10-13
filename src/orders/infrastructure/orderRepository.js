import { Order } from "../domain/order.js";
import { orderApi } from "../../shared/infrastructure/api/orderApi.js";

export class OrderRepository {
  async getAll() {
    return await orderApi.getOrders();
  }

  async create(order) {
    const response = await orderApi.createOrder(order);
    return response;
  }

  async delete(orderId) {
    return await orderApi.deleteOrder(orderId);
  }

  // 🔁 Transformadores
  _toDomain(raw) {
    return new Order({
      id: raw.id,
      userId: raw.user_id || raw.userId,
      userName: raw.user_name || raw.userName,
      totalAmount: raw.total_amount || raw.totalAmount || 0,
      status: raw.status,
      itemsId: raw.items_id || raw.itemsId,
      createdAt: raw.created_at || raw.createdAt,
      updatedAt: raw.updated_at || raw.updatedAt,
    });
  }

  _toDTO(order) {
    return {
      id: order.id,
      user_id: order.userId,
      user_name: order.userName,
      total_amount: order.totalAmount,
      status: order.status,
      items_id: order.itemsId,
      created_at: order.createdAt,
    };
  }
}
