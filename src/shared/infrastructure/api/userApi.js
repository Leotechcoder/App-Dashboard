import BaseApi from "./BaseApi"

class UserApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_ROUTE_API)
  }

  getUsers = async ()=> {
    return this.get("/users")
  }

  createUser = async (user)=> {
    return this.post("/users", user)
  }

  updateUser = async (user)=> {
    return this.patch(`/users/${user.id_}`, user)
  }

  deleteUser = async (id)=> {
    return this.delete(`/users/${id}`)
  }
}

export const userApi = new UserApi()

