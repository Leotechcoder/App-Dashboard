import { UserRepository } from "../application/UserRepository"

export class UserRepositoryImpl extends UserRepository {
  constructor(api) {
    super()
    this.api = api
  }

  async getAll() {
    // Implement API call to get all users
  }

  async getById(id) {
    // Implement API call to get a user by id
  }

  async create(user) {
    // Implement API call to create a user
  }

  async update(user) {
    // Implement API call to update a user
  }

  async delete(id) {
    // Implement API call to delete a user
  }
}

