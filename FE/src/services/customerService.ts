import { api } from "../config/api";

export type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  dob?: string | null;
  createdAt?: string | null;
  isActive?: boolean | null;
};

const BASE = "/Customer";

export const customerService = {
  list: () => api.get<Customer[]>(BASE),
  getById: (id: string) => api.get<Customer>(`${BASE}/${id}`),
  create: (payload: Partial<Customer>) => api.post<Customer>(BASE, payload),
  update: (id: string, payload: Partial<Customer>) => api.put<Customer>(`${BASE}/${id}`, payload),
  remove: (id: string) => api.delete<void>(`${BASE}/${id}`),
};

export default customerService;
