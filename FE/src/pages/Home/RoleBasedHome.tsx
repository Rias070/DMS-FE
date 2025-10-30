import React from 'react';
import { useRole } from '../../hooks/useRole';
import CompanyAdminHome from './CompanyAdminHome';
import CompanyStaffHome from './CompanyStaffHome';
import DealerAdminHome from './DealerAdminHome';
import DealerStaffHome from './DealerStaffHome';

const RoleBasedHome: React.FC = () => {
  const { isCompanyAdmin, isDealerAdmin, isStaff, hasRole } = useRole();

  // CompanyAdmin - Highest priority
  if (isCompanyAdmin()) {
    return <CompanyAdminHome />;
  }

  // DealerAdmin - Second priority
  if (isDealerAdmin()) {
    return <DealerAdminHome />;
  }

  // Staff roles (CompanyStaff or DealerStaff)
  if (isStaff()) {
    // Check if it's CompanyStaff or DealerStaff
    if (hasRole('CompanyStaff')) {
      return <CompanyStaffHome />;
    } else {
      return <DealerStaffHome />;
    }
  }

  // Fallback - Default dashboard
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your role is being determined. Please contact administrator if you don't see your dashboard.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800 text-sm">Role not recognized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedHome;
