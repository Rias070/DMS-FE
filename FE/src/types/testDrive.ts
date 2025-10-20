// Test Drive related types

export interface TestDriveRecord {
  id: string;
  testDate: string; // ISO 8601 date string
  customerName: string;
  customerContact: string;
  notes: string;
  dealerId: string;
  vehicleId: string;
  // Approval workflow fields
  status: TestDriveStatus;
  createdBy?: string; // DealerStaff userId
  createdByName?: string; // DealerStaff name
  approvedBy?: string; // DealerManager userId
  approvedByName?: string; // DealerManager name
  rejectionReason?: string;
  createdAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  // Optional populated data
  dealer?: {
    id: string;
    name: string;
    location: string;
  };
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string;
    vin: string;
  };
}

export interface CreateTestDriveRequest {
  testDate: string;
  customerName: string;
  customerContact: string;
  notes?: string;
  dealerId: string;
  vehicleId: string;
}

export interface UpdateTestDriveRequest {
  testDate?: string;
  customerName?: string;
  customerContact?: string;
  notes?: string;
  dealerId?: string;
  vehicleId?: string;
}

export interface TestDriveListResponse {
  success: boolean;
  message: string;
  data: TestDriveRecord[];
}

export interface TestDriveDetailResponse {
  success: boolean;
  message: string;
  data: TestDriveRecord;
}

export interface TestDriveFilters {
  dealerId?: string;
  vehicleId?: string;
  customerName?: string;
  fromDate?: string;
  toDate?: string;
  status?: TestDriveStatus | 'all';
}

// Approval/Rejection requests
export interface ApproveTestDriveRequest {
  testDriveId: string;
  approvedBy: string;
}

export interface RejectTestDriveRequest {
  testDriveId: string;
  rejectedBy: string;
  rejectionReason: string;
}

// For dropdowns/selects
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  price: number;
  description: string;
  isAvailable: boolean;
}

export interface Dealer {
  id: string;
  name: string;
  location: string;
  contactInfo: string;
  registrationDate: string;
  isActive: boolean;
}

export enum TestDriveStatus {
  PENDING = 'Pending',                    // Chờ phê duyệt (Staff tạo)
  APPROVED = 'Approved',                  // Đã phê duyệt (Manager duyệt)
  REJECTED = 'Rejected',                  // Từ chối (Manager từ chối)
  CHANGE_REQUESTED = 'ChangeRequested',   // Yêu cầu thay đổi
  COMPLETED = 'Completed',                // Đã hoàn thành lái thử
  CANCELLED = 'Cancelled',                // Đã hủy
}

// Helper to get status display name in Vietnamese
export const TestDriveStatusDisplay: Record<TestDriveStatus, string> = {
  [TestDriveStatus.PENDING]: 'Chờ phê duyệt',
  [TestDriveStatus.APPROVED]: 'Đã phê duyệt',
  [TestDriveStatus.REJECTED]: 'Đã từ chối',
  [TestDriveStatus.CHANGE_REQUESTED]: 'Yêu cầu thay đổi',
  [TestDriveStatus.COMPLETED]: 'Đã hoàn thành',
  [TestDriveStatus.CANCELLED]: 'Đã hủy',
};

// Status colors for badges
export const TestDriveStatusColor: Record<TestDriveStatus, string> = {
  [TestDriveStatus.PENDING]: 'yellow',
  [TestDriveStatus.APPROVED]: 'green',
  [TestDriveStatus.REJECTED]: 'red',
  [TestDriveStatus.CHANGE_REQUESTED]: 'orange',
  [TestDriveStatus.COMPLETED]: 'blue',
  [TestDriveStatus.CANCELLED]: 'gray',
};

