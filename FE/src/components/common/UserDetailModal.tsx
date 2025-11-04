import React from 'react';
import { User } from '../../types/user';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const getRoleBadgeColor = (roleName: string): string => {
    const roleColors: Record<string, string> = {
      'CompanyAdmin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'CompanyManager': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'CompanyStaff': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'DealerAdmin': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'DealerManager': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      'DealerStaff': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    };
    return roleColors[roleName] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                User Details
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* User Avatar and Basic Info */}
            <div className="flex items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 h-20 w-20">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                <div className="mt-2">
                  {user.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{user.email}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{user.phone}</p>
              </div>

              {/* Contact Person */}
              {user.contactPerson && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Contact Person
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user.contactPerson}
                  </p>
                </div>
              )}

              {/* Dealer */}
              {user.dealerName && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Dealer
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{user.dealerName}</p>
                </div>
              )}

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{user.address}</p>
              </div>

              {/* Roles */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(
                          role.roleName
                        )}`}
                      >
                        {role.roleName}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</span>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Updated At */}
              {user.updatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Updated
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* User ID */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  User ID
                </label>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 font-mono">
                  {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
