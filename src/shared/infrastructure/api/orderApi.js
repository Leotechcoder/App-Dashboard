import BaseApi from "./BaseApi"
import dotenv from 'dotenv';

if(process.env.FRONTEND_ENV !== 'production'){
  dotenv.config(); 
}

class OrderApi extends BaseApi {
  constructor() {
    super(process.env.ROUTE_API)
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

