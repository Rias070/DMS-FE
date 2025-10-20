export interface LoginRequest {
  username: string;
  password: string;
}

// Backend API response structure
export interface LoginResponse {
  success: boolean;
  message: string;
  userId: string;
  token: string;
  refreshToken: string;
  roles: string[]; // Array of role names from backend
}

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
  DealerStaff = 'DealerStaff'
}