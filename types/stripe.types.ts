/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Types } from "mongoose";

export interface IStripeAccount extends Document {
  name: string;
  description?: string;
  propertyId?: Types.ObjectId; // Optional - can be linked later
  // Stripe Connect account details
  stripeAccountId: string;
  // Account status
  isActive: boolean;
  isVerified: boolean;
  // Global account flag - if true, can be used for all properties
  isGlobalAccount: boolean;
  // Business information (minimal)
  businessName?: string;
  businessEmail?: string;
  // Metadata
  metadata?: any;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateStripeAccount {
  name: string;
  description?: string;
  stripeAccountId: string;
  isGlobalAccount?: boolean;
  businessName?: string;
  businessEmail?: string;
  metadata?: any;
}

export interface IUpdateStripeAccount {
  name?: string;
  description?: string;
  isActive?: boolean;
  businessName?: string;
  businessEmail?: string;
  metadata?: any;
}

export interface IStripeAccountResponse {
  _id: string;
  name: string;
  description?: string;
  propertyId?: string;
  stripeAccountId: string;
  isActive: boolean;
  isVerified: boolean;
  isGlobalAccount: boolean;
  businessName?: string;
  businessEmail?: string;
  metadata?: any;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentLink {
  id: string;
  url: string;
  expiresAt: number;
  active: boolean;
}

export interface ICreatePaymentLinkRequest {
  tenantId: string;
  propertyId: string;
  spotId: string;
  amount: number;
  type: "RENT" | "DEPOSIT" | "LATE_FEE" | "UTILITY" | "MAINTENANCE" | "OTHER";
  dueDate: string;
  description: string;
  lateFeeAmount?: number;
}

export interface IPaymentLinkResponse {
  payment: {
    _id: string;
    receiptNumber: string;
    status: string;
    totalAmount: number;
    stripeAccountId: string;
  };
  paymentLink: {
    id: string;
    url: string;
    expiresAt: number;
  };
}
