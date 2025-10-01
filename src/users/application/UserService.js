// application/UserService.js
import { User } from "../domain/user.js"

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async getAllUsers() {
    const {data, message} = await this.userRepository.getAll()
    const users = data.map(u => new User(
      u.id,
      u.username,
      u.email,
      u.phone,
      u.address,
      u.avatar,
      u.registration_date,
      u.update_profile
    ))
    return ({users, message})
  }

  async getUserById(id) {
    const {data, message} = await this.userRepository.getById(id)
    const user = new User(
      data.id,
      data.username,
      data.email,
      data.phone,
      data.address,
      data.avatar,
      data.registration_date,
      data.update_profile
    )
    return ({user, message})
  }

  async createUser(user) {
    const {data, message} = await this.userRepository.create(user)
    const createdUser = new User(
      data.id,
      data.username,
      data.email,
      data.phone,
      data.address,
      data.avatar,
      data.registration_date,
      data.update_profile
    )
    return ({createdUser, message})
  }

  async updateUser(user) {
    const {data, message} = await this.userRepository.update(user)
    const updatedUser = new User(
      data.id,
      data.username,
      data.email,
      data.phone,
      data.address,
      data.avatar,
      data.registration_date,
      data.update_profile
    )
    return ({updatedUser, message})
  }

  async deleteUser(id) {
    return await this.userRepository.delete(id)
  }
}
