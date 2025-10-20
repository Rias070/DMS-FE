export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/Auth/login`,
    REGISTER: `${API_BASE_URL}/Auth/register`,
    REFRESH: `${API_BASE_URL}/Auth/refresh`,
    LOGOUT: `${API_BASE_URL}/Auth/logout`,
  },
  TEST_DRIVE: {
    BASE: `${API_BASE_URL}/TestDrive`,
    GET_ALL: `${API_BASE_URL}/TestDrive`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/TestDrive/${id}`,
    CREATE: `${API_BASE_URL}/TestDrive`,
    UPDATE: (id: string) => `${API_BASE_URL}/TestDrive/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/TestDrive/${id}`,
    BY_DEALER: (dealerId: string) => `${API_BASE_URL}/TestDrive/dealer/${dealerId}`,
    BY_VEHICLE: (vehicleId: string) => `${API_BASE_URL}/TestDrive/vehicle/${vehicleId}`,
    // Approval workflow
    APPROVE: (id: string) => `${API_BASE_URL}/TestDrive/${id}/approve`,
    REJECT: (id: string) => `${API_BASE_URL}/TestDrive/${id}/reject`,
    REQUEST_CHANGE: (id: string) => `${API_BASE_URL}/TestDrive/${id}/request-change`,
  },
  VEHICLES: {
    BASE: `${API_BASE_URL}/Vehicles`,
    GET_ALL: `${API_BASE_URL}/Vehicles`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/Vehicles/${id}`,
  },
  DEALERS: {
    BASE: `${API_BASE_URL}/Dealers`,
    GET_ALL: `${API_BASE_URL}/Dealers`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/Dealers/${id}`,
  },
};