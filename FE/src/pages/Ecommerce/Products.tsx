import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { vehicleService } from "../../services/vehicleService";
import { Vehicle, VehicleCreateUpdate } from "../../types/vehicle";
import { VehicleFormModal } from "../../components/ecommerce/VehicleFormModal";
import { ConfirmDeleteModal } from "../../components/ecommerce/ConfirmDeleteModal";
import { categoryService } from "../../services/categoryService";
import { Category } from "../../types/category";

interface FilterState {
  searchText: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  year: string;
  color: string;
  status: string;
}

export default function Products() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    searchText: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    year: "",
    color: "",
    status: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Toast notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadVehicles();
    loadCategories();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Apply filters whenever vehicles or filters change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, filters]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      setError("Không thể tải danh sách xe. Vui lòng thử lại sau.");
      console.error("Error loading vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Search text (tìm theo hãng, mẫu, VIN)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.make.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower) ||
          v.vin.toLowerCase().includes(searchLower)
      );
    }

    // Category
    if (filters.categoryId) {
      filtered = filtered.filter((v) => v.categoryId === filters.categoryId);
    }

    // Price range
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      filtered = filtered.filter((v) => v.price >= min);
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      filtered = filtered.filter((v) => v.price <= max);
    }

    // Year
    if (filters.year) {
      filtered = filtered.filter((v) => v.year === parseInt(filters.year));
    }

    // Color
    if (filters.color) {
      filtered = filtered.filter((v) =>
        v.color.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    // Status
    if (filters.status) {
      const isAvailable = filters.status === "available";
      filtered = filtered.filter((v) => v.isAvailable === isAvailable);
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchText: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      year: "",
      color: "",
      status: "",
    });
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: VehicleCreateUpdate) => {
    try {
      if (selectedVehicle) {
        // Update existing vehicle
        await vehicleService.update(selectedVehicle.id, data);
        setNotification({
          type: "success",
          message: "Cập nhật xe thành công!",
        });
      } else {
        // Create new vehicle
        await vehicleService.create(data);
        setNotification({
          type: "success",
          message: "Thêm xe mới thành công!",
        });
      }
      await loadVehicles();
      setIsFormModalOpen(false);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra. Vui lòng thử lại.",
      });
      console.error("Error submitting form:", err);
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return;

    try {
      setDeleteLoading(true);
      await vehicleService.delete(selectedVehicle.id);
      setNotification({
        type: "success",
        message: "Xóa xe thành công!",
      });
      await loadVehicles();
      setIsDeleteModalOpen(false);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Không thể xóa xe. Vui lòng thử lại.",
      });
      console.error("Error deleting vehicle:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (isAvailable: boolean) => {
    if (isAvailable) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Còn hàng
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
        Hết hàng
      </span>
    );
  };

  return (
    <>
      <PageMeta title="Sản phẩm - Products" description="Danh sách xe điện" />
      <PageBreadcrumb pageTitle="Sản phẩm" />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed right-4 top-4 z-[99999] animate-slide-in-right">
          <div
            className={`rounded-lg px-4 py-3 shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        vehicle={selectedVehicle}
        title={selectedVehicle ? "Cập nhật thông tin xe" : "Thêm xe mới"}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa xe"
        message={`Bạn có chắc chắn muốn xóa xe ${selectedVehicle?.make} ${selectedVehicle?.model} không? Hành động này không thể hoàn tác.`}
        loading={deleteLoading}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách xe điện
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {showFilters ? "Ẩn lọc" : "Lọc"}
              </span>
            </button>
            <button
              onClick={loadVehicles}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Làm mới
              </span>
            </button>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm xe mới
              </span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bộ lọc tìm kiếm
              </h4>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Xóa bộ lọc
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search Text */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  placeholder="Hãng, mẫu xe, VIN..."
                  value={filters.searchText}
                  onChange={(e) => handleFilterChange("searchText", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Loại xe
                </label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Tất cả loại</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Năm sản xuất
                </label>
                <input
                  type="number"
                  placeholder="VD: 2024"
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Color */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Màu sắc
                </label>
                <input
                  type="text"
                  placeholder="VD: Đỏ, Trắng..."
                  value={filters.color}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Min Price */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Giá từ (VND)
                </label>
                <input
                  type="number"
                  placeholder="500000000"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Giá đến (VND)
                </label>
                <input
                  type="number"
                  placeholder="2000000000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Trạng thái
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Tất cả</option>
                  <option value="available">Còn hàng</option>
                  <option value="unavailable">Hết hàng</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy <span className="font-semibold">{filteredVehicles.length}</span> xe
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-white/[0.02]">
            <p className="text-gray-600 dark:text-gray-400">
              Chưa có xe nào trong hệ thống.
            </p>
          </div>
        )}

        {!loading && !error && filteredVehicles.length === 0 && vehicles.length > 0 && (
          <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-white/[0.02]">
            <p className="text-gray-600 dark:text-gray-400">
              Không tìm thấy xe nào phù hợp với bộ lọc.
            </p>
          </div>
        )}

        {!loading && !error && filteredVehicles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500 dark:border-gray-800">
                  <th className="py-3 font-medium">Hãng xe</th>
                  <th className="py-3 font-medium">Mẫu xe</th>
                  <th className="py-3 font-medium">Loại xe</th>
                  <th className="py-3 font-medium">Năm SX</th>
                  <th className="py-3 font-medium">VIN</th>
                  <th className="py-3 font-medium">Màu sắc</th>
                  <th className="py-3 font-medium">Giá bán</th>
                  <th className="py-3 font-medium">Trạng thái</th>
                  <th className="py-3 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-gray-100 text-sm last:border-0 dark:border-gray-800/50"
                  >
                    <td className="py-4 font-medium text-gray-800 dark:text-white/90">
                      {vehicle.make}
                    </td>
                    <td className="py-4 text-gray-700 dark:text-gray-300">
                      {vehicle.model}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                        {vehicle.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600 dark:text-gray-400">
                      {vehicle.year}
                    </td>
                    <td className="py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {vehicle.vin}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: vehicle.color.toLowerCase() }}
                          title={vehicle.color}
                        ></span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {vehicle.color}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-gray-800 dark:text-white/90">
                      {formatPrice(vehicle.price)}
                    </td>
                    <td className="py-4">{getStatusBadge(vehicle.isAvailable)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="text-sm font-medium text-blue-500 hover:text-blue-600"
                        >
                          Sửa
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <button
                          onClick={() => handleDeleteClick(vehicle)}
                          className="text-sm font-medium text-red-500 hover:text-red-600"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredVehicles.length > 0 && (
          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hiển thị <span className="font-semibold">{filteredVehicles.length}</span> / {vehicles.length} xe
            </p>
          </div>
        )}
      </div>
    </>
  );
}
