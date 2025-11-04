// User types for User Management

export interface Role {
  id: string;
  roleName: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string;
  isActive: boolean;
  roles: Role[];
  dealerId?: string;
  dealerName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string;
  roleIds: string[];
  dealerId?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  isActive?: boolean;
}

export interface UpdateUserRolesDto {
  roleIds: string[];
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  dealerId?: string;
}
