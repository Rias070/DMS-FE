import React from 'react';
import { RestockRequest, RestockRequestStatus } from '../../types/restockRequest';
import RestockApprovalActions from './RestockApprovalActions';

interface RestockRequestListProps {
  requests: RestockRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  isLoading?: boolean;
  actionLoadingId?: string | null;
  showDealerName?: boolean; // Show dealer name column for company view
  isCompanyLevel?: boolean; // If true, this is for company approval
}

const RestockRequestList: React.FC<RestockRequestListProps> = ({
  requests,
  onApprove,
  onReject,
  isLoading = false,
  actionLoadingId,
  showDealerName = false,
  isCompanyLevel = false,
}) => {

  const getStatusText = (request: RestockRequest) => {
    const statusStr = request.status as string;
    
    // Check if escalated to company level (even if status is still "Pending")
    const isEscalatedToCompany = request.acceptenceLevel === 'Company' || request.acceptenceLevel === 'company';
    
    if (isEscalatedToCompany) {
      return 'Chờ công ty phê duyệt';
    }
    
    if (statusStr === RestockRequestStatus.Pending || statusStr === 'Pending') {
      return 'Chờ phê duyệt';
    }
    if (statusStr === RestockRequestStatus.Escalated || statusStr === 'Escalated') {
      return 'Chờ công ty phê duyệt';
    }
    if (statusStr === RestockRequestStatus.Rejected || statusStr === 'Rejected') {
      return 'Đã từ chối';
    }
    if (statusStr === RestockRequestStatus.Approved || statusStr === 'Approved') {
      return 'Đã được phê duyệt';
    }
    if (statusStr === RestockRequestStatus.CompanyRejected || statusStr === 'CompanyRejected') {
      return 'Công ty từ chối';
    }
    return statusStr;
  };

  const getStatusBadgeColor = (request: RestockRequest) => {
    const statusStr = request.status as string;
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    
    // Check if escalated to company level
    const isEscalatedToCompany = request.acceptenceLevel === 'Company' || request.acceptenceLevel === 'company';
    
    if (isEscalatedToCompany) {
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
    }
    
    if (statusStr === RestockRequestStatus.Pending || statusStr === 'Pending') {
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
    }
    if (statusStr === RestockRequestStatus.Escalated || statusStr === 'Escalated') {
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
    }
    if (statusStr === RestockRequestStatus.Rejected || statusStr === 'Rejected') {
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
    }
    if (statusStr === RestockRequestStatus.Approved || statusStr === 'Approved') {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
    }
    if (statusStr === RestockRequestStatus.CompanyRejected || statusStr === 'CompanyRejected') {
      return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
  };

  if (isLoading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải...</span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-white/[0.02]">
        <p className="text-gray-600 dark:text-gray-400">
          Chưa có yêu cầu nhập hàng nào.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b border-gray-200 text-sm text-gray-500 dark:border-gray-800">
            <th className="py-3 font-medium">Xe</th>
            <th className="py-3 font-medium">Số lượng</th>
            <th className="py-3 font-medium">Mô tả</th>
            {showDealerName && <th className="py-3 font-medium">Đại lý</th>}
            <th className="py-3 font-medium">Người tạo</th>
            <th className="py-3 font-medium">Ngày tạo</th>
            <th className="py-3 font-medium">Trạng thái</th>
            {(onApprove || onReject) && <th className="py-3 font-medium">Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className="border-b border-gray-100 text-sm last:border-0 dark:border-gray-800/50"
            >
              <td className="py-4 font-medium text-gray-800 dark:text-white/90">
                {request.vehicleName}
              </td>
              <td className="py-4 text-gray-700 dark:text-gray-300">
                {request.quantity} chiếc
              </td>
              <td className="py-4 text-gray-700 dark:text-gray-300">
                <div className="max-w-xs truncate" title={request.description}>
                  {request.description || '-'}
                </div>
              </td>
              {showDealerName && (
                <td className="py-4 text-gray-600 dark:text-gray-400">
                  {request.dealerName || '-'}
                </td>
              )}
              <td className="py-4 text-gray-600 dark:text-gray-400">
                {request.createdBy || '-'}
              </td>
              <td className="py-4 text-gray-600 dark:text-gray-400">
                {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : '-'}
              </td>
              <td className="py-4">
                <span className={getStatusBadgeColor(request)}>
                  {getStatusText(request)}
                </span>
                {(request.reasonRejected || request.rejectReason) && 
                 ((request.status as string) === RestockRequestStatus.Rejected || (request.status as string) === 'Rejected') && (
                  <div className="mt-1 text-xs text-red-600 dark:text-red-400" title={request.reasonRejected || request.rejectReason}>
                    Lý do: {request.reasonRejected || request.rejectReason}
                  </div>
                )}
              </td>
              {(onApprove || onReject) && (
                <td className="py-4">
                  <RestockApprovalActions
                    request={request}
                    onApprove={onApprove}
                    onReject={onReject}
                    isLoading={actionLoadingId === request.id}
                    isCompanyLevel={isCompanyLevel}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestockRequestList;
