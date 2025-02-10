import BaseApi from "./BaseApi";

class AuthApi extends BaseApi {
  constructor() {
    super("http://localhost:3000/api");
    this.baseURL = this.baseURL || "http://localhost:3000/api"; // Reafirmar que tiene valor
  }

  register(user) {
    return this.post("/auth/register", user);
  }

  login({ email, password }) {
    return this.post("/auth/login", { email, password });
  }

  logout() {
    const url = `${this.baseURL}/logout`;
    console.log("Redirigiendo a:", url);
    window.location.href = url;
  }

  authUser() {
    return this.get("/auth/authenticate");
  }

  loginGoogle() {
    const url = this.baseURL ? `${this.baseURL}/auth/google` : "http://localhost:3000/api/auth/google";
    console.log("Redirigiendo a:", url);
    window.location.href = url;
  }

  loginFacebook() {
    const url = this.baseURL ? `${this.baseURL}/auth/facebook` : "http://localhost:3000/api/auth/facebook";
    console.log("Redirigiendo a:", url);
    window.location.href = url;
  }
}

export const authApi = new AuthApi();
