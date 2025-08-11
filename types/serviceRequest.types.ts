export type ServiceRequestStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type ServiceRequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type ServiceRequestType =
  | "MAINTENANCE"
  | "UTILITY"
  | "SECURITY"
  | "CLEANING"
  | "OTHER";

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface PropertyInfo {
  _id: string;
  name: string;
  address: Address;
}
export interface SpotInfo {
  _id: string;
  spotNumber: string;
  status: string; // e.g., "OCCUPIED", "VACANT", etc.
}
export interface IServiceRequest {
  _id: string;
  tenantId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
      };
  propertyId: PropertyInfo;
  spotId:
    | string
    | {
        _id: string;
        spotNumber: string;
        status: string; // e.g., "OCCUPIED", "VACANT", etc.
      };
  title: string;
  description: string;
  type: ServiceRequestType;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  requestedDate: string; // ISO string
  completedDate?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  images: string[];
  adminNotes?: string;
  tenantNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type UpdateServiceRequestArgs = {
  requestId: string;
  data: Partial<IServiceRequest>;
};

export type NUpdateServiceRequestArgs = {
  requestId: string;
  data: Partial<IServiceRequest>;
};
