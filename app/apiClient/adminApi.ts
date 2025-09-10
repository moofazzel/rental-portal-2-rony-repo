"use server";

import { API_BASE_URL, API_ENDPOINTS } from "@/constants/ApiEndpointsConstants";
import { ICreateDocument, IDocument } from "@/types/document.types";
import {
  ICreateNotice,
  INotice,
  UpdateNoticeArgs,
} from "@/types/notices.types";
import {
  IAdminPaymentResponse,
  IPaymentUpdateResponse,
  PaymentUpdateData,
} from "@/types/payment.types";
import {
  ICreateSpot,
  IInviteTenant,
  IProperty,
  IPropertyFull,
  ISpot,
} from "@/types/properties.type";
import {
  IServiceRequest,
  UpdateServiceRequestArgs,
} from "@/types/serviceRequest.types";
import {
  ITenant,
  ITenantApiResponse,
  ITenantUpdatePayload,
} from "@/types/tenant.types";
import { ISetTenantPassword } from "@/types/user.types";
import { api } from "./api";

// create Property
export async function createProperty(data: IPropertyFull) {
  return api<IPropertyFull>(API_ENDPOINTS.ADMIN.properties, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify(data),
    revalidate: {
      queryKeys: [["admin", "property", "tenants"], ["properties"]],
    },
  });
}
// /admin/properties
export async function getAllProperties() {
  return api<IProperty[]>(API_ENDPOINTS.ADMIN.properties, {
    method: "GET",
    requireToken: true,
  });
}

// get a Single Property By Id
export async function getPropertyById({ propertyId }: { propertyId: string }) {
  const url = `${API_BASE_URL}/admin/properties/${propertyId}`;
  return api<IPropertyFull>(url, {
    method: "GET",
    requireToken: true,
  });
}

// PATCH /admin/properties/:id
export async function updateProperty({
  propertyId,
  data,
}: {
  propertyId: string;
  data: IPropertyFull;
}) {
  const url = `${API_ENDPOINTS.ADMIN.properties}/${propertyId}`;
  return api<IPropertyFull>(url, {
    method: "PATCH",
    requireToken: true,
    body: JSON.stringify(data),
    revalidate: {
      queryKeys: [["admin", "properties", "tenants"], ["properties"]],
    },
  });
}

// DELETE /admin/properties/:id
export async function deleteProperty(propertyId: string) {
  const url = `${API_ENDPOINTS.ADMIN.properties}/${propertyId}`;
  return api<void>(url, {
    method: "DELETE",
    requireToken: true,
    revalidate: {
      queryKeys: [["admin", "properties", "tenants"], ["properties"]],
    },
  });
}

// get Spots/Lots by property Id
export async function getSpotsByPropertyId(propertyId: string) {
  const url = `${API_BASE_URL}/admin/properties/${propertyId}/spots`;
  return api<ISpot[]>(url, {
    method: "GET",
    requireToken: true,
  });
}

// /admin/properties/64f1234567890abcdef12345/spots?status=AVAILABLE
// GET all available spots for a property
export async function getAllSpots({ propertyId }: { propertyId: string }) {
  const url = `${API_BASE_URL}/admin/properties/${propertyId}/spots?status=AVAILABLE`;
  return api<ISpot[]>(url, {
    method: "GET",
    requireToken: true,
  });
}

//  Fetch one spot by its ID
export async function getSpotById(id: string) {
  const url = `${API_BASE_URL}/admin/spots/${id}`;
  return api<ISpot>(url, {
    method: "GET",
    requireToken: true,
  });
}

// create a spot
export async function createSpot(data: ICreateSpot) {
  return api<ISpot>(`${API_BASE_URL}/admin/spots`, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify(data),
    revalidate: {
      queryKeys: [
        ["admin", "properties", "tenants"],
        ["properties"],
        ["admin", "tenants"],
      ],
    },
  });
}

//  Update a spot by ID
export async function updateSpotById(id: string, data: Partial<ISpot>) {
  const url = `${API_BASE_URL}/admin/spots/${id}`;
  return api<ISpot>(url, {
    method: "PATCH",
    requireToken: true,
    body: JSON.stringify(data),
    revalidate: {
      queryKeys: [["admin", "properties", "tenants"], ["properties"]],
    },
  });
}

//  Delete a spot by ID
export async function deleteSpotById(id: string) {
  const url = `${API_BASE_URL}/admin/spots/${id}`;
  return api<void>(url, {
    method: "DELETE",
    requireToken: true,
    revalidate: {
      queryKeys: [["admin", "properties", "tenants"], ["properties"]],
    },
  });
}

