import { Order } from "../domain/order.js";
import { orderApi } from "../../shared/infrastructure/api/orderApi.js";

export class OrderRepository {
  async getAll() {
    const response = await orderApi.getOrders();
    return response.orders.map((raw) => this._toDomain(raw).toObject());
  }

  async create(order) {
    const response = await orderApi.createOrder(this._toDTO(order));
    return this._toDomain(response.order);
  }

  // ✅ Nuevo método: actualizar datos de una orden existente
  async update(orderId, data) {
    const response = await orderApi.updateOrder(orderId, data);
    return this._toDomain(response);
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
      itemsId: raw.itemsId,
      createdAt: raw.created_at || raw.createdAt,
      updatedAt: raw.updated_at || raw.updatedAt,
      deliveryType: raw.deliveryType,
    });
  }

  _toDTO(order) {
    return {
      userId: order.userId,
      userName: order.userName,
      status: order.status,
      items: order.items || [],
      totalAmount: order.totalAmount,
      deliveryType: order.deliveryType,
    };
  }
}
