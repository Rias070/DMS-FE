import React from 'react';
import PageMeta from '../components/common/PageMeta';

const UserManagement: React.FC = () => {
  return (
    <>
      <PageMeta
        title="User Management | DMS"
        description="Manage user accounts and permissions"
      />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              User Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This page will contain user management functionality.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-800 dark:text-blue-200 text-sm">
                  Coming soon - User CRUD operations will be implemented here
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
