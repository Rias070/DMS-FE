import { API_ENDPOINTS } from '../config/api';
import {
  TestDriveRecord,
  CreateTestDriveRequest,
  UpdateTestDriveRequest,
  TestDriveFilters,
  TestDriveStatus,
  Vehicle,
  Dealer,
  ApproveTestDriveRequest,
  RejectTestDriveRequest,
} from '../types/testDrive';
import authService from './authService';

class TestDriveService {
  // Mock data for development (khi backend chưa sẵn sàng)
  private mockTestDrives: TestDriveRecord[] = [
    {
      id: '1',
      testDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      customerName: 'Nguyễn Văn A',
      customerContact: '0912345678',
      notes: 'Khách hàng muốn thử xe vào buổi sáng',
      dealerId: 'dealer-1',
      vehicleId: 'vehicle-1',
      status: TestDriveStatus.PENDING,
      createdBy: 'staff-001',
      createdByName: 'Nhân viên Nguyễn Thị C',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      dealer: {
        id: 'dealer-1',
        name: 'Đại lý Hà Nội',
        location: 'Hà Nội',
      },
      vehicle: {
        id: 'vehicle-1',
        make: 'VinFast',
        model: 'VF e34',
        year: 2024,
        color: 'Đỏ',
        vin: 'VIN001',
      },
    },
    {
      id: '2',
      testDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      customerName: 'Trần Thị B',
      customerContact: '0987654321',
      notes: 'Khách hàng quan tâm đến tính năng tự lái',
      dealerId: 'dealer-2',
      vehicleId: 'vehicle-2',
      status: TestDriveStatus.APPROVED,
      createdBy: 'staff-002',
      createdByName: 'Nhân viên Trần Văn D',
      approvedBy: 'manager-001',
      approvedByName: 'Quản lý Lê Thị E',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      approvedAt: new Date(Date.now() - 86400000).toISOString(),
      dealer: {
        id: 'dealer-2',
        name: 'Đại lý TP.HCM',
        location: 'TP. Hồ Chí Minh',
      },
      vehicle: {
        id: 'vehicle-2',
        make: 'VinFast',
        model: 'VF 8',
        year: 2024,
        color: 'Xanh',
        vin: 'VIN002',
      },
    },
    {
      id: '3',
      testDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      customerName: 'Lê Văn C',
      customerContact: '0901234567',
      notes: 'Đã hoàn thành lái thử',
      dealerId: 'dealer-1',
      vehicleId: 'vehicle-3',
      status: TestDriveStatus.COMPLETED,
      createdBy: 'staff-001',
      createdByName: 'Nhân viên Nguyễn Thị C',
      approvedBy: 'manager-001',
      approvedByName: 'Quản lý Lê Thị E',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      approvedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      dealer: {
        id: 'dealer-1',
        name: 'Đại lý Hà Nội',
        location: 'Hà Nội',
      },
      vehicle: {
        id: 'vehicle-3',
        make: 'VinFast',
        model: 'VF 9',
        year: 2024,
        color: 'Trắng',
        vin: 'VIN003',
      },
    },
    {
      id: '4',
      testDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      customerName: 'Phạm Văn D',
      customerContact: '0923456789',
      notes: 'Cần thay đổi thời gian',
      dealerId: 'dealer-1',
      vehicleId: 'vehicle-1',
      status: TestDriveStatus.REJECTED,
      createdBy: 'staff-001',
      createdByName: 'Nhân viên Nguyễn Thị C',
      approvedBy: 'manager-001',
      approvedByName: 'Quản lý Lê Thị E',
      rejectionReason: 'Xe không có sẵn vào thời gian này. Vui lòng chọn thời gian khác.',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      rejectedAt: new Date(Date.now() - 3600000).toISOString(),
      dealer: {
        id: 'dealer-1',
        name: 'Đại lý Hà Nội',
        location: 'Hà Nội',
      },
      vehicle: {
        id: 'vehicle-1',
        make: 'VinFast',
        model: 'VF e34',
        year: 2024,
        color: 'Đỏ',
        vin: 'VIN001',
      },
    },
  ];

