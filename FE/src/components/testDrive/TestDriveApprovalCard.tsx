import React, { useState } from 'react';
import { TestDriveRecord } from '../../types/testDrive';

interface TestDriveApprovalCardProps {
  testDrive: TestDriveRecord;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

const TestDriveApprovalCard: React.FC<TestDriveApprovalCardProps> = ({
  testDrive,
  onApprove,
  onReject
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason);
      setRejectionReason('');
      setShowRejectForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{testDrive.customerName}</h4>
          <p className="text-sm text-gray-600">{testDrive.customerContact}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Chờ duyệt
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
            <p className="mt-1 p-2 bg-gray-50 rounded">{testDrive.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <span>Tạo bởi: {testDrive.createdByName}</span>
        <span>{new Date(testDrive.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>

      <div className="flex space-x-3">
        <button 
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={onApprove}
        >
          Duyệt
        </button>
        
        <button 
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setShowRejectForm(true)}
        >
          Từ chối
        </button>
      </div>

      {showRejectForm && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <label className="block text-sm font-medium text-red-700 mb-2">
            Lý do từ chối *
          </label>
          <textarea
            placeholder="Nhập lý do từ chối..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button 
              onClick={() => setShowRejectForm(false)}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              onClick={handleReject} 
              disabled={!rejectionReason.trim()}
              className="px-3 py-1 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDriveApprovalCard;
