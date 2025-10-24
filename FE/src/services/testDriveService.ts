import { API_ENDPOINTS } from '../config/api';
import {
  TestDriveRecord,
  CreateTestDriveRequest,
  UpdateTestDriveRequest,
  TestDriveFilters,
  Vehicle,
  Dealer,
  ApproveTestDriveRequest,
  RejectTestDriveRequest,
} from '../types/testDrive';
import authService from './authService';

class TestDriveService {

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
    try {
      const queryParams = new URLSearchParams();
      if (filters?.dealerId) queryParams.append('dealerId', filters.dealerId);
      if (filters?.vehicleId) queryParams.append('vehicleId', filters.vehicleId);
      if (filters?.customerName) queryParams.append('customerName', filters.customerName);
      if (filters?.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters?.toDate) queryParams.append('toDate', filters.toDate);
      if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);

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
    try {
      console.log('Creating test drive with request:', request);
      console.log('API endpoint:', API_ENDPOINTS.TEST_DRIVE.CREATE);
      console.log('Auth headers:', this.getAuthHeaders());
      
      const response = await fetch(API_ENDPOINTS.TEST_DRIVE.CREATE, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('Create test drive response status:', response.status);
      console.log('Create test drive response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create test drive error response:', errorText);
        throw new Error(`Failed to create test drive: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Create test drive success response:', data);
      return data.data || data;
    } catch (error) {
      console.error('Error creating test drive:', error);
      throw error;
    }
  }

  // Update existing test drive
  async update(id: string, request: UpdateTestDriveRequest): Promise<TestDriveRecord> {
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
      throw error;
    }
  }

  // Get all dealers
  async getDealers(): Promise<Dealer[]> {
    try {
      console.log('Fetching dealers from:', API_ENDPOINTS.DEALERS.GET_ALL);
      console.log('Auth headers:', this.getAuthHeaders());
      
      const response = await fetch(API_ENDPOINTS.DEALERS.GET_ALL, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('Dealer API response status:', response.status);
      console.log('Dealer API response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dealer API error response:', errorText);
        throw new Error(`Failed to fetch dealers: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Dealer API response data:', data);
      
      const dealers = data.data || data;
      console.log('Raw dealers data:', dealers);
      
      const activeDealers = dealers.filter((d: Dealer) => d.isActive);
      console.log('Active dealers:', activeDealers);
      
      return activeDealers;
    } catch (error) {
      console.error('Error fetching dealers:', error);
      throw error;
    }
  }

  // Approve test drive (Manager only)
  async approve(request: ApproveTestDriveRequest): Promise<TestDriveRecord> {
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
}

// Export singleton instance
const testDriveService = new TestDriveService();
export default testDriveService;

