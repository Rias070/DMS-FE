import React from 'react';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../context/AuthContext';
import RoleGuard from '../../components/auth/RoleGuard';

/**
 * Example page demonstrating Role-Based Authorization features
 * 
 * To test: Login with dev account (username: dev, password: dev123)
 */
const RoleExamplePage: React.FC = () => {
  const { user } = useAuth();
  const { 
    hasRole, 
    isAdmin, 
    isCompanyAdmin,
    isDealerAdmin,
    isStaff,
    canAccess, 
    getUserRoles 
  } = useRole();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold mb-6">Role-Based Authorization Examples</h1>

      {/* User Info */}
      <section className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">👤 Current User Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Username:</p>
            <p className="font-medium">{user?.username || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Name:</p>
            <p className="font-medium">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email:</p>
            <p className="font-medium">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Roles:</p>
            <p className="font-medium">{getUserRoles().join(', ') || 'None'}</p>
          </div>
        </div>
        
        <div className="mt-4 flex gap-3">
          <span className={`px-3 py-1 rounded text-sm ${isAdmin() ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
            {isAdmin() ? '✅' : '❌'} Admin
          </span>
          <span className={`px-3 py-1 rounded text-sm ${isCompanyAdmin() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {isCompanyAdmin() ? '✅' : '❌'} Company Admin
          </span>
          <span className={`px-3 py-1 rounded text-sm ${isDealerAdmin() ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
            {isDealerAdmin() ? '✅' : '❌'} Dealer Admin
          </span>
          <span className={`px-3 py-1 rounded text-sm ${isStaff() ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
            {isStaff() ? '✅' : '❌'} Staff
          </span>
        </div>
      </section>

      {/* Example 1: RoleGuard Basic */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">1️⃣ RoleGuard - Basic Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="border p-4 rounded bg-white">
            <p className="text-sm text-gray-600 mb-3">Only CompanyAdmin can see:</p>
            <RoleGuard roles={['CompanyAdmin']}>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">
                🗑️ Delete User (CompanyAdmin)
              </button>
            </RoleGuard>
            <RoleGuard roles={['CompanyAdmin']} inverse>
              <p className="text-gray-500 italic text-sm">You need CompanyAdmin role</p>
            </RoleGuard>
          </div>

          <div className="border p-4 rounded bg-white">
            <p className="text-sm text-gray-600 mb-3">CompanyAdmin OR DealerAdmin:</p>
            <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                ✏️ Edit Content (Any Admin)
              </button>
            </RoleGuard>
            <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']} inverse>
              <p className="text-gray-500 italic text-sm">You need admin role</p>
            </RoleGuard>
          </div>

          <div className="border p-4 rounded bg-white">
            <p className="text-sm text-gray-600 mb-3">Staff roles (CompanyStaff OR DealerStaff):</p>
            <RoleGuard roles={['CompanyStaff', 'DealerStaff']}>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                📋 View Reports (Staff)
              </button>
            </RoleGuard>
            <RoleGuard roles={['CompanyStaff', 'DealerStaff']} inverse>
              <p className="text-gray-500 italic text-sm">You need staff role</p>
            </RoleGuard>
          </div>

          <div className="border p-4 rounded bg-white">
            <p className="text-sm text-gray-600 mb-3">With fallback message:</p>
            <RoleGuard 
              roles={['CompanyAdmin']} 
              fallback={
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
                  ⚠️ CompanyAdmin access required
                </div>
              }
            >
              <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full">
                ⚙️ System Settings
              </button>
            </RoleGuard>
          </div>
        </div>
      </section>

      {/* Example 2: useRole Hook */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">2️⃣ useRole Hook Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="border p-4 rounded bg-white">
            <p className="text-sm font-semibold mb-2">Role Checking Methods:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <code>hasRole('CompanyAdmin')</code>
                <span className={hasRole('CompanyAdmin') ? 'text-green-600' : 'text-red-600'}>
                  {hasRole('CompanyAdmin') ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <code>isAdmin()</code>
                <span className={isAdmin() ? 'text-green-600' : 'text-red-600'}>
                  {isAdmin() ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <code>isCompanyAdmin()</code>
                <span className={isCompanyAdmin() ? 'text-green-600' : 'text-red-600'}>
                  {isCompanyAdmin() ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <code>isDealerAdmin()</code>
                <span className={isDealerAdmin() ? 'text-green-600' : 'text-red-600'}>
                  {isDealerAdmin() ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <code>isStaff()</code>
                <span className={isStaff() ? 'text-green-600' : 'text-red-600'}>
                  {isStaff() ? '✅' : '❌'}
                </span>
              </div>
            </div>
          </div>

          <div className="border p-4 rounded bg-white">
            <p className="text-sm font-semibold mb-2">canAccess Method:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <code className="text-xs">['CompanyAdmin']</code>
                <span className={canAccess(['CompanyAdmin']) ? 'text-green-600' : 'text-red-600'}>
                  {canAccess(['CompanyAdmin']) ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <code className="text-xs">['CompanyAdmin', 'DealerAdmin']</code>
                <span className={canAccess(['CompanyAdmin', 'DealerAdmin']) ? 'text-green-600' : 'text-red-600'}>
                  {canAccess(['CompanyAdmin', 'DealerAdmin']) ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex justify-between">
                <code className="text-xs">['CompanyStaff', 'DealerStaff']</code>
                <span className={canAccess(['CompanyStaff', 'DealerStaff']) ? 'text-green-600' : 'text-red-600'}>
                  {canAccess(['CompanyStaff', 'DealerStaff']) ? '✅' : '❌'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example 3: Conditional Rendering */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">3️⃣ Conditional Rendering</h2>
        <div className="space-y-4">
          
          {isAdmin() && (
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <h3 className="font-semibold text-red-800">🔴 Admin Section</h3>
              <p className="text-sm text-red-600">Only visible to CompanyAdmin or DealerAdmin</p>
            </div>
          )}

          {isCompanyAdmin() && (
            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <h3 className="font-semibold text-green-800">🟢 Company Admin Section</h3>
              <p className="text-sm text-green-600">Only visible to CompanyAdmin</p>
            </div>
          )}

          {isStaff() && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <h3 className="font-semibold text-blue-800">🔵 Staff Section</h3>
              <p className="text-sm text-blue-600">Visible to CompanyStaff or DealerStaff</p>
            </div>
          )}

          {!isAdmin() && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded">
              <h3 className="font-semibold text-gray-800">⚪ Regular User Section</h3>
              <p className="text-sm text-gray-600">You are not an admin</p>
            </div>
          )}
        </div>
      </section>

      {/* Example 4: Navigation Menu */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">4️⃣ Role-Based Navigation</h2>
        <nav className="border p-4 rounded bg-white">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <a href="#" className="text-blue-600 hover:underline">🏠 Home (Everyone)</a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <a href="#" className="text-blue-600 hover:underline">📊 Dashboard (Everyone)</a>
            </li>
            
            <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']}>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <a href="#" className="text-blue-600 hover:underline">
                  ⚙️ Management (Any Admin)
                </a>
              </li>
            </RoleGuard>

            <RoleGuard roles={['CompanyAdmin']}>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <a href="#" className="text-blue-600 hover:underline">
                  👥 User Management (CompanyAdmin)
                </a>
              </li>
            </RoleGuard>

            <RoleGuard roles={['CompanyStaff', 'DealerStaff']}>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <a href="#" className="text-blue-600 hover:underline">
                  📋 Tasks (Staff)
                </a>
              </li>
            </RoleGuard>
          </ul>
        </nav>
      </section>

      {/* Example 5: Action Buttons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">5️⃣ Role-Based Actions</h2>
        <div className="border p-4 rounded bg-white">
          <div className="flex flex-wrap gap-3">
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              👀 View (Everyone)
            </button>

            <RoleGuard roles={['CompanyAdmin', 'DealerAdmin', 'CompanyStaff', 'DealerStaff']}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                ✏️ Edit (Staff+)
              </button>
            </RoleGuard>

            <RoleGuard roles={['CompanyAdmin', 'DealerAdmin']}>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                📝 Approve (Admin)
              </button>
            </RoleGuard>

            <RoleGuard roles={['CompanyAdmin']}>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                🗑️ Delete (CompanyAdmin)
              </button>
            </RoleGuard>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3 text-lg">💡 Testing Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border border-blue-300">
            <p className="font-semibold text-blue-800 mb-2">Dev Account (No Backend):</p>
            <div className="text-sm space-y-1">
              <p><strong>Username:</strong> dev</p>
              <p><strong>Password:</strong> dev123</p>
              <p><strong>Role:</strong> CompanyAdmin</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-blue-300">
            <p className="font-semibold text-blue-800 mb-2">Backend Demo Accounts:</p>
            <div className="text-sm space-y-1">
              <p><strong>Username:</strong> admin1, admin2, admin3</p>
              <p><strong>Password:</strong> admin123</p>
              <p><strong>Role:</strong> CompanyAdmin</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-300 p-3 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Role names are case-sensitive. Use exactly: 
            <code className="mx-1 bg-yellow-100 px-1 rounded">CompanyAdmin</code>,
            <code className="mx-1 bg-yellow-100 px-1 rounded">CompanyStaff</code>,
            <code className="mx-1 bg-yellow-100 px-1 rounded">DealerAdmin</code>,
            <code className="mx-1 bg-yellow-100 px-1 rounded">DealerStaff</code>
          </p>
        </div>
      </section>
    </div>
  );
};

export default RoleExamplePage;
