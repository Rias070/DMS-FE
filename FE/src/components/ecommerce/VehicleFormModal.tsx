import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Checkbox from "../form/input/Checkbox";
import { Vehicle, VehicleCreateUpdate } from "../../types/vehicle";
import { Category } from "../../types/category";
import { categoryService } from "../../services/categoryService";

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleCreateUpdate) => Promise<void>;
  vehicle?: Vehicle | null;
  title: string;
}

const currentYear = new Date().getFullYear();

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
  title,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState<VehicleCreateUpdate>({
    make: "",
    model: "",
    year: currentYear,
    vin: "",
    color: "",
    price: 0,
    description: "",
    isAvailable: true,
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoryService.getAll();
        setCategories(data);
        
        // Set default category if available and form is new
        if (data.length > 0 && !vehicle) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, vehicle]);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        color: vehicle.color,
        price: vehicle.price,
        description: vehicle.description || "",
        isAvailable: vehicle.isAvailable,
        categoryId: vehicle.categoryId,
      });
    } else {
      // Reset form when adding new vehicle
      const defaultCategoryId = categories.length > 0 ? categories[0].id : "";
      setFormData({
        make: "",
        model: "",
        year: currentYear,
        vin: "",
        color: "",
        price: 0,
        description: "",
        isAvailable: true,
        categoryId: defaultCategoryId,
      });
    }
    setErrors({});
  }, [vehicle, isOpen, categories]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.make.trim()) {
      newErrors.make = "Vui lòng nhập hãng xe";
    }
    if (!formData.model.trim()) {
      newErrors.model = "Vui lòng nhập mẫu xe";
    }
    if (!formData.year || formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors.year = `Năm sản xuất phải từ 1900 đến ${currentYear + 1}`;
    }
    if (!formData.vin.trim()) {
      newErrors.vin = "Vui lòng nhập số VIN";
    } else if (formData.vin.length < 17) {
      newErrors.vin = "Số VIN phải có ít nhất 17 ký tự";
    }
    if (!formData.color.trim()) {
      newErrors.color = "Vui lòng nhập màu sắc";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá bán phải lớn hơn 0";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn loại xe";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof VehicleCreateUpdate, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hãng xe */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hãng xe <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: VinFast, Tesla, BYD..."
              value={formData.make}
              onChange={(e) => handleChange("make", e.target.value)}
              error={!!errors.make}
              hint={errors.make}
            />
          </div>

          {/* Mẫu xe */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mẫu xe <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: VF8, Model 3, Dolphin..."
              value={formData.model}
              onChange={(e) => handleChange("model", e.target.value)}
              error={!!errors.model}
              hint={errors.model}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Năm sản xuất */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Năm sản xuất <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="2024"
                value={formData.year}
                onChange={(e) => handleChange("year", parseInt(e.target.value) || 0)}
                min="1900"
                max={(currentYear + 1).toString()}
                error={!!errors.year}
                hint={errors.year}
              />
            </div>

            {/* Màu sắc */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Màu sắc <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="VD: Đỏ, Trắng, Đen..."
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                error={!!errors.color}
                hint={errors.color}
              />
            </div>
          </div>

          {/* Số VIN */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Số VIN (Vehicle Identification Number) <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="17 ký tự"
              value={formData.vin}
              onChange={(e) => handleChange("vin", e.target.value.toUpperCase())}
              error={!!errors.vin}
              hint={errors.vin}
              className="font-mono"
            />
          </div>

          {/* Giá bán */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Giá bán (VND) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="1000000000"
              value={formData.price}
              onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
              min="0"
              step={1000000}
              error={!!errors.price}
              hint={errors.price}
            />
          </div>

          {/* Loại xe (Category) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Loại xe <span className="text-red-500">*</span>
            </label>
            {loadingCategories ? (
              <div className="flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <span className="text-sm text-gray-500">Đang tải...</span>
              </div>
            ) : (
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
                  errors.categoryId
                    ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                    : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                }`}
              >
                <option value="">-- Chọn loại xe --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            {errors.categoryId && (
              <p className="mt-1.5 text-xs text-error-500">{errors.categoryId}</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả
            </label>
            <TextArea
              placeholder="Nhập mô tả chi tiết về xe..."
              rows={4}
              value={formData.description}
              onChange={(value) => handleChange("description", value)}
            />
          </div>

          {/* Trạng thái còn hàng */}
          <div>
            <Checkbox
              checked={formData.isAvailable}
              onChange={(checked) => handleChange("isAvailable", checked)}
              label="Xe còn hàng"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : vehicle ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
