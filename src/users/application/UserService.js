<<<<<<< HEAD:src/users/application/userService.js
// application/UserService.js
=======

>>>>>>> baddd1c9bc1af46bf110b3ed5e1d0312536169be:src/users/application/UserService.js
import { User } from "../domain/User.js"

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
      u.registrationDate,
      u.updateProfile
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
      data.registrationDate,
      data.updateProfile
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
      data.registrationDate,
      data.updateProfile
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
      data.registrationDate,
      data.updateProfile
    )
    return ({updatedUser, message})
  }

  async deleteUser(id) {
    return await this.userRepository.delete(id)
  }
}
