"use server";

import { API_BASE_URL } from "@/constants/ApiEndpointsConstants";

import {
  CreateRes,
  CreateServiceRequestDto,
} from "@/types/tenantServiceRequest.types";
// import { ListRes } from "../../types/serviceRequest.types";
import { IDocument } from "@/types/document.types";
import { INotice } from "@/types/notices.types";
import { IPaymentSummary } from "@/types/payment.types";
import { IServiceRequest } from "@/types/serviceRequest.types";
import { IPaymentLinkResponse } from "@/types/stripe.types";
import { api } from "./api";

// TENANTS API CALLS

/** Fetches the list of service requests and returns -------**/

export async function getAllTenantServiceRequests() {
  const res = await api<IServiceRequest>(`${API_BASE_URL}/service-requests`, {
    method: "GET",
    requireToken: true,
  });
  // unwrap the array and hand it back
  return res;
}

export async function createTenantServiceRequest(dto: CreateServiceRequestDto) {
  const res = await api<CreateRes>(`${API_BASE_URL}/service-requests`, {
    method: "POST",
    requireToken: true,
    body: JSON.stringify(dto),
    revalidate: {
      queryKeys: [["tenant", "requests"]],
    },
  });
  return res.data;
}

export async function getPaymentsHistory() {
  const res = await api<{
    payments: Array<{
      id: string;
      datePaid: string;
      amount: number;
      status: string;
      method: string;
      confirmationId: string;
      propertyName: string;
      description: string;
      receiptNumber: string;
      source: string;
    }>;
    summary: {
      totalPaid: number;
      totalPayments: number;
      successRate: number;
      overdueAmount: number;
    };
  }>(`${API_BASE_URL}/payments/payment-history`, {
    method: "GET",
    requireToken: true,
  });

  // Return the response data directly since the api function already unwraps the JSON
  return res;
}

export async function getRentSummary() {
  const res = await api<IPaymentSummary>(
    `${API_BASE_URL}/payments/rent-summary`,
    {
      method: "GET",
      requireToken: true,
    }
  );
  return res.data;
}

export async function createPaymentLink(paymentData: {
  tenantId: string;
  currentDate: string;
}) {
  return api<IPaymentLinkResponse>(
    `${API_BASE_URL}/payments/create-payment-link`,
    {
      method: "POST",
      requireToken: true,
      body: JSON.stringify(paymentData),
    }
  );
}

// Updated interface for the actual receipt response structure
export interface PaymentReceiptResponse {
  id: string;
  receiptNumber: string;
  amount: number;
  totalAmount: number;
  lateFeeAmount: number;
  type: string;
  status: string;
  dueDate: string;
  paidDate: string;
  description: string;
  paymentMethod: string;

  stripeTransactionId: string;
  stripePaymentLinkId: string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  tenant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  property: {
    id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    propertyType?: string;
    lotNumber?: string;
    unitNumber?: string;
  };
  spot: {
    id: string;
    spotNumber: string;
    spotType?: string;
  };
  stripeAccount: {
    id: string;
    name: string;
    stripeAccountId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getPaymentBySessionId(
  sessionId: string,
  accountId: string
) {
  const url = `${API_BASE_URL}/payments/receipt/by-session?session_id=${encodeURIComponent(
    sessionId
  )}&accountId=${encodeURIComponent(accountId)}`;

  return api<PaymentReceiptResponse>(url, {
    method: "GET",
    requireToken: true,
  });
}

// export async function getPropertyById({ propertyId }: { propertyId: string }) {
//   const url = `${API_BASE_URL}/admin/properties/${propertyId}`;
//   return api<IPropertyFull>(url, {
//     method: "GET",
//     requireToken: true,
//   });
// }

export async function getTenantDocuments() {
  const res = await api<IDocument[]>(`${API_BASE_URL}/documents/tenant`, {
    method: "GET",
    requireToken: true,
  });
  return res;
}

export async function getUnreadAnnouncementsForTenant() {
  const url = `${API_BASE_URL}/announcements/tenant`;
  return api<INotice[]>(url, {
    method: "GET",
    requireToken: true,
  });
}

export async function updateEmergencyContact(data: { phone: string }) {
  const url = `${API_BASE_URL}/users/emergency-contact`;
  return api(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    requireToken: true,
  });
}
