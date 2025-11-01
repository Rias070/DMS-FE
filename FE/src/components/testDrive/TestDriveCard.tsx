import React from 'react';
import { TestDriveRecord, TestDriveStatus } from '../../types/testDrive';

interface TestDriveCardProps {
  testDrive: TestDriveRecord;
  userRole?: string;
  onStatusChange?: (id: string, newStatus: TestDriveStatus) => void;
}

const TestDriveCard: React.FC<TestDriveCardProps> = ({ 
  testDrive, 
  userRole: _userRole, 
  onStatusChange: _onStatusChange 
}) => {
  const getStatusColor = (status: TestDriveStatus) => {
    switch (status) {
      case TestDriveStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TestDriveStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case TestDriveStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case TestDriveStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TestDriveStatus) => {
    switch (status) {
      case TestDriveStatus.PENDING:
        return 'Chờ duyệt';
      case TestDriveStatus.APPROVED:
        return 'Đã duyệt';
      case TestDriveStatus.REJECTED:
        return 'Từ chối';
      case TestDriveStatus.COMPLETED:
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{testDrive.customerName}</h3>
          <p className="text-sm text-gray-600">{testDrive.customerContact}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(testDrive.status)}`}>
          {getStatusText(testDrive.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Ngày lái thử:</span>
          <span>{new Date(testDrive.testDate).toLocaleString('vi-VN')}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Xe:</span>
          <span>{testDrive.vehicle?.make} {testDrive.vehicle?.model} ({testDrive.vehicle?.year})</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Màu:</span>
          <span>{testDrive.vehicle?.color}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Đại lý:</span>
          <span>{testDrive.dealer?.name}</span>
        </div>
        
        {testDrive.notes && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Ghi chú:</span>
            <p className="mt-1">{testDrive.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Tạo bởi: {testDrive.createdByName || testDrive.createdBy || 'Chưa xác định'}</span>
        <span>{testDrive.createdAt ? new Date(testDrive.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
      </div>

      {testDrive.status === TestDriveStatus.REJECTED && testDrive.rejectionReason && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-700">
            <span className="font-medium">Lý do từ chối:</span> {testDrive.rejectionReason}
          </p>
        </div>
      )}

      {testDrive.status === TestDriveStatus.APPROVED && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">
            <span className="font-medium">Duyệt bởi:</span> {testDrive.approvedByName || testDrive.approvedBy || 'Chưa xác định'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestDriveCard;
