import BaseApi from "./BaseApi";

class AuthApi extends BaseApi {
  constructor(
    baseURL = import.meta.env.VITE_ROUTE_API) {
      super(baseURL);
  }

  async register(user) {
    return this.post("/auth/local/register", user);
  }

  async login({ email, password }) {
    return await this.post("/auth/local/login", { email, password });
  }

  async logout() {
    return await this.post("/auth/local/logout");
  }

  async authUser() {
    return await this.get("/auth/authenticate");
  }

  async loginGoogle() {
    const URL = this.baseURL? this.baseURL : 'http://localhost:3000/api'
    const url = `${URL}/auth/google`;
    window.location.href = url;
  }

  async loginFacebook() {
    const URL = this.baseURL? this.baseURL : 'http://localhost:3000/api'
    const url = `${URL}/auth/facebook`;
    window.location.href = url;
  }
}

export const authApi = new AuthApi();
