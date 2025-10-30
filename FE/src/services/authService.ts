import { API_ENDPOINTS } from '../config/api';
import { LoginRequest, LoginResponse } from '../types/auth';

class AuthService {
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { username: loginData.username, password: '***' });
      console.log('API endpoint:', API_ENDPOINTS.AUTH.LOGIN);
      
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed with error:', errorText);
        throw new Error(errorText || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      console.log('Login successful:', data);
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('isLoggedIn', 'true');
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }

  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}

export const authService = new AuthService();
export default authService;