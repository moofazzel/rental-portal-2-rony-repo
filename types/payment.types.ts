export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod =
  | "CASH"
  | "CHECK"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "ONLINE";

export type PaymentType =
  | "RENT"
  | "DEPOSIT"
  | "LATE_FEE"
  | "UTILITY"
  | "MAINTENANCE"
  | "OTHER";

export interface IPayment {
  _id: string;
  tenantId: string; // Reference to User (tenant)
  propertyId: string; // Reference to Property
  spotId: string; // Reference to Spot
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: PaymentMethod;
  transactionId?: string; // External payment processor transaction ID
  receiptNumber: string; // Internal receipt number
  description: string;
  notes?: string;
  lateFeeAmount?: number;
  totalAmount: number; // amount + lateFeeAmount
  createdBy: string; // Admin who created the payment record
  // Stripe payment fields
  stripePaymentLinkId?: string; // Link to Stripe payment link
  stripeTransactionId?: string; // From Stripe webhook
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Virtual properties
  isOverdue: boolean;
  daysOverdue: number;
}

export interface ICreatePayment {
  tenantId: string;
  propertyId: string;
  spotId: string;
  amount: number;
  type: PaymentType;
  dueDate: Date;
  description: string;
  notes?: string;
  lateFeeAmount?: number;
}

export interface IUpdatePayment {
  amount?: number;
  type?: PaymentType;
  status?: PaymentStatus;
  dueDate?: Date;
  paidDate?: Date;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  description?: string;
  notes?: string;
  lateFeeAmount?: number;
}

// New interface for manual payment recording
export interface IRecordManualPayment {
  amount: number;
  paidDate: string; // ISO string format
  description?: string;
  notes?: string;
}

// Interface for payment update data (matches the API specification)
export interface PaymentUpdateData {
  amount: number;
  paidDate: string;
  dueDate: string;
  description?: string;
  type?: PaymentType;
  notes?: string;
}

// Response interface for payment update
export interface IPaymentUpdateResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    type: PaymentType;
    status: PaymentStatus;
    amount: number;
    totalAmount: number;
    dueDate: string;
    paidDate: string;
    paymentMethod: PaymentMethod;
    description: string;
    notes: string;
    tenant: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
    };
    property: {
      id: string;
      name: string;
      address: string;
    };
    spot: {
      id: string;
      spotNumber: string;
      lotIdentifier: string;
    };
  };
}

export interface IRecordPayment {
  paymentId: string;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface IPaymentHistory {
  tenantId: string;
  propertyId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: PaymentStatus;
  type?: PaymentType;
}

export interface IPaymentSummary {
  hasActiveLease: boolean;
  propertyName: string;
  propertyAddress:
    | string
    | {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
  spotNumber: string;
  rentAmount: number;
  depositAmount: number;
  leaseStart: string;
  leaseEnd?: string;
  isLeaseExpiringSoon: boolean;
  isFirstTimePayment: boolean;
  currentMonthAmount: number;
  currentMonthDescription: string;
  totalOverdueAmount: number;
  totalDue: number;
  currentMonthDueDate?: string;
  nextMonthDueDate?: string;
  overduePaymentsDetails: Array<{
    month?: string;
    amount: number;
    description?: string;
    dueDate: string;
    daysOverdue: number;
  }>;
  canPayCurrentAndOverdue: boolean;
  paymentOptions: Array<{
    type: string;
    amount: number;
    description: string;
    dueDate: string;
  }>;
  isProRated: boolean;
  proRatedDays: number;
  proRatedRentAmount: number;
  fullMonthRentAmount: number;
  paymentAction:
    | "FIRST_TIME_PAYMENT"
    | "CAN_PAY_NEXT_MONTH"
    | "PAYMENT_LIMIT_REACHED"
    | "REGULAR_PAYMENT"
    | "CURRENT_MONTH_OVERDUE";
  canPayNextMonth: boolean;
  warningMessage: string | null;
  hasOverduePayments: boolean;
  overdueCount: number;
  leaseExpirationWarning: string | null;
}

// New types for the admin payments API response
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IAdminPaymentResponse {
  payments: IAdminPayment[];
  pagination: IPagination;
}

export interface IAdminPayment {
  id: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  lateFeeAmount: number;
  totalAmount: number;
  dueDate: string;
  receiptNumber: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  tenant: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  property: {
    id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  spot: {
    id: string;
    spotNumber: string;
    spotIdentifier: string;
  };
  stripe?: {
    paymentLinkId: string;
  };
}
