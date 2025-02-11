import BaseApi from "./BaseApi"
import { routeApi } from "../utils/routeApi";


class ItemApi extends BaseApi {
  constructor() {
    super(routeApi)
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

