import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Feature {
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const AccessibleFeatures: React.FC = () => {
  const { user, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const allFeatures: Feature[] = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      description: 'Main dashboard',
      color: 'blue'
    },
    {
      name: 'Products',
      path: '/ecommerce/products',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      description: 'Manage products',
      color: 'green'
    },
    {
      name: 'Orders',
      path: '/ecommerce/orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      description: 'View orders',
      color: 'purple'
    },
    {
      name: 'Customers',
      path: '/ecommerce/customers',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      description: 'Manage customers',
      color: 'orange'
    },
    {
      name: 'Test Drive',
      path: '/test-drive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Test drive management',
      color: 'red',
      roles: ['DealerAdmin', 'DealerStaff']
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Calendar view',
      color: 'indigo'
    },
    {
      name: 'Inbox',
      path: '/inbox',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Messages and notifications',
      color: 'pink'
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'User profile',
      color: 'teal'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      green: 'bg-green-100 text-green-800 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      red: 'bg-red-100 text-red-800 hover:bg-red-200',
      indigo: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
      teal: 'bg-teal-100 text-teal-800 hover:bg-teal-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const accessibleFeatures = allFeatures.filter(feature => {
    if (feature.roles) {
      return hasAnyRole(feature.roles);
    }
    return true; // Features without roles are accessible to all
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Available Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accessibleFeatures.map((feature, index) => (
          <button
            key={index}
            onClick={() => navigate(feature.path)}
            className={`p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-all duration-200 ${getColorClasses(feature.color)}`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <div className="text-left">
                <p className="font-medium">{feature.name}</p>
                <p className="text-sm opacity-75">{feature.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccessibleFeatures;