// /admin/invite
export async function inviteTenant(data: IInviteTenant) {
  const url = `${API_BASE_URL}/admin/invite-tenant`;
  return api<IInviteTenant>(url, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify(data),
  });
}

export async function setTenantPassword(data: ISetTenantPassword) {
  const url = `${API_ENDPOINTS.ADMIN.setTenantPassword}`;
  return api<ISetTenantPassword>(url, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify(data),
  });
}

// get all tenants
export async function getAllTenants() {
  return api<ITenant[]>(`${API_BASE_URL}/admin/tenants`, {
    method: "GET",
    requireToken: true,
  });
}

//get tenant by id

export async function getTenantById({ userId }: { userId: string }) {
  const url = `${API_BASE_URL}/admin/tenants/${userId}`;
  return api<ITenant>(url, {
    method: "GET",
    requireToken: true,
  });
}
// get all notices

//get User by Id
export async function getUserById({ userId }: { userId: string }) {
  const url = `${API_BASE_URL}/users/${userId}`;
  return api(url, {
    method: "GET",
    requireToken: true,
  });
}

//Update User by Id

export async function updateUserById({
  userId,
  data,
}: {
  userId: string;
  data: Partial<ITenant> | ITenantUpdatePayload;
}) {
  const url = `${API_BASE_URL}/users/${userId}/tenant-data`;
  return api(url, {
    method: "PATCH", // assuming you're using PATCH for partial updates
    body: JSON.stringify(data),
    requireToken: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//delete user By id
export async function deleteUserById({ userId }: { userId: string }) {
  const url = `${API_BASE_URL}/users/${userId}`;
  return api(url, {
    method: "DELETE",
    requireToken: true,
    revalidate: {
      queryKeys: [["admin", "properties", "tenants"], ["properties"]],
    },
  });
}

// get all notices

export async function getAllNotices() {
  return api<INotice[]>(`${API_BASE_URL}/announcements`, {
    method: "GET",
    requireToken: true,
  });
}

// create a new notice
export async function createNotice(data: ICreateNotice) {
  const url = `${API_BASE_URL}/announcements`;
  return api<INotice>(url, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify(data),
    revalidate: {
      queryKeys: [["notices"], ["admin", "notices"]],
    },
  });
}

// get a single notice
export async function getNoticeById({ noticeId }: { noticeId: string }) {
  const url = `${API_BASE_URL}/announcements/${noticeId}`;
  return api(url, {
    method: "GET",
    requireToken: true,
  });
}

//delete notice by id
export async function deleteNoticeById({ noticeId }: { noticeId: string }) {
  const url = `${API_BASE_URL}/announcements/${noticeId}`;
  return api(url, {
    method: "DELETE",
    requireToken: true,
    revalidate: {
      queryKeys: [["notices"], ["admin", "notices"]],
    },
  });
}

//update notice by id
export async function updateNoticeById({ noticeId, data }: UpdateNoticeArgs) {
  const url = `${API_BASE_URL}/announcements/${noticeId}`;

  return api(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    requireToken: true, //d
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//get all service requests
export async function getAllServiceRequests() {
  return api<IServiceRequest[]>(`${API_BASE_URL}/service-requests`, {
    method: "GET",
    requireToken: true,
  });
}

//update service request by id
export async function updateServiceRequestById({
  requestId,
  data,
}: UpdateServiceRequestArgs) {
  const url = `${API_BASE_URL}/service-requests/${requestId}`;

  return api(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    requireToken: true, //d
    headers: {
      "Content-Type": "application/json",
    },
  });
}
//delete service request by id
export async function deleteServiceRequestById({
  requestId,
}: {
  requestId: string;
}) {
  const url = `${API_BASE_URL}/service-requests/${requestId}`;
  return api(url, {
    method: "DELETE",
    requireToken: true,
  });
}

//get a tenant user

export async function getTenant() {
  return api<ITenantApiResponse>(`${API_BASE_URL}/users/me`, {
    method: "GET",
    requireToken: true,
  });
}
// get All notice for tenant
export async function getTenantNotices() {
  return api<INotice[]>(`${API_BASE_URL}/users/announcements`, {
    method: "GET",
    requireToken: true,
  });
}

export async function getTenantServiceRequests() {
  return api<IServiceRequest[]>(`${API_BASE_URL}/users/service-requests`, {
    method: "GET",
    requireToken: true,
  });
}

// Stripe Account Management - Updated to match backend schema
export const getStripeAccounts = async () => {
  return api(`${API_BASE_URL}/stripe/accounts`, {
    method: "GET",
    requireToken: true,
  });
};

export const createStripeAccount = async (accountData: {
  name: string;
  description?: string;
  stripeAccountId: string;
  stripeSecretKey: string;
  accountType?: "STANDARD" | "CONNECT";
  isGlobalAccount?: boolean;
  isDefaultAccount?: boolean;
  businessName?: string;
  businessEmail?: string;
  metadata?: Record<string, unknown>;
}) => {
  return api(`${API_BASE_URL}/stripe/accounts`, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify(accountData),
  });
};

export const updateStripeAccount = async (
  accountId: string,
  updateData: {
    name?: string;
    description?: string;
    stripeSecretKey?: string;
    accountType?: "STANDARD" | "CONNECT";
    isActive?: boolean;
    isDefaultAccount?: boolean;
    businessName?: string;
    businessEmail?: string;
    metadata?: Record<string, unknown>;
  }
) => {
  return api(`${API_BASE_URL}/stripe/accounts/${accountId}`, {
    method: "PATCH",
    requireToken: true,
    body: JSON.stringify(updateData),
  });
};

export const deleteStripeAccount = async (accountId: string) => {
  return api(`${API_BASE_URL}/stripe/accounts/${accountId}`, {
    method: "DELETE",
    requireToken: true,
  });
};

// get all the stripe accounts with property details
export async function getStripeAccountsWithPropertyDetails() {
  return api<IProperty[]>(`${API_BASE_URL}/stripe/accounts`, {
    method: "GET",
    requireToken: true,
  });
}

// link properties to stripe account
export async function linkPropertiesToAccount(
  accountId: string,
  propertyIds: string[]
) {
  return api(`${API_BASE_URL}/stripe/accounts/link-properties`, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify({ accountId, propertyIds }),
  });
}

// unlink properties from stripe account
export async function unlinkPropertiesFromAccount(
  accountId: string,
  propertyIds: string[]
) {
  return api(`${API_BASE_URL}/stripe/accounts/unlink-properties`, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify({ accountId, propertyIds }),
  });
}

