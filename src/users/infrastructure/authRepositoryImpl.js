import { AuthRepository } from "../domain/authRepository.js"
import { authApi } from "../../shared/infrastructure/api/authApi.js"

export class AuthRepositoryImpl extends AuthRepository {
    constructor(api = authApi) {
        super()
        this.api = api
    }

    async register(user) {
        const data = await this.api.register(user)
        return { user: data.user ?? null, message: data.message }
    }

    async login({ email, password }) {
        const data = await this.api.login({ email, password })
        console.log(data)
        return ({ user: data.user, message: data.message })
    }

    async logout() {
       return await this.api.logout()
    }

    async authUser(){
        const data = await this.api.authUser()
        console.log(data)
        if (data.error) throw new Error(message)
        return data
    }

    async loginGoogle() {
        return await this.api.loginGoogle()
    }

    async loginFacebook() {
        return await this.api.loginFacebook()
    }

}
