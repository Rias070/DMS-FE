import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[] | UserRole[]; // Roles được phép truy cập
  requireAll?: boolean; // Yêu cầu có tất cả roles (default: false - chỉ cần 1)
  fallbackPath?: string; // Redirect path khi không có quyền (default: /signin)
}

/**
 * Protected Route Component - Bảo vệ routes dựa trên authentication và authorization
 * 
 * @example
 * // Chỉ cần đăng nhập
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Chỉ CompanyAdmin mới vào được
 * <ProtectedRoute requiredRoles={['CompanyAdmin']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * @example
 * // CompanyAdmin HOẶC DealerAdmin
 * <ProtectedRoute requiredRoles={['CompanyAdmin', 'DealerAdmin']}>
 *   <ManagementPanel />
 * </ProtectedRoute>
 * 
 * @example
 * // Cần CẢ CompanyAdmin VÀ DealerAdmin
 * <ProtectedRoute requiredRoles={['CompanyAdmin', 'DealerAdmin']} requireAll>
 *   <SpecialPage />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles,
  requireAll = false,
  fallbackPath = '/signin'
}) => {
  const { isLoggedIn, loading, hasAnyRole, hasAllRoles } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Kiểm tra đăng nhập
  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền nếu có yêu cầu roles
  if (requiredRoles && requiredRoles.length > 0) {
    const hasPermission = requireAll 
      ? hasAllRoles(requiredRoles as string[])
      : hasAnyRole(requiredRoles as string[]);

    if (!hasPermission) {
      // User đã đăng nhập nhưng không có quyền
      return (
        <Navigate 
          to={fallbackPath} 
          state={{ 
            from: location,
            error: 'You do not have permission to access this page'
          }} 
          replace 
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;