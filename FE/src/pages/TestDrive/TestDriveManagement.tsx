import { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import TestDriveForm from '../../components/testDrive/TestDriveForm';
import TestDriveList from '../../components/testDrive/TestDriveList';
import testDriveService from '../../services/testDriveService';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import {
  TestDriveRecord,
  CreateTestDriveRequest,
  TestDriveStatus,
  Vehicle,
  Dealer,
  TestDriveFilters,
} from '../../types/testDrive';

type ViewMode = 'list' | 'create' | 'edit';

export default function TestDriveManagement() {
  const { hasAnyRole } = useAuth();
  const [testDrives, setTestDrives] = useState<TestDriveRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTestDrive, setSelectedTestDrive] = useState<TestDriveRecord | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<TestDriveFilters>({
    status: 'all',
  });

  // Check if user has access
  const hasAccess = hasAnyRole(['DealerAdmin', 'DealerStaff']);

  // Load initial data
  useEffect(() => {
    if (hasAccess) {
      loadData();
    }
  }, [filters, hasAccess]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [testDrivesData, vehiclesData, dealersData] = await Promise.all([
        testDriveService.getAll(filters),
        testDriveService.getVehicles(),
        testDriveService.getDealers(),
      ]);

      setTestDrives(testDrivesData);
      setVehicles(vehiclesData);
      setDealers(dealersData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTestDrive(undefined);
    setViewMode('create');
    setError(null);
    setSuccessMessage(null);
  };

  const handleEdit = (testDrive: TestDriveRecord) => {
    setSelectedTestDrive(testDrive);
    setViewMode('edit');
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedTestDrive(undefined);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (data: CreateTestDriveRequest) => {
    setIsSaving(true);
    setError(null);

    try {
      if (viewMode === 'edit' && selectedTestDrive) {
        // Update existing
        await testDriveService.update(selectedTestDrive.id, data);
        setSuccessMessage('Cập nhật lịch hẹn thành công!');
      } else {
        // Create new
        await testDriveService.create(data);
        setSuccessMessage('Tạo lịch hẹn thành công!');
      }

      // Reload data and return to list
      await loadData();
      setViewMode('list');
      setSelectedTestDrive(undefined);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving test drive:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể lưu lịch hẹn. Vui lòng thử lại.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await testDriveService.delete(id);
      setSuccessMessage('Xóa lịch hẹn thành công!');
      await loadData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting test drive:', err);
      setError('Không thể xóa lịch hẹn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (testDriveId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = authService.getCurrentUser();
      await testDriveService.approve({
        testDriveId,
        approvedBy: user?.id || '',
      });
      setSuccessMessage('Đã phê duyệt lịch hẹn thành công!');
      await loadData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error approving test drive:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể phê duyệt lịch hẹn. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (testDriveId: string, reason: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = authService.getCurrentUser();
      await testDriveService.reject({
        testDriveId,
        rejectedBy: user?.id || '',
        rejectionReason: reason,
      });
      setSuccessMessage('Đã từ chối lịch hẹn!');
      await loadData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error rejecting test drive:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể từ chối lịch hẹn. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterKey: keyof TestDriveFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({ status: 'all' });
  };

  // Access denied UI
  if (!hasAccess) {
    return (
      <>
        <PageMeta title="Quản lý lịch hẹn lái thử" description="Test Drive Management" />
        <PageBreadcrumb pageTitle="Lịch hẹn lái thử" />
        
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <svg
                className="h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Không có quyền truy cập
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Trang này chỉ dành cho <strong>Nhân viên Đại lý</strong> và <strong>Quản lý Đại lý</strong>.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Quản lý lịch hẹn lái thử" description="Test Drive Management" />
      <PageBreadcrumb pageTitle="Lịch hẹn lái thử" />

      {/* Alert Messages */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-green-800 dark:text-green-300">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-600 hover:text-green-800 dark:text-green-400"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {viewMode === 'list' && 'Danh sách lịch hẹn lái thử'}
            {viewMode === 'create' && 'Tạo lịch hẹn mới'}
            {viewMode === 'edit' && 'Chỉnh sửa lịch hẹn'}
          </h3>

          {viewMode === 'list' && hasAnyRole(['DealerAdmin', 'DealerStaff']) && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tạo lịch hẹn mới
            </button>
          )}
        </div>

        {/* Filters (only show in list view) */}
        {viewMode === 'list' && (
          <div className="mb-5 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Trạng thái
              </label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tất cả</option>
                <option value={TestDriveStatus.PENDING}>Chờ phê duyệt</option>
                <option value={TestDriveStatus.APPROVED}>Đã phê duyệt</option>
                <option value={TestDriveStatus.REJECTED}>Đã từ chối</option>
                <option value={TestDriveStatus.COMPLETED}>Đã hoàn thành</option>
                <option value={TestDriveStatus.CANCELLED}>Đã hủy</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Đại lý
              </label>
              <select
                value={filters.dealerId || ''}
                onChange={(e) => handleFilterChange('dealerId', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tất cả đại lý</option>
                {dealers.map((dealer) => (
                  <option key={dealer.id} value={dealer.id}>
                    {dealer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Xe
              </label>
              <select
                value={filters.vehicleId || ''}
                onChange={(e) => handleFilterChange('vehicleId', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tất cả xe</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === 'list' ? (
          <TestDriveList
            testDrives={testDrives}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isLoading}
          />
        ) : (
          <TestDriveForm
            testDrive={selectedTestDrive}
            vehicles={vehicles}
            dealers={dealers}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        )}
      </div>
    </>
  );
}

