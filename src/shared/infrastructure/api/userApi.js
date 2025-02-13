import BaseApi from "./BaseApi"
import dotenv from 'dotenv';

if(process.env.FRONTEND_ENV !== 'production'){
  dotenv.config(); 
}

class UserApi extends BaseApi {
  constructor() {
    super(process.env.ROUTE_API)
  }

  getUsers() {
    return this.get("/users")
  }

  createUser(user) {
    return this.post("/users", user)
  }

  updateUser(user) {
    return this.patch(`/users/${user.id_}`, user)
  }

  deleteUser(id) {
    return this.delete(`/users/${id}`)
  }
}

export const userApi = new UserApi()

