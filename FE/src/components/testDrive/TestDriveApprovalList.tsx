import React, { useState, useEffect } from 'react';
import { TestDriveRecord } from '../../types/testDrive';
import testDriveService from '../../services/testDriveService';
import TestDriveApprovalCard from './TestDriveApprovalCard';

const TestDriveApprovalList: React.FC = () => {
  const [pendingTestDrives, setPendingTestDrives] = useState<TestDriveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingTestDrives();
  }, []);

  const loadPendingTestDrives = async () => {
    try {
      setLoading(true);
      const data = await testDriveService.getAll({ status: 'pending' });
      setPendingTestDrives(data);
    } catch (error) {
      console.error('Error loading pending test drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await testDriveService.approve({ testDriveId: id });
      loadPendingTestDrives(); // Reload list
      alert('Đã duyệt lịch lái thử');
    } catch (error) {
      console.error('Error approving test drive:', error);
      alert('Có lỗi xảy ra khi duyệt lịch');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await testDriveService.reject({ testDriveId: id, rejectionReason: reason });
      loadPendingTestDrives(); // Reload list
      alert('Đã từ chối lịch lái thử');
    } catch (error) {
      console.error('Error rejecting test drive:', error);
      alert('Có lỗi xảy ra khi từ chối lịch');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch lái thử chờ duyệt</h2>
        
        <div className="text-sm text-gray-600 mb-4">
          Có {pendingTestDrives.length} lịch lái thử đang chờ duyệt
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải...</span>
        </div>
      ) : pendingTestDrives.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch chờ duyệt</h3>
            <p className="mt-1 text-sm text-gray-500">Tất cả lịch lái thử đã được xử lý.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingTestDrives.map((testDrive) => (
            <TestDriveApprovalCard
              key={testDrive.id}
              testDrive={testDrive}
              onApprove={() => handleApprove(testDrive.id)}
              onReject={(reason) => handleReject(testDrive.id, reason)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestDriveApprovalList;
