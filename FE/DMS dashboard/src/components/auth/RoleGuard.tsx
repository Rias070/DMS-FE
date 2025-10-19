import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  roles?: string[] | UserRole[]; // Roles được phép xem
  requireAll?: boolean; // Yêu cầu có tất cả roles (default: false)
  fallback?: React.ReactNode; // Component hiển thị khi không có quyền
  inverse?: boolean; // Đảo ngược logic - hiển thị khi KHÔNG có role
}

/**
 * RoleGuard Component - Ẩn/hiện UI elements dựa trên role
 * 
 * @example
 * // Chỉ CompanyAdmin mới thấy
 * <RoleGuard roles={['CompanyAdmin']}>
 *   <button>Delete User</button>
 * </RoleGuard>
 * 
 * @example
 * // CompanyAdmin HOẶC DealerAdmin mới thấy
 * <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']}>
 *   <button>Edit Content</button>
 * </RoleGuard>
 * 
 * @example
 * // Cần CẢ CompanyAdmin VÀ DealerAdmin
 * <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']} requireAll>
 *   <button>Special Action</button>
 * </RoleGuard>
 * 
 * @example
 * // Hiển thị fallback khi không có quyền
 * <RoleGuard roles={['CompanyAdmin']} fallback={<span>Admin only</span>}>
 *   <button>Delete</button>
 * </RoleGuard>
 * 
 * @example
 * // Đảo ngược - chỉ hiển thị cho user KHÔNG phải Admin
 * <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']} inverse>
 *   <div>You are not an admin</div>
 * </RoleGuard>
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  roles,
  requireAll = false,
  fallback = null,
  inverse = false
}) => {
  const { hasAnyRole, hasAllRoles, isLoggedIn } = useAuth();

  // Nếu chưa đăng nhập, không hiển thị gì
  if (!isLoggedIn) {
    return <>{fallback}</>;
  }

  // Nếu không yêu cầu roles cụ thể, hiển thị cho tất cả user đã đăng nhập
  if (!roles || roles.length === 0) {
    return <>{children}</>;
  }

  // Kiểm tra quyền
  const hasPermission = requireAll 
    ? hasAllRoles(roles as string[])
    : hasAnyRole(roles as string[]);

  // Đảo ngược logic nếu inverse = true
  const shouldRender = inverse ? !hasPermission : hasPermission;

  return <>{shouldRender ? children : fallback}</>;
};

export default RoleGuard;
