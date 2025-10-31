import { API_ENDPOINTS } from '../config/api';
import { RestockRequest, RestockRequestFilters, RejectRestockRequest } from '../types/restockRequest';
import authService from './authService';

class RestockRequestService {
  // Helper: Get auth headers
  private getAuthHeaders(): HeadersInit {
    const user = authService.getCurrentUser();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    };
  }

  // Get all restock requests for current dealer (DealerAdmin/DealerManager)
  async getAllForDealer(filters?: RestockRequestFilters): Promise<RestockRequest[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      if (filters?.vehicleId) {
        queryParams.append('vehicleId', filters.vehicleId);
      }
      if (filters?.dateFrom) {
        queryParams.append('dateFrom', filters.dateFrom);
      }
      if (filters?.dateTo) {
        queryParams.append('dateTo', filters.dateTo);
      }

      const url = `${API_ENDPOINTS.RESTOCK_REQUEST.GET_ALL_FOR_DEALER}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch restock requests: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching restock requests:', error);
      throw error;
    }
  }

  // Get restock request by ID
  async getById(id: string): Promise<RestockRequest> {
    try {
      const response = await fetch(API_ENDPOINTS.RESTOCK_REQUEST.GET_BY_ID(id), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch restock request: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching restock request:', error);
      throw error;
    }
  }

  // Approve and escalate to company (DealerAdmin/DealerManager)
  async approve(id: string): Promise<void> {
    try {
      const response = await fetch(API_ENDPOINTS.RESTOCK_REQUEST.DEALER_ACCEPT(id), {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Failed to approve restock request: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error approving restock request:', error);
      throw error;
    }
  }

  // Reject restock request (DealerAdmin/DealerManager)
  async reject(id: string, rejectReason: string): Promise<void> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('rejectReason', rejectReason);

      const response = await fetch(
        `${API_ENDPOINTS.RESTOCK_REQUEST.DEALER_REJECT(id)}?${queryParams.toString()}`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Failed to reject restock request: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error rejecting restock request:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const restockRequestService = new RestockRequestService();
export default restockRequestService;
