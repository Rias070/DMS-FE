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
    BASE: `${API_BASE_URL}/dealer`,
    GET_ALL: `${API_BASE_URL}/dealer`,
    GET_ACTIVE: `${API_BASE_URL}/dealer/active`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/dealer/${id}`,
  },
};

// Lightweight fetch-based API wrapper (axios-like minimal)
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

async function request<T = any>(
  method: HttpMethod,
  url: string,
  body?: any,
  init?: RequestInit
): Promise<{ data: T }>
{
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  const resp = await fetch(fullUrl, {
    method,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
  });

  const contentType = resp.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await resp.json() : await resp.text();

  if (!resp.ok) {
    const message = (payload && (payload.message || payload.error)) || resp.statusText;
    throw new Error(message);
  }

  return { data: payload as T };
}

export const api = {
  get: <T = any>(url: string, init?: RequestInit) => request<T>('GET', url, undefined, init),
  post: <T = any>(url: string, body?: any, init?: RequestInit) => request<T>('POST', url, body, init),
  put: <T = any>(url: string, body?: any, init?: RequestInit) => request<T>('PUT', url, body, init),
  delete: <T = any>(url: string, init?: RequestInit) => request<T>('DELETE', url, undefined, init),
  patch: <T = any>(url: string, body?: any, init?: RequestInit) => request<T>('PATCH', url, body, init),
};
