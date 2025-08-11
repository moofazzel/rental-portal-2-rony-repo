// service-request.ts
export type ServiceRequestType =
  | "MAINTENANCE"
  | "UTILITY"
  | "SECURITY"
  | "CLEANING"
  | "OTHER";
export type ServiceRequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type ServiceRequestStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface IServiceRequest {
  _id: string;
  tenantId?: {
    _id: string;
    name: string;
    email: string;
  };
  propertyId?: {
    _id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  spotId?: {
    _id: string;
    spotNumber: string;
  };
  title: string;
  description: string;
  type: ServiceRequestType;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  requestedDate: string;
  completedDate?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  images?: string[];
  adminNotes?: string;
  tenantNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Legacy type for backward compatibility
export type ServiceRequest = {
  id: string;
  tenantName: string;
  category: string;
  description: string;
  photoUrl?: string;
  createdAt: string;
  status: ServiceStatus;
  comment?: string;
  assignedTo?: string;
};

export type ServiceStatus = "Submitted" | "In Progress" | "Resolved";
