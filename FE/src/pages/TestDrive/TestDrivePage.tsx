import React, { useState } from 'react';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../context/AuthContext';
import TestDriveList from '../../components/testDrive/TestDriveList';
import TestDriveApprovalList from '../../components/testDrive/TestDriveApprovalList';
import CreateTestDriveForm from '../../components/testDrive/CreateTestDriveForm';
import ApiDebug from '../../components/debug/ApiDebug';

const TestDrivePage: React.FC = () => {
  const { hasRole } = useRole();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'approval'>('list');

  const renderContent = () => {
    // Check user roles
    if (hasRole('DealerStaff')) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Quản lý lịch lái thử</h1>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowCreateForm(true)}
              >
                Tạo lịch mới
              </button>
            </div>
          </div>
          
          {showCreateForm ? (
            <CreateTestDriveForm
              onSuccess={() => {
                setShowCreateForm(false);
                // Reload list if needed
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <TestDriveList />
          )}
        </div>
      );
    }

    if (hasRole('DealerAdmin')) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Quản lý lịch lái thử</h1>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('approval')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'approval'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Chờ duyệt ({/* Count will be added here */})
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'list'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tất cả lịch
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'approval' ? (
            <TestDriveApprovalList />
          ) : (
            <TestDriveList />
          )}
        </div>
      );
    }

    // Default case - no access
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có quyền truy cập</h3>
          <p className="mt-1 text-sm text-gray-500">Bạn không có quyền truy cập chức năng này.</p>
          <p className="mt-2 text-xs text-gray-400">Current user: {user?.username} | Roles: {user?.roles?.join(', ')}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="test-drive-page">
      <ApiDebug />
      {renderContent()}
    </div>
  );
};

export default TestDrivePage;
