import { API_ENDPOINTS } from '../config/api';
import { LoginRequest, LoginResponse, User } from '../types/auth';

// Service xử lý authentication
class AuthService {
  // Tài khoản dev để test (không cần backend)
  private readonly DEV_ACCOUNT = {
    username: 'dev',
    password: 'dev123'
  };

  // Đăng nhập và lưu thông tin user vào localStorage
  async login(loginData: LoginRequest): Promise<User> {
    try {
      // Kiểm tra tài khoản dev
      if (loginData.username === this.DEV_ACCOUNT.username && 
          loginData.password === this.DEV_ACCOUNT.password) {
        const devUser: User = {
          id: 'dev-001',
          username: 'dev',
          name: 'Developer',
          email: 'dev@example.com',
          isActive: true,
          roles: ['CompanyAdmin'], // Dev account có quyền CompanyAdmin
          token: 'dev-token-123456789',
          refreshToken: 'dev-refresh-token-123456789'
        };
        
        // Lưu user và trạng thái đăng nhập
        localStorage.setItem('user', JSON.stringify(devUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('Dev account login successful');
        return devUser;
      }

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
      
      // Transform backend response to User object
      const user: User = {
        id: data.userId,
        username: loginData.username, // Backend không trả username
        name: loginData.username, // Tạm thời dùng username làm name
        email: '', // Backend không trả email trong login response
        isActive: true,
        roles: data.roles || [],
        token: data.token,
        refreshToken: data.refreshToken
      };
      
      // Lưu user và trạng thái đăng nhập
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Đăng xuất và xóa thông tin user
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Kiểm tra trạng thái đăng nhập
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Kiểm tra user có role cụ thể không
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }

  // Kiểm tra user có bất kỳ role nào trong danh sách không
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return roles.some(role => user.roles.includes(role));
  }

  // Kiểm tra user có tất cả roles trong danh sách không
  hasAllRoles(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return roles.every(role => user.roles.includes(role));
  }

  // Kiểm tra user có phải CompanyAdmin hoặc DealerAdmin không
  isAdmin(): boolean {
    return this.hasAnyRole(['CompanyAdmin', 'DealerAdmin']);
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;