import React, { useState, useEffect } from 'react';
import {
  CreateTestDriveRequest,
  TestDriveRecord,
  Vehicle,
  Dealer,
} from '../../types/testDrive';

interface TestDriveFormProps {
  testDrive?: TestDriveRecord; // For editing
  vehicles: Vehicle[];
  dealers: Dealer[];
  onSubmit: (data: CreateTestDriveRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TestDriveForm({
  testDrive,
  vehicles,
  dealers,
  onSubmit,
  onCancel,
  isLoading = false,
}: TestDriveFormProps) {
  const [formData, setFormData] = useState<CreateTestDriveRequest>({
    testDate: testDrive?.testDate ? new Date(testDrive.testDate).toISOString().slice(0, 16) : '',
    customerName: testDrive?.customerName || '',
    customerContact: testDrive?.customerContact || '',
    notes: testDrive?.notes || '',
    dealerId: testDrive?.dealerId || '',
    vehicleId: testDrive?.vehicleId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-select first dealer if only one exists or user's dealer
  useEffect(() => {
    if (!formData.dealerId && dealers.length > 0) {
      setFormData((prev) => ({ ...prev, dealerId: dealers[0].id }));
    }
  }, [dealers, formData.dealerId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Tên khách hàng là bắt buộc';
    }

    if (!formData.customerContact.trim()) {
      newErrors.customerContact = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.customerContact.trim())) {
      newErrors.customerContact = 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }

    if (!formData.testDate) {
      newErrors.testDate = 'Ngày lái thử là bắt buộc';
    } else {
      const selectedDate = new Date(formData.testDate);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.testDate = 'Ngày lái thử phải là ngày trong tương lai';
      }
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vui lòng chọn xe';
    }

    if (!formData.dealerId) {
      newErrors.dealerId = 'Vui lòng chọn đại lý';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Convert datetime-local to ISO string
    const submitData: CreateTestDriveRequest = {
      ...formData,
      testDate: new Date(formData.testDate).toISOString(),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Customer Information */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tên khách hàng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.customerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:text-white`}
            placeholder="Nhập tên khách hàng"
            disabled={isLoading}
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
          )}
        </div>

        {/* Customer Contact */}
        <div>
          <label htmlFor="customerContact" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="customerContact"
            name="customerContact"
            value={formData.customerContact}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.customerContact ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:text-white`}
            placeholder="0912345678"
            disabled={isLoading}
          />
          {errors.customerContact && (
            <p className="mt-1 text-sm text-red-500">{errors.customerContact}</p>
          )}
        </div>
      </div>

      {/* Test Drive Details */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Test Date */}
        <div>
          <label htmlFor="testDate" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ngày & Giờ lái thử <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="testDate"
            name="testDate"
            value={formData.testDate}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.testDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:text-white`}
            disabled={isLoading}
          />
          {errors.testDate && (
            <p className="mt-1 text-sm text-red-500">{errors.testDate}</p>
          )}
        </div>

        {/* Vehicle Selection */}
        <div>
          <label htmlFor="vehicleId" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Chọn xe <span className="text-red-500">*</span>
          </label>
          <select
            id="vehicleId"
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.vehicleId ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:text-white`}
            disabled={isLoading}
          >
            <option value="">-- Chọn xe --</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.color}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="mt-1 text-sm text-red-500">{errors.vehicleId}</p>
          )}
        </div>
      </div>

      {/* Dealer Selection */}
      <div>
        <label htmlFor="dealerId" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Đại lý <span className="text-red-500">*</span>
        </label>
        <select
          id="dealerId"
          name="dealerId"
          value={formData.dealerId}
          onChange={handleChange}
          className={`w-full rounded-lg border ${
            errors.dealerId ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
          } bg-white px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:text-white`}
          disabled={isLoading}
        >
          <option value="">-- Chọn đại lý --</option>
          {dealers.map((dealer) => (
            <option key={dealer.id} value={dealer.id}>
              {dealer.name} - {dealer.location}
            </option>
          ))}
        </select>
        {errors.dealerId && (
          <p className="mt-1 text-sm text-red-500">{errors.dealerId}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ghi chú
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Thêm ghi chú về lịch hẹn..."
          disabled={isLoading}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          disabled={isLoading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
              Đang xử lý...
            </span>
          ) : testDrive ? (
            'Cập nhật'
          ) : (
            'Tạo lịch hẹn'
          )}
        </button>
      </div>
    </form>
  );
}

