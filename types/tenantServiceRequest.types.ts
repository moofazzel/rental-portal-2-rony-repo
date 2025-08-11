// src/types/service-request.ts

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
  status: string;
}

export interface IServiceRequest {
  _id: string;
  tenantId:
    | string
    | { _id: string; name: string; email: string; phoneNumber: string };
  propertyId: PropertyInfo;
  spotId: string | SpotInfo;
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
  images: string[];
  adminNotes?: string;
  tenantNotes?: string;
  createdAt: string;
  updatedAt: string;
  pets: boolean;
  permission: boolean;
  serviceRequests: [];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** What your POST /service-requests endpoint expects */
export interface CreateServiceRequestDto {
  title: string;
  description: string;
  type: ServiceRequestType;
  priority?: ServiceRequestPriority;
  images?: string[];
  tenantNotes?: string;
}

/** Wrapper for the list response */
// export interface ListRes {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: {
//     pagination: Pagination;
//     serviceRequests: IServiceRequest[];
//   };
// }

/** Wrapper for the create response */
export interface CreateRes {
  success: boolean;
  statusCode: number;
  message: string;
  data: IServiceRequest;
}
