import BaseApi from "./BaseApi"
import dotenv from 'dotenv';

if(process.env.FRONTEND_ENV !== 'production'){
  dotenv.config(); 
}


class ItemApi extends BaseApi {
  constructor() {
    super(process.env.ROUTE_API)
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

