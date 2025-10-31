// Restock Request types for Dealer Management

export enum RestockRequestStatus {
  Pending = 'Pending',
  Escalated = 'Escalated', // Dealer approved, sent to company
  Rejected = 'Rejected',
  Approved = 'Approved', // Company approved
  CompanyRejected = 'CompanyRejected',
}

export interface RestockRequest {
  id: string;
  vehicleId: string;
  vehicleName: string;
  dealerId: string;
  dealerName?: string;
  accountId: string; // User who created the request
  createdBy?: string; // Creator name
  quantity: number;
  description: string;
  status: RestockRequestStatus;
  acceptenceLevel?: string; // 'Dealer' or 'Company' - indicates which level approved
  acceptedBy?: string; // ID of user who accepted
  reasonRejected?: string;
  rejectReason?: string; // Alias for reasonRejected
  requestDate?: string;
  responseDate?: string;
  createdAt: string;
  updatedAt?: string;
  escalatedAt?: string;
  escalatedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface RestockRequestFilters {
  status?: RestockRequestStatus | 'all';
  vehicleId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ApproveRestockRequest {
  id: string;
}

export interface RejectRestockRequest {
  id: string;
  rejectReason: string;
}
