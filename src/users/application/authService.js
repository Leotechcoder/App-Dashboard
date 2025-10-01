export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async register(user) {
    return this.authRepository.register(user);
  }

  async login({email, password}) {
    return this.authRepository.login({email, password});
  }

  async logout() {
    return this.authRepository.logout();
  }

  async authUser() {
    return this.authRepository.authUser();
  }

  async loginGoogle() {
    return this.authRepository.loginGoogle();
  }

  async loginFacebook() {
    return this.authRepository.loginFacebook();
  }
}