  private mockVehicles: Vehicle[] = [
    {
      id: 'vehicle-1',
      make: 'VinFast',
      model: 'VF e34',
      year: 2024,
      color: 'Đỏ',
      vin: 'VIN001',
      price: 690000000,
      description: 'SUV điện cỡ B',
      isAvailable: true,
    },
    {
      id: 'vehicle-2',
      make: 'VinFast',
      model: 'VF 8',
      year: 2024,
      color: 'Xanh',
      vin: 'VIN002',
      price: 1200000000,
      description: 'SUV điện cỡ D',
      isAvailable: true,
    },
    {
      id: 'vehicle-3',
      make: 'VinFast',
      model: 'VF 9',
      year: 2024,
      color: 'Trắng',
      vin: 'VIN003',
      price: 1500000000,
      description: 'SUV điện cỡ E',
      isAvailable: true,
    },
  ];

  private mockDealers: Dealer[] = [
    {
      id: 'dealer-1',
      name: 'Đại lý Hà Nội',
      location: 'Hà Nội',
      contactInfo: 'hanoi@dealer.vn',
      registrationDate: new Date().toISOString(),
      isActive: true,
    },
    {
      id: 'dealer-2',
      name: 'Đại lý TP.HCM',
      location: 'TP. Hồ Chí Minh',
      contactInfo: 'hcm@dealer.vn',
      registrationDate: new Date().toISOString(),
      isActive: true,
    },
  ];

  private useMockData = true; // Toggle this for development

