import React from 'react';
import { 
  TestDriveRecord, 
  TestDriveStatus, 
  TestDriveStatusDisplay, 
  TestDriveStatusColor 
} from '../../types/testDrive';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ApprovalActions from './ApprovalActions';
import { useAuth } from '../../context/AuthContext';

interface TestDriveListProps {
  testDrives: TestDriveRecord[];
  onEdit: (testDrive: TestDriveRecord) => void;
  onDelete: (id: string) => void;
  onView?: (testDrive: TestDriveRecord) => void;
  onApprove?: (testDriveId: string) => void;
  onReject?: (testDriveId: string, reason: string) => void;
  isLoading?: boolean;
}

export default function TestDriveList({
  testDrives,
  onEdit,
  onDelete,
  onView,
  onApprove,
  onReject,
  isLoading = false,
}: TestDriveListProps) {
  const { hasRole } = useAuth();
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: TestDriveStatus) => {
    const color = TestDriveStatusColor[status];
    const displayName = TestDriveStatusDisplay[status];

    const colorClasses: Record<string, string> = {
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[color] || colorClasses.gray}`}
      >
        {displayName}
      </span>
    );
  };

  const handleDelete = (id: string, customerName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lịch hẹn của "${customerName}"?`)) {
      onDelete(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-brand-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (testDrives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
          Chưa có lịch hẹn lái thử
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tạo lịch hẹn mới để bắt đầu quản lý
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 dark:border-gray-700">
          <tr className="text-sm font-medium text-gray-700 dark:text-gray-300">
            <th className="py-3 pr-4">Khách hàng</th>
            <th className="py-3 pr-4">Số điện thoại</th>
            <th className="py-3 pr-4">Xe</th>
            <th className="py-3 pr-4">Đại lý</th>
            <th className="py-3 pr-4">Ngày & Giờ</th>
            <th className="py-3 pr-4">Trạng thái</th>
            <th className="py-3 pr-4">Người tạo</th>
            <th className="py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {testDrives.map((testDrive) => (
            <tr
              key={testDrive.id}
              className="text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.02]"
            >
              <td className="py-3 pr-4">
                <div className="font-medium">{testDrive.customerName}</div>
                {testDrive.notes && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {testDrive.notes}
                  </div>
                )}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">{testDrive.customerContact}</td>
              <td className="py-3 pr-4">
                {testDrive.vehicle ? (
                  <div>
                    <div className="font-medium">
                      {testDrive.vehicle.make} {testDrive.vehicle.model}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testDrive.vehicle.year} - {testDrive.vehicle.color}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="py-3 pr-4">
                {testDrive.dealer ? (
                  <div>
                    <div className="font-medium">{testDrive.dealer.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testDrive.dealer.location}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">{formatDate(testDrive.testDate)}</td>
              <td className="py-3 pr-4">
                <div className="flex flex-col gap-1">
                  {getStatusBadge(testDrive.status)}
                  {testDrive.status === TestDriveStatus.REJECTED && testDrive.rejectionReason && (
                    <p className="text-xs text-red-600 dark:text-red-400" title={testDrive.rejectionReason}>
                      ❌ {testDrive.rejectionReason.substring(0, 50)}
                      {testDrive.rejectionReason.length > 50 ? '...' : ''}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-3 pr-4">
                {testDrive.createdByName ? (
                  <div className="text-sm">
                    <div className="font-medium">{testDrive.createdByName}</div>
                    {testDrive.approvedByName && testDrive.status === TestDriveStatus.APPROVED && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ✓ {testDrive.approvedByName}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  {/* Manager Approval Actions */}
                  {hasRole('DealerAdmin') && onApprove && onReject && (
                    <ApprovalActions
                      testDrive={testDrive}
                      onApprove={onApprove}
                      onReject={onReject}
                      isLoading={isLoading}
                    />
                  )}

                  {/* View Button */}
                  {onView && (
                    <button
                      onClick={() => onView(testDrive)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Xem chi tiết"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Edit Button - Only for Staff on Pending/Rejected, or Manager */}
                  {((hasRole('DealerStaff') && 
                    (testDrive.status === TestDriveStatus.PENDING || 
                     testDrive.status === TestDriveStatus.REJECTED)) ||
                   hasRole('DealerAdmin')) && (
                    <button
                      onClick={() => onEdit(testDrive)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title="Chỉnh sửa"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Delete Button - Only for Staff on Pending, or Manager */}
                  {((hasRole('DealerStaff') && testDrive.status === TestDriveStatus.PENDING) ||
                   hasRole('DealerAdmin')) && (
                    <button
                      onClick={() => handleDelete(testDrive.id, testDrive.customerName)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Xóa"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

