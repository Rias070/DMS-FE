import React from 'react';
import { RestockRequest, RestockRequestStatus } from '../../types/restockRequest';

interface RestockApprovalActionsProps {
  request: RestockRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  isLoading?: boolean;
  isCompanyLevel?: boolean; // If true, this is for company approval (Escalated status)
}

const RestockApprovalActions: React.FC<RestockApprovalActionsProps> = ({
  request,
  onApprove,
  onReject,
  isLoading = false,
  isCompanyLevel = false,
}) => {
  const [showRejectModal, setShowRejectModal] = React.useState(false);

  // Normalize status to handle both enum and string values from backend
  const normalizeStatus = (status: RestockRequestStatus | string): string => {
    if (typeof status === 'string') {
      return status;
    }
    return status as string;
  };

  const currentStatus = normalizeStatus(request.status);

  // Check if request has been escalated to company level
  // If acceptenceLevel is "Company", it means dealer already approved and sent to company
  const isEscalatedToCompany = request.acceptenceLevel === 'Company' || request.acceptenceLevel === 'company';
  
  // For company level: can approve/reject when status is Escalated OR acceptenceLevel is Company
  // For dealer level: can approve/reject when status is Pending and not escalated
  let canApprove = false;
  let canReject = false;
  
  if (isCompanyLevel) {
    // Company can approve/reject when:
    // 1. Status is Escalated, OR
    // 2. acceptenceLevel is Company (meaning dealer already approved and sent to company)
    const isWaitingForCompany = 
      (currentStatus === RestockRequestStatus.Escalated || currentStatus === 'Escalated') ||
      isEscalatedToCompany;
    
    canApprove = isWaitingForCompany && !!onApprove;
    canReject = isWaitingForCompany && !!onReject;
  } else {
    // Dealer can approve/reject when status is Pending and not yet escalated
    const isPending = (currentStatus === RestockRequestStatus.Pending || currentStatus === 'Pending') && !isEscalatedToCompany;
    canApprove = isPending && !!onApprove;
    canReject = isPending && !!onReject;
  }

  const handleApproveClick = () => {
    if (!onApprove) return;
    
    const confirmMessage = isCompanyLevel
      ? `Bạn có chắc chắn muốn phê duyệt yêu cầu nhập hàng "${request.vehicleName}" (${request.quantity} chiếc) từ đại lý không?`
      : `Bạn có chắc chắn muốn phê duyệt và gửi yêu cầu nhập hàng "${request.vehicleName}" (${request.quantity} chiếc) lên công ty không?`;
    
    if (window.confirm(confirmMessage)) {
      onApprove(request.id);
    }
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectConfirm = (reason: string) => {
    onReject(request.id, reason);
    setShowRejectModal(false);
  };

  if (!canApprove && !canReject) {
    // Request already processed - show status message instead of buttons
    return (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {isEscalatedToCompany && 'Đã gửi lên công ty'}
        {(currentStatus === RestockRequestStatus.Escalated || currentStatus === 'Escalated') && !isEscalatedToCompany && 'Đã gửi lên công ty'}
        {(currentStatus === RestockRequestStatus.Rejected || currentStatus === 'Rejected') && 'Đã từ chối'}
        {(currentStatus === RestockRequestStatus.Approved || currentStatus === 'Approved') && 'Đã được công ty phê duyệt'}
        {(currentStatus === RestockRequestStatus.CompanyRejected || currentStatus === 'CompanyRejected') && 'Công ty đã từ chối'}
      </span>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleApproveClick}
          disabled={isLoading || !canApprove}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50"
        >
          Phê duyệt
        </button>
        <button
          onClick={handleRejectClick}
          disabled={isLoading || !canReject}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none disabled:opacity-50"
        >
          Từ chối
        </button>
      </div>
      
      {showRejectModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Từ chối yêu cầu nhập hàng
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Xe: <span className="font-medium">{request.vehicleName}</span>
            </p>
            <textarea
              id="rejectReason"
              placeholder="Nhập lý do từ chối..."
              className="mb-4 min-h-[100px] w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const reason = (document.getElementById('rejectReason') as HTMLTextAreaElement)?.value;
                  if (reason?.trim()) {
                    handleRejectConfirm(reason.trim());
                  }
                }}
                disabled={isLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestockApprovalActions;
