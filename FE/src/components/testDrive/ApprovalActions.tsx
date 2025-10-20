import React, { useState } from 'react';
import { TestDriveRecord, TestDriveStatus } from '../../types/testDrive';

interface ApprovalActionsProps {
  testDrive: TestDriveRecord;
  onApprove: (testDriveId: string) => void;
  onReject: (testDriveId: string, reason: string) => void;
  isLoading?: boolean;
}

export default function ApprovalActions({
  testDrive,
  onApprove,
  onReject,
  isLoading = false,
}: ApprovalActionsProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  const handleApprove = () => {
    if (window.confirm(`Phê duyệt lịch hẹn lái thử cho khách hàng "${testDrive.customerName}"?`)) {
      onApprove(testDrive.id);
    }
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
    setRejectionReason('');
    setError('');
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }

    onReject(testDrive.id, rejectionReason.trim());
    setShowRejectModal(false);
  };

  const handleCancel = () => {
    setShowRejectModal(false);
    setRejectionReason('');
    setError('');
  };

  // Only show for pending status
  if (testDrive.status !== TestDriveStatus.PENDING) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleApprove}
          disabled={isLoading}
          className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          title="Phê duyệt"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Phê duyệt
        </button>

        <button
          onClick={handleRejectClick}
          disabled={isLoading}
          className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          title="Từ chối"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Từ chối
        </button>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Từ chối lịch hẹn
            </h3>

            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Khách hàng: <strong>{testDrive.customerName}</strong>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Số điện thoại: <strong>{testDrive.customerContact}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="rejectionReason"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (error) setError('');
                }}
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Ví dụ: Xe không có sẵn vào thời gian này. Vui lòng chọn thời gian khác."
                disabled={isLoading}
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={isLoading}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

