import React, { useState, useEffect } from 'react';
import PageMeta from '../components/common/PageMeta';
import RoleGuard from '../components/auth/RoleGuard';
import UserTable from '../components/tables/UserTable';
import UserFormModal from '../components/form/UserFormModal';
import UserDeleteModal from '../components/common/UserDeleteModal';
import UserDetailModal from '../components/common/UserDetailModal';
import { User, UpdateUserDto, Role } from '../types/user';
import { userService } from '../services/userService';
import { useNotification } from '../hooks/useNotification';

interface CreateUserFormData {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  roleIds: string[];
  dealerId?: string;
}

const UserManagement: React.FC = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]); // will be used when backend is ready
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    roleIds: [],
    dealerId: ''
  });

  const { showNotification } = useNotification();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Failed to fetch users', 'error');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const data = await userService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle create user
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userService.create(formData);
      showNotification('User created successfully!', 'success');
      setShowCreateForm(false);
      resetCreateForm();
      fetchUsers(); // Refresh list
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Failed to create user', 'error');
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user
  const handleEditSubmit = async (data: UpdateUserDto) => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      await userService.update(selectedUser.id, data);
      showNotification('User updated successfully!', 'success');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh list
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Failed to update user', 'error');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await userService.delete(selectedUser.id);
      showNotification('User deleted successfully!', 'success');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh list
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Failed to delete user', 'error');
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (user: User) => {
    setLoading(true);
    try {
      if (user.isActive) {
        await userService.deactivate(user.id);
        showNotification('User deactivated successfully!', 'success');
      } else {
        await userService.activate(user.id);
        showNotification('User activated successfully!', 'success');
      }
      fetchUsers(); // Refresh list
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Failed to update user status', 'error');
      console.error('Error toggling user status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  // Form handlers
  const handleInputChange = (field: keyof CreateUserFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => {
      const roleIds = prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId];
      return { ...prev, roleIds };
    });
  };

  const resetCreateForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      roleIds: [],
      dealerId: ''
    });
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.roles.some(r => r.roleName === filterRole);
      const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && user.isActive) || 
      (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <PageMeta
        title="Manage Users | DMS"
        description="Manage user accounts and permissions"
      />
      
      <RoleGuard 
        roles={['CompanyAdmin']}
        fallback={
          <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">
                Access Denied
              </h2>
              <p className="text-red-700 dark:text-red-400 mb-4">
                You do not have permission to access this page.
              </p>
              <p className="text-sm text-red-600 dark:text-red-500">
                This feature is only available for <span className="font-semibold">Company Administrators</span>.
              </p>
            </div>
          </div>
        }
      >
        <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Manage Users
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage user accounts and permissions
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New User
              </span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, username, or email..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filter by Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role.id} value={role.roleName}>{role.roleName}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New User
            </h2>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Roles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Roles *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roles.map(role => (
                    <label key={role.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.roleIds.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{role.roleName}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetCreateForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.roleIds.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <UserTable
            users={filteredUsers}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        {/* Modals */}
        <UserFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditSubmit}
          user={selectedUser}
          roles={roles}
          loading={loading}
        />

        <UserDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteConfirm}
          user={selectedUser}
          loading={loading}
        />

        <UserDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      </div>
      </RoleGuard>
    </>
  );
};

export default UserManagement;
