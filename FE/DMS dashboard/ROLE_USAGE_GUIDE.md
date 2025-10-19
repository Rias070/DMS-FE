# Role-Based Authorization - Usage Guide

## 🎯 Quick Start

Frontend đã được implement đầy đủ role-based authorization matching với backend API.

---

## 📚 Available Roles (từ Backend)

```typescript
enum UserRole {
  CompanyAdmin = 'CompanyAdmin',  // Quản trị viên công ty
  CompanyStaff = 'CompanyStaff',  // Nhân viên công ty
  DealerAdmin = 'DealerAdmin',    // Quản trị viên đại lý
  DealerStaff = 'DealerStaff'     // Nhân viên đại lý
}
```

---

## 🔐 1. Protected Routes

### Basic - Chỉ cần đăng nhập

```tsx
import ProtectedRoute from './components/auth/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Với Role cụ thể

```tsx
// Chỉ CompanyAdmin mới truy cập được
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRoles={['CompanyAdmin']}>
      <AdminPanel />
    </ProtectedRoute>
  } 
/>

// CompanyAdmin HOẶC DealerAdmin
<Route 
  path="/manage" 
  element={
    <ProtectedRoute requiredRoles={['CompanyAdmin', 'DealerAdmin']}>
      <ManagementPanel />
    </ProtectedRoute>
  } 
/>

// Yêu cầu CẢ 2 roles
<Route 
  path="/special" 
  element={
    <ProtectedRoute 
      requiredRoles={['CompanyAdmin', 'DealerAdmin']} 
      requireAll
    >
      <SpecialPage />
    </ProtectedRoute>
  } 
/>
```

---

## 🎨 2. RoleGuard Component

### Ẩn/Hiện UI Elements

```tsx
import RoleGuard from './components/auth/RoleGuard';
import { UserRole } from './types/auth';

// Chỉ CompanyAdmin mới thấy
<RoleGuard roles={['CompanyAdmin']}>
  <button onClick={handleDelete}>Delete User</button>
</RoleGuard>

// CompanyAdmin hoặc DealerAdmin
<RoleGuard roles={[UserRole.CompanyAdmin, UserRole.DealerAdmin]}>
  <button onClick={handleEdit}>Edit Content</button>
</RoleGuard>

// Hiển thị fallback khi không có quyền
<RoleGuard 
  roles={['CompanyAdmin']} 
  fallback={<span className="text-gray-400">Admin only</span>}
>
  <button>Delete All</button>
</RoleGuard>

// Đảo ngược - chỉ hiển thị cho user KHÔNG phải Admin
<RoleGuard roles={['CompanyAdmin', 'DealerAdmin']} inverse>
  <div>You are viewing as regular user</div>
</RoleGuard>
```

---

## 🪝 3. useRole Hook

```tsx
import { useRole } from './hooks/useRole';
import { UserRole } from './types/auth';

function MyComponent() {
  const { 
    hasRole, 
    isAdmin, 
    isCompanyAdmin,
    isDealerAdmin,
    isStaff,
    canAccess, 
    getUserRoles 
  } = useRole();

  // Kiểm tra role cụ thể
  if (hasRole(UserRole.CompanyAdmin)) {
    // Do something for CompanyAdmin
  }

  // Kiểm tra Admin nhanh
  if (isAdmin()) {
    // CompanyAdmin hoặc DealerAdmin
  }

  // Kiểm tra có thể truy cập không
  if (canAccess(['CompanyAdmin', 'DealerAdmin'])) {
    // User có ít nhất 1 trong 2 roles
  }

  // Lấy danh sách roles
  const roles = getUserRoles(); // ['CompanyAdmin', 'CompanyStaff']

  return (
    <div>
      {isAdmin() && <button>Admin Only Button</button>}
      {isCompanyAdmin() && <div>Company Admin Panel</div>}
      {isStaff() && <div>Staff Dashboard</div>}
    </div>
  );
}
```

---

## 🔍 4. AuthContext Methods

```tsx
import { useAuth } from './context/AuthContext';

