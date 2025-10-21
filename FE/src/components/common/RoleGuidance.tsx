import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleGuidance: React.FC = () => {
  const { user, hasRole } = useAuth();

  if (!user) return null;

  const getRoleGuidance = () => {
    if (hasRole('CompanyAdmin')) {
      return {
        title: 'Company Administrator',
        description: 'You have full access to all system features and can manage the entire organization.',
        features: [
          'Manage all dealers and staff',
          'View system-wide analytics',
          'Configure system settings',
          'Access all reports and data'
        ],
        color: 'blue'
      };
    } else if (hasRole('CompanyStaff')) {
      return {
        title: 'Company Staff',
        description: 'You can access most features but with limited administrative privileges.',
        features: [
          'View and manage assigned tasks',
          'Access customer information',
          'Generate reports',
          'Communicate with team members'
        ],
        color: 'green'
      };
    } else if (hasRole('DealerAdmin')) {
      return {
        title: 'Dealer Administrator',
        description: 'You can manage your assigned dealers and staff within your scope.',
        features: [
          'Manage dealer operations',
          'Oversee staff performance',
          'View dealer-specific reports',
          'Coordinate with company headquarters'
        ],
        color: 'orange'
      };
    } else if (hasRole('DealerStaff')) {
      return {
        title: 'Dealer Staff',
        description: 'You can access customer-facing features and manage day-to-day operations.',
        features: [
          'Manage customer interactions',
          'Process test drives',
          'Update customer information',
          'View assigned tasks and reports'
        ],
        color: 'indigo'
      };
    }

    return {
      title: 'User',
      description: 'You have basic access to the system.',
      features: ['View basic information', 'Update profile'],
      color: 'gray'
    };
  };

  const guidance = getRoleGuidance();
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[guidance.color as keyof typeof colorClasses]}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{guidance.title}</h3>
          <p className="text-sm mb-3">{guidance.description}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium">Your capabilities:</p>
            <ul className="text-sm space-y-1">
              {guidance.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleGuidance;
