export interface LoginRequest {
  username: string;
  password: string;
}

// Backend API response structure - matches your ApiResponse<object> format
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// Login response data structure
export interface LoginResponseData {
  userId: string;
  token: string;
  refreshToken: string;
  roles: string[];
}

// Complete login response from backend
export interface LoginResponse extends ApiResponse<LoginResponseData> {}

// User object stored in localStorage and context
export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  isActive: boolean;
  roles: string[]; // Array of role names
  token: string;
  refreshToken: string;
}

// Role enum matching backend database roles
export enum UserRole {
  CompanyAdmin = 'CompanyAdmin',
  CompanyStaff = 'CompanyStaff',
  DealerAdmin = 'DealerAdmin',
  DealerStaff = 'DealerStaff',
  CompanyManager = 'CompanyManager',
  DealerManager = 'DealerManager'
}