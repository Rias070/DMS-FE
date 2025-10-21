import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleIndicator: React.FC = () => {
  const { user } = useAuth();

  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }

  const getRoleDisplayName = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      'CompanyAdmin': 'Company Administrator',
      'CompanyStaff': 'Company Staff',
      'DealerAdmin': 'Dealer Administrator', 
      'DealerStaff': 'Dealer Staff'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string): string => {
    const colorMap: { [key: string]: string } = {
      'CompanyAdmin': 'bg-blue-100 text-blue-800',
      'CompanyStaff': 'bg-green-100 text-green-800',
      'DealerAdmin': 'bg-orange-100 text-orange-800',
      'DealerStaff': 'bg-indigo-100 text-indigo-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  const primaryRole = user.roles[0];
  const roleDisplayName = getRoleDisplayName(primaryRole);
  const roleColor = getRoleColor(primaryRole);

  return (
    <div className="flex items-center space-x-2">
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${roleColor}`}>
        {roleDisplayName}
      </div>
      {user.roles.length > 1 && (
        <div className="text-xs text-gray-500">
          +{user.roles.length - 1} more
        </div>
      )}
    </div>
  );
};

export default RoleIndicator;
