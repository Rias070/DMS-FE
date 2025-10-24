import React, { useState, useEffect } from 'react';
import { CreateTestDriveRequest, Vehicle, Dealer } from '../../types/testDrive';
import testDriveService from '../../services/testDriveService';

interface CreateTestDriveFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateTestDriveForm: React.FC<CreateTestDriveFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateTestDriveRequest>({
    testDate: '',
    customerName: '',
    customerContact: '',
    notes: '',
    dealerId: '',
    vehicleId: ''
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [vehiclesData, dealersData] = await Promise.all([
        testDriveService.getVehicles(),
        testDriveService.getDealers()
      ]);
      setVehicles(vehiclesData);
      setDealers(dealersData);
      
      // Set default dealer if only one available
      if (dealersData.length === 1) {
        setFormData(prev => ({ ...prev, dealerId: dealersData[0].id }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert datetime to UTC before sending
      const requestData = {
        ...formData,
        testDate: formData.testDate ? new Date(formData.testDate).toISOString() : formData.testDate
      };
      
      console.log('Creating test drive with data:', requestData);
      const result = await testDriveService.create(requestData);
      console.log('Test drive created successfully:', result);
      onSuccess();
    } catch (error) {
      console.error('Error creating test drive:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      alert(`Có lỗi xảy ra khi tạo lịch lái thử: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateTestDriveRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Tạo lịch lái thử mới</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên khách hàng *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên khách hàng"
              required
            />
          </div>

          {/* Customer Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={formData.customerContact}
              onChange={(e) => handleInputChange('customerContact', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          {/* Test Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày lái thử *
            </label>
            <input
              type="datetime-local"
              value={formData.testDate}
              onChange={(e) => handleInputChange('testDate', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Dealer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đại lý *
            </label>
            <select
              value={formData.dealerId}
              onChange={(e) => handleInputChange('dealerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn đại lý</option>
              {dealers.map(dealer => (
                <option key={dealer.id} value={dealer.id}>
                  {dealer.name} - {dealer.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xe lái thử *
          </label>
          <select
            value={formData.vehicleId}
            onChange={(e) => handleInputChange('vehicleId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Chọn xe</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.color} - {vehicle.vin}
              </option>
            ))}
          </select>
          {formData.vehicleId && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              {(() => {
                const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
                return selectedVehicle ? (
                  <div className="text-sm text-blue-700">
                    <p><strong>Mô tả:</strong> {selectedVehicle.description}</p>
                    <p><strong>Giá:</strong> {selectedVehicle.price?.toLocaleString('vi-VN')} VNĐ</p>
                    <p><strong>Trạng thái:</strong> {selectedVehicle.isAvailable ? 'Có sẵn' : 'Không có sẵn'}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập ghi chú (tùy chọn)"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tạo...' : 'Tạo lịch'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTestDriveForm;
