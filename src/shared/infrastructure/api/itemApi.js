import BaseApi from "./BaseApi"

class ItemApi extends BaseApi {
  constructor() {
    super(import.meta.env.ROUTE_API)
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
}

export const itemApi = new ItemApi()

