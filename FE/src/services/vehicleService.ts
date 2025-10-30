import { API_BASE_URL } from '../config/api';
import { Vehicle, VehicleCreateUpdate } from '../types/vehicle';

class VehicleService {
  private baseUrl = `${API_BASE_URL}/Vehicles`;

  async getAll(): Promise<Vehicle[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Vehicle> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicle');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  async create(vehicle: VehicleCreateUpdate): Promise<Vehicle> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      });

      if (!response.ok) {
        throw new Error('Failed to create vehicle');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  async update(id: string, vehicle: VehicleCreateUpdate): Promise<Vehicle> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      });

      if (!response.ok) {
        throw new Error('Failed to update vehicle');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }
}

export const vehicleService = new VehicleService();
export default vehicleService;
