import BaseApi from "./BaseApi";

class AuthApi extends BaseApi {
  constructor(baseURL = import.meta.env.ROUTE_API) {
    super(baseURL);
  }

  async register(user) {
    return this.post("/auth/register", user);
  }

  async login({ email, password }) {
    return this.post("/auth/login", { email, password });
  }

  async logout() {
    return this.get("/auth/logout");
  }

  async authUser() {
    return this.get("/auth/authenticate");
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
