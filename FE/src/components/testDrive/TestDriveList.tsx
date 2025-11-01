import React, { useState, useEffect, useRef } from 'react';
import { TestDriveRecord, TestDriveStatus, TestDriveFilters } from '../../types/testDrive';
import testDriveService from '../../services/testDriveService';
import TestDriveCard from './TestDriveCard';
import { CalenderIcon } from '../../icons';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

const TestDriveList: React.FC = () => {
  const [testDrives, setTestDrives] = useState<TestDriveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TestDriveFilters>({
    status: 'all',
    fromDate: '',
    toDate: ''
  });
  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);
  const fromDatePickerRef = useRef<flatpickr.Instance | null>(null);
  const toDatePickerRef = useRef<flatpickr.Instance | null>(null);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => {
      if (field === 'status') {
        // Keep 'all' as string or TestDriveStatus, don't convert to undefined here
        return { ...prev, status: value as TestDriveStatus | 'all' };
      }
      // For date fields, convert empty string to undefined
      if (field === 'fromDate' || field === 'toDate') {
        return { ...prev, [field]: value || undefined };
      }
      return { ...prev, [field]: value };
    });
  };

  useEffect(() => {
    loadTestDrives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Initialize flatpickr for date inputs
  useEffect(() => {
    if (fromDateRef.current && !fromDatePickerRef.current) {
      fromDatePickerRef.current = flatpickr(fromDateRef.current, {
        dateFormat: 'Y-m-d',
        defaultDate: filters.fromDate || undefined,
        onChange: (_selectedDates, dateStr) => {
          handleFilterChange('fromDate', dateStr);
        },
      });
    }

    if (toDateRef.current && !toDatePickerRef.current) {
      toDatePickerRef.current = flatpickr(toDateRef.current, {
        dateFormat: 'Y-m-d',
        defaultDate: filters.toDate || undefined,
        onChange: (_selectedDates, dateStr) => {
          handleFilterChange('toDate', dateStr);
        },
      });
    }

    return () => {
      if (fromDatePickerRef.current) {
        fromDatePickerRef.current.destroy();
        fromDatePickerRef.current = null;
      }
      if (toDatePickerRef.current) {
        toDatePickerRef.current.destroy();
        toDatePickerRef.current = null;
      }
    };
  }, []);

  // Update flatpickr when filters change (for clear filters)
  // Use flag to prevent infinite loop when flatpickr onChange triggers setFilters
  const isUpdatingFromClearRef = useRef(false);
  
  useEffect(() => {
    if (fromDatePickerRef.current && !isUpdatingFromClearRef.current) {
      if (filters.fromDate) {
        fromDatePickerRef.current.setDate(filters.fromDate, false);
      } else {
        fromDatePickerRef.current.clear();
      }
    }
    isUpdatingFromClearRef.current = false;
  }, [filters.fromDate]);

  useEffect(() => {
    if (toDatePickerRef.current && !isUpdatingFromClearRef.current) {
      if (filters.toDate) {
        toDatePickerRef.current.setDate(filters.toDate, false);
      } else {
        toDatePickerRef.current.clear();
      }
    }
    isUpdatingFromClearRef.current = false;
  }, [filters.toDate]);

  const loadTestDrives = async () => {
    try {
      setLoading(true);
      // Normalize filters - convert empty strings to undefined and status to proper format
      // Format dates to ISO 8601 with UTC timezone for PostgreSQL compatibility
      const formatDateForAPI = (dateStr: string | undefined): string | undefined => {
        if (!dateStr || dateStr.trim() === '') return undefined;
        // If date is already in format YYYY-MM-DD, add time and timezone
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return undefined;
        // Set to UTC midnight
        const utcDate = new Date(Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0, 0, 0, 0
        ));
        // Return ISO 8601 format with UTC timezone
        return utcDate.toISOString();
      };

      const normalizedFilters: TestDriveFilters = {
        ...filters,
        fromDate: formatDateForAPI(filters.fromDate),
        toDate: formatDateForAPI(filters.toDate),
        status: filters.status === 'all' ? undefined : (filters.status || undefined),
      };
      
      console.log('Loading test drives with filters:', normalizedFilters);
      const data = await testDriveService.getAll(normalizedFilters);
      console.log('Loaded test drives:', data);
      setTestDrives(data);
    } catch (error) {
      console.error('Error loading test drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (_id: string, _newStatus: TestDriveStatus) => {
    // DealerStaff không thể thay đổi status
    console.log('DealerStaff cannot change status');
  };

  const clearFilters = () => {
    isUpdatingFromClearRef.current = true;
    setFilters({
      status: 'all',
      fromDate: '',
      toDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Danh sách lịch lái thử</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select 
              value={filters.status || 'all'} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={TestDriveStatus.PENDING}>Chờ duyệt</option>
              <option value={TestDriveStatus.APPROVED}>Đã duyệt</option>
              <option value={TestDriveStatus.REJECTED}>Từ chối</option>
              <option value={TestDriveStatus.COMPLETED}>Hoàn thành</option>
              <option value={TestDriveStatus.CANCELLED}>Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <div className="relative">
              <input
                ref={fromDateRef}
                type="text"
                placeholder="Chọn ngày"
                readOnly
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalenderIcon className="size-5" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <div className="relative">
              <input
                ref={toDateRef}
                type="text"
                placeholder="Chọn ngày"
                readOnly
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalenderIcon className="size-5" />
              </span>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 mb-4">
          Tìm thấy {testDrives.length} lịch lái thử
        </div>
      </div>

      {/* Test Drive Cards */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải...</span>
        </div>
      ) : testDrives.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch lái thử</h3>
            <p className="mt-1 text-sm text-gray-500">Chưa có lịch lái thử nào được tạo.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {testDrives.map((testDrive) => (
            <TestDriveCard 
              key={testDrive.id} 
              testDrive={testDrive}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestDriveList;