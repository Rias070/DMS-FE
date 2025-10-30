import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/auth';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  // Role checking methods
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra xem user đã login chưa khi khởi động app
    const currentUser = authService.getCurrentUser();
    const loggedIn = authService.isLoggedIn();
    
    if (currentUser && loggedIn) {
      setUser(currentUser);
      setIsLoggedIn(true);
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const userData = await authService.login({ username, password });
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await authService.logoutWithAPI();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API fails
      authService.logout();
    }
    setUser(null);
    setIsLoggedIn(false);
  };

  // Normalize: treat Manager roles as equivalent to Admin roles
  const roleAliases: Record<string, string[]> = {
    CompanyAdmin: ['CompanyAdmin', 'CompanyManager'],
    CompanyManager: ['CompanyManager', 'CompanyAdmin'],
    DealerAdmin: ['DealerAdmin', 'DealerManager'],
    DealerManager: ['DealerManager', 'DealerAdmin'],
  };

  const matchRole = (userRoles: string[], requiredRole: string): boolean => {
    const equivalents = roleAliases[requiredRole] || [requiredRole];
    return equivalents.some(r => userRoles.includes(r));
  };

  // Kiểm tra user có role cụ thể không (with alias support)
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return matchRole(user.roles, role);
  };

  // Kiểm tra user có bất kỳ role nào trong danh sách không (with alias support)
  const hasAnyRole = (roles: string[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.some(role => matchRole(user.roles, role));
  };

  // Kiểm tra user có tất cả roles trong danh sách không (with alias support)
  const hasAllRoles = (roles: string[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.every(role => matchRole(user.roles, role));
  };

  // Shortcut để kiểm tra Admin (CompanyAdmin hoặc DealerAdmin)
  const isAdmin = (): boolean => {
    return hasAnyRole(['CompanyAdmin', 'DealerAdmin']);
  };

  const value: AuthContextType = {
    user,
    isLoggedIn,
    login,
    logout,
    loading,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};