// set default stripe account
export async function setDefaultStripeAccount(accountId: string) {
  return api(`${API_BASE_URL}/stripe/accounts/${accountId}/set-default`, {
    method: "PATCH",
    requireToken: true,
  });
}

// get all payments
export async function getAllPayments() {
  return api<IAdminPaymentResponse>(`${API_BASE_URL}/admin/payments`, {
    method: "GET",
    requireToken: true,
  });
}

// Document Management Functions
export async function getAllDocuments() {
  return api<IDocument[]>(`${API_BASE_URL}/documents`, {
    method: "GET",
    requireToken: true,
  });
}

export async function getDocumentById(documentId: string) {
  return api<IDocument>(`${API_BASE_URL}/documents/${documentId}`, {
    method: "GET",
    requireToken: true,
  });
}

export async function createDocument(documentData: ICreateDocument) {
  return api<IDocument>(`${API_BASE_URL}/documents`, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify(documentData),
    revalidate: {
      queryKeys: [["admin", "documents"]],
    },
  });
}

export async function updateDocument(
  documentId: string,
  updateData: Partial<ICreateDocument>
) {
  return api<IDocument>(`${API_BASE_URL}/documents/${documentId}`, {
    method: "PATCH",
    requireToken: true,
    body: JSON.stringify(updateData),
    revalidate: {
      queryKeys: [["admin", "documents"]],
    },
  });
}

export async function deleteDocument(documentId: string) {
  return api(`${API_BASE_URL}/documents/${documentId}`, {
    method: "DELETE",
    requireToken: true,
    revalidate: {
      queryKeys: [["admin", "documents"]],
    },
  });
}

// Record manual payment for a tenant
export async function recordTenantPayment(
  tenantId: string,
  paymentData: PaymentUpdateData
) {
  const url = `${API_BASE_URL}/admin/payments/tenant/${tenantId}`;
  return api<IPaymentUpdateResponse>(url, {
    method: "PATCH",
    requireToken: true,
    body: JSON.stringify(paymentData),

    revalidate: {
      queryKeys: [
        ["admin", "payments"],
        ["admin", "tenants"],
      ],
    },
  });
}