function UserInfo() {
  const { user, hasRole, hasAnyRole, isAdmin } = useAuth();

  return (
    <div>
      <h2>User: {user?.name}</h2>
      <p>Roles: {user?.roles.join(', ')}</p>
      
      {isAdmin() && <p>You are an admin!</p>}
      {hasRole('CompanyStaff') && <p>You are company staff!</p>}
      {hasAnyRole(['CompanyAdmin', 'DealerAdmin']) && (
        <p>You can manage content</p>
      )}
    </div>
  );
}
```

---

## 💼 5. Real-World Examples

### Navigation Menu với Role-Based Items

```tsx
function Navigation() {
  const { isAdmin, hasRole } = useRole();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      
      <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']}>
        <Link to="/management">Management</Link>
      </RoleGuard>
      
      <RoleGuard roles={['CompanyAdmin']}>
        <Link to="/admin">Admin Panel</Link>
      </RoleGuard>
      
      {hasRole('CompanyStaff') && (
        <Link to="/company">Company Tasks</Link>
      )}
    </nav>
  );
}
```

### Table với Role-Based Actions

```tsx
function UserTable() {
  const { isAdmin, hasRole } = useRole();

  return (
    <table>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <button>View</button>
              
              <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']}>
                <button>Edit</button>
              </RoleGuard>
              
              <RoleGuard roles={['CompanyAdmin']}>
                <button>Delete</button>
              </RoleGuard>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Form với Conditional Fields

```tsx
function UserForm() {
  const { isCompanyAdmin, canAccess } = useRole();

  return (
    <form>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      
      <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']}>
        <select name="role">
          <option>CompanyStaff</option>
          <option>DealerStaff</option>
          {isCompanyAdmin() && <option>CompanyAdmin</option>}
        </select>
      </RoleGuard>
      
      <RoleGuard roles={['CompanyAdmin']}>
        <input name="permissions" placeholder="Special Permissions" />
      </RoleGuard>
    </form>
  );
}
```

---

## 🧪 6. Testing

### Dev Account (không cần backend)

```
Username: dev
Password: dev123
Roles: ['CompanyAdmin']
```

### Backend Demo Accounts

```
Username: admin1 / admin2 / admin3
Password: admin123
Roles: ['CompanyAdmin']
```

---

## ⚠️ Best Practices

### ✅ DO

```tsx
// Sử dụng RoleGuard cho UI elements
<RoleGuard roles={['CompanyAdmin']}>
  <DeleteButton />
</RoleGuard>

// Sử dụng ProtectedRoute cho pages
<Route path="/admin" element={
  <ProtectedRoute requiredRoles={['CompanyAdmin']}>
    <AdminPage />
  </ProtectedRoute>
} />

// Sử dụng enum cho type safety
import { UserRole } from './types/auth';
<RoleGuard roles={[UserRole.CompanyAdmin]}>
```

### ❌ DON'T

```tsx
// Không nên check role trực tiếp
if (user?.roles.includes('CompanyAdmin')) { // ❌
  // Better: use hasRole() or RoleGuard
}

// Không nên hardcode sai tên role
<RoleGuard roles={['Admin']}> // ❌ Backend không có role này
<RoleGuard roles={['CompanyAdmin']}> // ✅ Đúng

// Không nên quên check authentication
if (hasRole('CompanyAdmin')) { // ❌ User có thể null
  // Better: RoleGuard tự động check isLoggedIn
}
```

---

## 🔄 API Integration

### Login Response từ Backend

```json
{
  "success": true,
  "message": "Login successful",
  "userId": "guid",
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "roles": ["CompanyAdmin"]
}
```

Frontend tự động:
- Parse response
- Lưu vào localStorage
- Update context
- Provide role checking methods

---

## 📊 Available Methods Summary

### AuthContext/useAuth
- `hasRole(role: string): boolean`
- `hasAnyRole(roles: string[]): boolean`
- `hasAllRoles(roles: string[]): boolean`
- `isAdmin(): boolean`

### useRole Hook
- `hasRole(role: string): boolean`
- `hasAnyRole(roles: string[]): boolean`
- `hasAllRoles(roles: string[]): boolean`
- `isAdmin(): boolean`
- `isCompanyAdmin(): boolean`
- `isDealerAdmin(): boolean`
- `isStaff(): boolean`
- `canAccess(roles: string[]): boolean`
- `getUserRoles(): string[]`

---

## 🐛 Troubleshooting

### Role không hoạt động?

1. Kiểm tra user đã login chưa
2. Kiểm tra `localStorage` có `user` object không
3. Kiểm tra `user.roles` có đúng format không (array of strings)
4. Kiểm tra spelling của role name (case-sensitive!)

### Console để debug

```tsx
const { user, getUserRoles } = useRole();
console.log('Current user:', user);
console.log('User roles:', getUserRoles());
```

---

**Status:** ✅ IMPLEMENTED  
**Date:** October 19, 2025  
**Compatible with:** Backend API v1.0
