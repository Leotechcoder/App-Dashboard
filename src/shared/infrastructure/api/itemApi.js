import BaseApi from "./BaseApi"

class ItemApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_ROUTE_API)
  }

  getItems() {
    return this.get("/items")
  }

  getItemById(itemId) {
    return this.get(`/items/${itemId}`)
  }

  addItem(orderId, items) {
    return this.post(`/orders/${orderId}/items`, items)
  }
  
  updateItem(orderId, itemId, data){
    return this.patch(`/orders/${orderId}/items/${itemId}`, data)
  }

  deleteItem(orderId, itemId) {
    return this.delete(`/orders/${orderId}/items/${itemId}`)
  }

}

export const itemApi = new ItemApi()

