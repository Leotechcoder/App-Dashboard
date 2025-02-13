import BaseApi from "./BaseApi"

class OrderApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_ROUTE_API)
  }

  getOrders() {
    return this.get("/orders")
  }

  createOrder(order) {
    return this.post("/orders", order)
  }

  updateOrder(order) {
    return this.patch(`/orders/${order.id}`, order)
  }

  deleteOrder(id) {
    return this.delete(`/orders/${id}`)
  }
}

export const orderApi = new OrderApi()

