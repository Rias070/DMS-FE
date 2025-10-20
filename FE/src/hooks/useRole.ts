import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

/**
 * Custom hook để kiểm tra quyền của user
 * Sử dụng: const { hasRole, isAdmin, canAccess } = useRole();
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { hasRole, isAdmin, canAccess } = useRole();
 *   
 *   if (isAdmin()) {
 *     return <AdminPanel />;
 *   }
 *   
 *   if (canAccess(['CompanyAdmin', 'DealerAdmin'])) {
 *     return <ManagementPanel />;
 *   }
 *   
 *   return <UserPanel />;
 * }
 * ```
 */
export const useRole = () => {
  const { user, hasRole, hasAnyRole, hasAllRoles, isAdmin } = useAuth();

  /**
   * Kiểm tra xem user có quyền truy cập không
   * @param allowedRoles - Danh sách roles được phép
   * @returns true nếu user có ít nhất 1 role trong danh sách
   */
  const canAccess = (allowedRoles: string[] | UserRole[]): boolean => {
    return hasAnyRole(allowedRoles as string[]);
  };

  /**
   * Kiểm tra xem user có phải Admin không (CompanyAdmin hoặc DealerAdmin)
   */
  const checkIsAdmin = (): boolean => {
    return isAdmin();
  };

  /**
   * Lấy danh sách roles của user hiện tại
   */
  const getUserRoles = (): string[] => {
    return user?.roles || [];
  };

  /**
   * Kiểm tra user có role cụ thể không
   */
  const checkHasRole = (role: string | UserRole): boolean => {
    return hasRole(role as string);
  };

  /**
   * Kiểm tra user có tất cả roles không
   */
  const checkHasAllRoles = (roles: string[] | UserRole[]): boolean => {
    return hasAllRoles(roles as string[]);
  };

  /**
   * Kiểm tra user có phải CompanyAdmin không
   */
  const isCompanyAdmin = (): boolean => {
    return hasRole(UserRole.CompanyAdmin);
  };

  /**
   * Kiểm tra user có phải DealerAdmin không
   */
  const isDealerAdmin = (): boolean => {
    return hasRole(UserRole.DealerAdmin);
  };

  /**
   * Kiểm tra user có phải Staff (CompanyStaff hoặc DealerStaff) không
   */
  const isStaff = (): boolean => {
    return hasAnyRole([UserRole.CompanyStaff, UserRole.DealerStaff]);
  };

  return {
    // Core role checking methods
    hasRole: checkHasRole,
    hasAnyRole: canAccess,
    hasAllRoles: checkHasAllRoles,
    
    // Convenience methods
    isAdmin: checkIsAdmin,
    isCompanyAdmin,
    isDealerAdmin,
    isStaff,
    canAccess,
    
    // Utility
    getUserRoles,
  };
};

export default useRole;
