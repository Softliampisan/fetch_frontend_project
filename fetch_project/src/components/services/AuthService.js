import { redirect } from 'react-router-dom';

class AuthService {
  getTokenDuration() {
    const storedExpirationDate = localStorage.getItem('expiration');
    if (!storedExpirationDate) return 0;

    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    return expirationDate.getTime() - now.getTime();
  }

  login(user) {
    localStorage.setItem('user', JSON.stringify(user));
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem('expiration', expiration.toISOString());
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('expiration');
    sessionStorage.removeItem('savedDogIds');
    return redirect('/login');
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    const tokenDuration = this.getTokenDuration();

    if (!user || tokenDuration < 0) {
      this.logout();
      return null;
    }
    return user;
  }

  isAuthenticated() {
    return this.getTokenDuration() > 0;
  }
}

const Auth = new AuthService();
export default Auth;
