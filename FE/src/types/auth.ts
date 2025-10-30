export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role: number;
  username: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  username: string;
  isActive: boolean;
}