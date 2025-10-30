export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  color: string;
  price: number;
  description?: string;
  isAvailable: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface VehicleCreateUpdate {
  make: string;
  model: string;
  year: number;
  vin: string;
  color: string;
  price: number;
  description?: string;
  isAvailable: boolean;
  categoryId: string;
}
