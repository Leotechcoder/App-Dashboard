<<<<<<< HEAD:src/users/infrastructure/userRepositoryImpl.js
// infra/UserRepositoryImpl.js
=======

>>>>>>> baddd1c9bc1af46bf110b3ed5e1d0312536169be:src/users/infrastructure/UserRepositoryImpl.js
import { UserRepository } from "../domain/UserRepository.js"
import { userApi } from "../../shared/infrastructure/api/userApi.js"

export class UserRepositoryImpl extends UserRepository {
  constructor(api = userApi) {
    super()
    this.api = api
  }

  async getAll() {
    return await this.api.getUsers()
  }

  async getById(id) {
    return await this.api.getUserById(id)
  }

  async create(user) {
    return await this.api.createUser(user)
  }

  async update(user) {
    return await this.api.updateUser(user)
  }

  async delete(id) {
    return await this.api.deleteUser(id)
  }
}
