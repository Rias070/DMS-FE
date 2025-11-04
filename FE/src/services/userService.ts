import { User, CreateUserDto, UpdateUserDto, UpdateUserRolesDto, Role } from '../types/user';

const API_BASE = '/api';

class UserService {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Accounts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      if (data.success && data.data) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Accounts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async create(userData: CreateUserDto): Promise<User> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create user: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async update(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Accounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update user: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Activate user
   */
  async activate(id: string): Promise<void> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Accounts/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to activate user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }

  /**
   * Deactivate user
   */
  async deactivate(id: string): Promise<void> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Accounts/${id}/deactivate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to deactivate user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Update user roles
   */
  async updateRoles(id: string, roleData: UpdateUserRolesDto): Promise<void> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Accounts/${id}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user roles: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating user roles:', error);
      throw error;
    }
  }

  /**
   * Get users by dealer
   */
  async getByDealer(dealerId: string): Promise<User[]> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Accounts/dealer/${dealerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dealer users: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      }
      return data;
    } catch (error) {
      console.error('Error fetching dealer users:', error);
      throw error;
    }
  }

  /**
   * Get all roles
   */
  async getRoles(): Promise<Role[]> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE}/Role`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      }
      return data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  /**
   * Get token from localStorage
   */
  private getToken(): string {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('No authentication token found');
    }
    
    try {
      const user = JSON.parse(userStr);
      return user.token || '';
    } catch {
      throw new Error('Invalid user data');
    }
  }
}

export const userService = new UserService();
export default userService;
