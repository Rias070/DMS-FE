import { API_ENDPOINTS } from '../config/api';
import { LoginRequest, User } from '../types/auth';

// Service xử lý authentication
class AuthService {
  // Tài khoản dev để test (không cần backend)
  private readonly DEV_ACCOUNTS = [
    // Company Roles
    { username: 'companyadmin', password: 'admin123', role: 'CompanyAdmin', name: 'Nguyễn Văn A - Admin Hãng' },
    { username: 'companystaff', password: 'staff123', role: 'CompanyStaff', name: 'Trần Thị B - Nhân viên Hãng' },
    
    // Dealer Roles
    { username: 'dealeradmin', password: 'admin123', role: 'DealerAdmin', name: 'Lê Văn C - Quản lý Đại lý' },
    { username: 'dealerstaff', password: 'staff123', role: 'DealerStaff', name: 'Phạm Thị D - Nhân viên Đại lý' },
    
    // Legacy dev account
    { username: 'dev', password: 'dev123', role: 'CompanyAdmin', name: 'Developer' },
  ];

  // Đăng nhập và lưu thông tin user vào localStorage
  async login(loginData: LoginRequest): Promise<User> {
    try {
      // Kiểm tra tài khoản dev và test accounts
      const devAccount = this.DEV_ACCOUNTS.find(acc => 
        acc.username === loginData.username && acc.password === loginData.password
      );
      
      if (devAccount) {
        const devUser: User = {
          id: `${devAccount.role.toLowerCase()}-${devAccount.username}`,
          username: devAccount.username,
          name: (devAccount as any).name || devAccount.username,
          email: `${devAccount.username}@example.com`,
          isActive: true,
          roles: [(devAccount as any).role || 'DealerAdmin'],
          token: `dev-token-${devAccount.username}`,
          refreshToken: `dev-refresh-token-${devAccount.username}`
        };
        
        // Lưu user và trạng thái đăng nhập
        localStorage.setItem('user', JSON.stringify(devUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log(`✅ Test account login successful: ${devAccount.username} (${devUser.roles[0]})`);
        return devUser;
      }

      console.log('Attempting login with:', { username: loginData.username, password: '***' });
      console.log('API endpoint:', API_ENDPOINTS.AUTH.LOGIN);
      
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Enable CORS
        credentials: 'include', // Include cookies if needed
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Handle different response types and error cases
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        let errorMessage = 'Login failed';
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorResponse = await response.json();
            console.error('API Error Response:', errorResponse);
            
            // Handle different error response formats
            if (errorResponse.message) {
              errorMessage = errorResponse.message;
            } else if (errorResponse.error) {
              errorMessage = errorResponse.error;
            } else if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
              errorMessage = errorResponse.errors.join(', ');
            } else {
              errorMessage = `Server error (${response.status}): ${response.statusText}`;
            }
          } else {
            // Handle non-JSON responses
            const errorText = await response.text();
            console.error('Server error text:', errorText);
            
            if (errorText.includes('BCrypt.Net') || errorText.includes('Invalid salt version')) {
              errorMessage = 'Lỗi hệ thống xác thực. Vui lòng liên hệ quản trị viên.';
            } else if (errorText.includes('500') || errorText.includes('Internal Server Error')) {
              errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau.';
            } else {
              errorMessage = errorText || `Server error (${response.status})`;
            }
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful JSON response
      let apiResponse: any;
      try {
        apiResponse = await response.json();
        console.log('API Response:', apiResponse);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid server response format');
      }

      // Handle different response formats from BE
      let userData: any;
      
      if (apiResponse.success !== undefined) {
        // Standard ApiResponse format
        if (!apiResponse.success) {
          const errorMessage = apiResponse.message || 'Login failed';
          console.error('Login failed:', errorMessage);
          throw new Error(errorMessage);
        }
        userData = apiResponse.data;
      } else if (apiResponse.token) {
        // Direct response format (token directly in response)
        userData = apiResponse;
      } else {
        // Unknown format
        console.error('Unknown response format:', apiResponse);
        throw new Error('Invalid server response format');
      }

      console.log('Login successful:', apiResponse);
      
      // Transform backend response to User object
      const user: User = {
        id: userData.userId || userData.id || loginData.username,
        username: loginData.username,
        name: userData.name || loginData.username,
        email: userData.email || '',
        isActive: true,
        roles: userData.roles || ['CompanyAdmin'], // Default role if not provided
        token: userData.token,
        refreshToken: userData.refreshToken || userData.refresh_token || ''
      };
      
      // Lưu user và trạng thái đăng nhập
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      
      // Handle BCrypt salt errors specifically
      if (error instanceof Error && error.message.includes('Invalid salt version')) {
        throw new Error('Lỗi hệ thống xác thực. Vui lòng liên hệ quản trị viên.');
      }
      
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

  // Refresh token method
  async refreshToken(): Promise<User> {
    const user = this.getCurrentUser();
    if (!user || !user.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'X-Refresh-Token': user.refreshToken,
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Refresh token failed');
      }

      const apiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Refresh token failed');
      }

      // Update user with new tokens
      const updatedUser: User = {
        ...user,
        token: apiResponse.data.token,
        refreshToken: apiResponse.data.refreshToken,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Refresh token error:', error);
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  }

  // Logout with API call
  async logoutWithAPI(): Promise<void> {
    const user = this.getCurrentUser();
    if (user && user.token) {
      try {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          mode: 'cors',
        });
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with local logout even if API fails
      }
    }
    
    this.logout();
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing API connection to:', API_ENDPOINTS.AUTH.LOGIN);
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          username: 'test',
          password: 'test'
        }),
      });
      
      console.log('Connection test response status:', response.status);
      console.log('Connection test response ok:', response.ok);
      
      return response.status !== 0; // Any response means server is reachable
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;