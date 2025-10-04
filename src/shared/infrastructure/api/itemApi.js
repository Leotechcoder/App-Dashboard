import BaseApi from "./BaseApi"

class ItemApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_ROUTE_API)
  }

  getItems() {
    return this.get("/items")
  }

  getItemById(id) {
    return this.get(`/items/${id}`)
  }

  addItem(item) {
    return this.post("/items", item)
  }

  updateItem(id, data){
    return this.patch(`/items/${id}`, data)
  }
}

export const itemApi = new ItemApi()

