import React, { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { restockRequestService } from '../../services/restockRequestService';
import { RestockRequest, RestockRequestStatus, RestockRequestFilters } from '../../types/restockRequest';
import RestockRequestList from '../../components/restock/RestockRequestList';

const RestockManagement: React.FC = () => {
  const [requests, setRequests] = useState<RestockRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<RestockRequestFilters>({
    status: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load restock requests
  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await restockRequestService.getAllForDealer(filters);
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách yêu cầu nhập hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [filters]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handle approve
  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    setError(null);
    try {
      await restockRequestService.approve(id);
      setSuccess('Phê duyệt và gửi yêu cầu lên công ty thành công!');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Không thể phê duyệt yêu cầu');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle reject
  const handleReject = async (id: string, reason: string) => {
    setActionLoadingId(id);
    setError(null);
    try {
      await restockRequestService.reject(id, reason);
      setSuccess('Từ chối yêu cầu thành công!');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Không thể từ chối yêu cầu');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleFilterChange = (field: keyof RestockRequestFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'all' });
  };

  return (
    <>
      <PageMeta
        title="Quản lý yêu cầu nhập hàng | DMS"
        description="Quản lý và phê duyệt yêu cầu nhập hàng"
      />
      <PageBreadcrumb pageTitle="Quản lý yêu cầu nhập hàng" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách yêu cầu nhập hàng
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {showFilters ? 'Ẩn lọc' : 'Lọc'}
              </span>
            </button>
            <button
              onClick={loadRequests}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Làm mới
              </span>
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bộ lọc tìm kiếm
              </h4>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Xóa bộ lọc
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Status Filter */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Trạng thái
                </label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">Tất cả</option>
                  <option value={RestockRequestStatus.Pending}>Chờ phê duyệt</option>
                  <option value={RestockRequestStatus.Escalated}>Đã gửi lên công ty</option>
                  <option value={RestockRequestStatus.Rejected}>Đã từ chối</option>
                  <option value={RestockRequestStatus.Approved}>Đã được phê duyệt</option>
                  <option value={RestockRequestStatus.CompanyRejected}>Công ty từ chối</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Requests List */}
        <RestockRequestList
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
          isLoading={loading}
          actionLoadingId={actionLoadingId}
        />
      </div>
    </>
  );
};

export default RestockManagement;