  // Helper: Get auth headers
  private getAuthHeaders(): HeadersInit {
    const user = authService.getCurrentUser();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    };
  }

  // Get all test drives with optional filters
  async getAll(filters?: TestDriveFilters): Promise<TestDriveRecord[]> {
    if (this.useMockData) {
      let results = [...this.mockTestDrives];

      // Apply filters
      if (filters) {
        if (filters.dealerId) {
          results = results.filter((td) => td.dealerId === filters.dealerId);
        }
        if (filters.vehicleId) {
          results = results.filter((td) => td.vehicleId === filters.vehicleId);
        }
        if (filters.customerName) {
          results = results.filter((td) =>
            td.customerName.toLowerCase().includes(filters.customerName!.toLowerCase())
          );
        }
        if (filters.fromDate) {
          results = results.filter((td) => new Date(td.testDate) >= new Date(filters.fromDate!));
        }
        if (filters.toDate) {
          results = results.filter((td) => new Date(td.testDate) <= new Date(filters.toDate!));
        }
        if (filters.status && filters.status !== 'all') {
          results = results.filter((td) => td.status === filters.status);
        }
      }

      // Sort by date (newest first)
      results.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());

      return Promise.resolve(results);
    }

    try {
      const queryParams = new URLSearchParams();
      if (filters?.dealerId) queryParams.append('dealerId', filters.dealerId);
      if (filters?.vehicleId) queryParams.append('vehicleId', filters.vehicleId);
      if (filters?.customerName) queryParams.append('customerName', filters.customerName);
      if (filters?.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters?.toDate) queryParams.append('toDate', filters.toDate);

      const url = `${API_ENDPOINTS.TEST_DRIVE.GET_ALL}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test drives: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching test drives:', error);
      throw error;
    }
  }

  // Get single test drive by ID
  async getById(id: string): Promise<TestDriveRecord> {
    if (this.useMockData) {
      const testDrive = this.mockTestDrives.find((td) => td.id === id);
      if (!testDrive) {
        throw new Error('Test drive not found');
      }
      return Promise.resolve(testDrive);
    }

    try {
      const response = await fetch(API_ENDPOINTS.TEST_DRIVE.GET_BY_ID(id), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test drive: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching test drive:', error);
      throw error;
    }
  }

  // Create new test drive
  async create(request: CreateTestDriveRequest): Promise<TestDriveRecord> {
    if (this.useMockData) {
      const user = authService.getCurrentUser();
      const newTestDrive: TestDriveRecord = {
        id: `td-${Date.now()}`,
        testDate: request.testDate,
        customerName: request.customerName,
        customerContact: request.customerContact,
        notes: request.notes || '',
        dealerId: request.dealerId,
        vehicleId: request.vehicleId,
        status: TestDriveStatus.PENDING, // Always start as pending
        createdBy: user?.id || 'staff-001',
        createdByName: user?.name || 'Staff',
        createdAt: new Date().toISOString(),
        dealer: this.mockDealers.find((d) => d.id === request.dealerId),
        vehicle: this.mockVehicles.find((v) => v.id === request.vehicleId),
      };

      this.mockTestDrives.push(newTestDrive);
      return Promise.resolve(newTestDrive);
    }

    try {
      const response = await fetch(API_ENDPOINTS.TEST_DRIVE.CREATE, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to create test drive: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error creating test drive:', error);
      throw error;
    }
  }

  // Update existing test drive
  async update(id: string, request: UpdateTestDriveRequest): Promise<TestDriveRecord> {
    if (this.useMockData) {
      const index = this.mockTestDrives.findIndex((td) => td.id === id);
      if (index === -1) {
        throw new Error('Test drive not found');
      }

      this.mockTestDrives[index] = {
        ...this.mockTestDrives[index],
        ...request,
      };

      return Promise.resolve(this.mockTestDrives[index]);
    }

    try {
      const response = await fetch(API_ENDPOINTS.TEST_DRIVE.UPDATE(id), {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to update test drive: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error updating test drive:', error);
      throw error;
    }
  }

  // Delete test drive
  async delete(id: string): Promise<void> {
    if (this.useMockData) {
      const index = this.mockTestDrives.findIndex((td) => td.id === id);
      if (index === -1) {
        throw new Error('Test drive not found');
      }

      this.mockTestDrives.splice(index, 1);
      return Promise.resolve();
    }

    try {
      const response = await fetch(API_ENDPOINTS.TEST_DRIVE.DELETE(id), {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete test drive: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting test drive:', error);
      throw error;
    }
  }

  // Get all available vehicles
  async getVehicles(): Promise<Vehicle[]> {
    if (this.useMockData) {
      return Promise.resolve(this.mockVehicles.filter((v) => v.isAvailable));
    }

    try {
      const response = await fetch(API_ENDPOINTS.VEHICLES.GET_ALL, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.data || data).filter((v: Vehicle) => v.isAvailable);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return this.mockVehicles; // Fallback to mock data
    }
  }

  // Get all dealers
  async getDealers(): Promise<Dealer[]> {
    if (this.useMockData) {
      return Promise.resolve(this.mockDealers.filter((d) => d.isActive));
    }

    try {
      const response = await fetch(API_ENDPOINTS.DEALERS.GET_ALL, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dealers: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.data || data).filter((d: Dealer) => d.isActive);
    } catch (error) {
      console.error('Error fetching dealers:', error);
      return this.mockDealers; // Fallback to mock data
    }
  }

  // Approve test drive (Manager only)
  async approve(request: ApproveTestDriveRequest): Promise<TestDriveRecord> {
    if (this.useMockData) {
      const index = this.mockTestDrives.findIndex((td) => td.id === request.testDriveId);
      if (index === -1) {
        throw new Error('Test drive not found');
      }

      const user = authService.getCurrentUser();
      this.mockTestDrives[index] = {
        ...this.mockTestDrives[index],
        status: TestDriveStatus.APPROVED,
        approvedBy: request.approvedBy || user?.id || 'manager-001',
        approvedByName: user?.name || 'Manager',
        approvedAt: new Date().toISOString(),
      };

      return Promise.resolve(this.mockTestDrives[index]);
    }

    try {
      const response = await fetch(API_ENDPOINTS.TEST_DRIVE.APPROVE(request.testDriveId), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to approve test drive: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error approving test drive:', error);
      throw error;
    }
  }

  // Reject test drive (Manager only)
  async reject(request: RejectTestDriveRequest): Promise<TestDriveRecord> {
    if (this.useMockData) {
      const index = this.mockTestDrives.findIndex((td) => td.id === request.testDriveId);
      if (index === -1) {
        throw new Error('Test drive not found');
      }

      const user = authService.getCurrentUser();
      this.mockTestDrives[index] = {
        ...this.mockTestDrives[index],
        status: TestDriveStatus.REJECTED,
        approvedBy: request.rejectedBy || user?.id || 'manager-001',
        approvedByName: user?.name || 'Manager',
        rejectionReason: request.rejectionReason,
        rejectedAt: new Date().toISOString(),
      };

      return Promise.resolve(this.mockTestDrives[index]);
    }

    try {
      const response = await fetch(API_ENDPOINTS.TEST_DRIVE.REJECT(request.testDriveId), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to reject test drive: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error rejecting test drive:', error);
      throw error;
    }
  }

  // Toggle between mock and real API
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }
}

// Export singleton instance
const testDriveService = new TestDriveService();
export default testDriveService;

