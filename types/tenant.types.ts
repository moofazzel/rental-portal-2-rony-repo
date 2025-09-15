export interface ITenant {
  _id?: string;

  name: string;
  email: string;
  phoneNumber: string;

  emergencyContact?: string;
  bio?: string;
  isInvited?: boolean;
  isVerified?: boolean;
  profileImage?: string;
  role?: "TENANT";
  tenantStatus?: boolean; // true if all required data is filled, false otherwise

  // Payment Status
  paymentStatus?: {
    currentStatus: "NO_PAYMENTS" | "CURRENT" | "DUE" | "OVERDUE";
    lastPaymentDate: string | null;
    nextDueDate: string | null;
    overdueAmount: number;
    totalOutstanding: number;
    paymentHistory: any[];
  };

  // RV Information
  rvInfo?: {
    make: string;
    model: string;
    year: number;
    length: number;
    licensePlate: string;
  };

  // Lot and Spot Info
  lotNumber?: string;

  lotDescription?: string;
  lotStatus?: string;
  lotSize?: {
    length: number;
    width: number;
  };
  lotPrice?: {
    daily: number;
    weekly: number;
    monthly: number;
  };

  // Spot reference (can include spotId or full object depending on population)
  spot?:
    | {
        _id: string;
        spotNumber: string;
        status: string;
      }
    | string;

  // Property Info
  property?:
    | {
        _id?: string;
        id?: string;
        name: string;
        address: {
          street: string;
          city: string;
          state: string;
          zip: string;
          country: string;
        };
      }
    | string;

  preferredLocation?: string;
  payments?: {
    pending: [];
  }; // likely a property ID reference

  // Lease Info
  leaseType?: "monthly" | "fixed"; // NEW: Add this field with specific string literals
  leaseStart?: string;
  leaseEnd?: string;
  rent?: string;
  deposit?: string;
  occupants?: string;
  pets?: string;

  // Optional: tenant address field (if separate from property)
  address?: {
    street?: string;

    city?: string;
    state?: string;
    zip?: string;
  };

  specialRequests?: string[];
  totalLots?: string;

  // Stripe payment link fields
  stripePaymentLinkId?: string; // Single payment link per tenant
  stripePaymentLinkUrl?: string; // Payment link URL

  lease?: {
    id?: string;
    leaseType: "MONTHLY" | "FIXED";
    leaseStart?: string;
    leaseEnd?: string;
    rentAmount: number;
    additionalRentAmount?: number;
    totalRentAmount?: number;
    depositAmount: number;
    leaseStatus?: string;
    occupants?: number;
    pets?: {
      hasPets: boolean;
      petDetails: string[];
    };
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    specialRequests?: string[];
    documents?: {
      name: string;
      url: string;
      uploadedAt: string;
    }[];
    leaseAgreement?: string;
    notes?: string;
  };

  // Rent Summary for payment processing
  rentSummary?: {
    hasActiveLease: boolean;
    tenantStatus: boolean;
    propertyName: string;
    propertyAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    spotNumber: string;
    rentAmount: number;
    depositAmount: number;
    leaseStart: string;
    isLeaseExpiringSoon: boolean;
    isFirstTimePayment: boolean;
    currentMonthAmount: number;
    currentMonthDescription: string;
    totalOverdueAmount: number;
    totalDue: number;
    nextMonthDueDate: string;
    overduePaymentsDetails: Array<{
      dueDate: string;
      amount: number;
      description: string;
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
    paymentAction: string;
    canPayNextMonth: boolean;
    warningMessage: string;
    hasOverduePayments: boolean;
    overdueCount: number;
    leaseExpirationWarning: string | null;
  };
}

// declares exactly the envelope you get back
export interface ITenantApiResponse {
  user: ITenant;
  tenantStatus?: boolean;
  property: {
    _id: string;
    name: string;
    description: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country?: string;
    };
    amenities: string[];
    images: string[];
    rules: string[];
  };
  payments?: {
    pending: Array<{
      _id: string;
      amount: number;
      status: string;
      dueDate: string;
      description: string;
    }>;
    recent: Array<{
      _id: string;
      amount: number;
      status: string;
      dueDate: string;
      paidDate: string;
      description: string;
      receiptNumber: string;
    }>;
    summary: {
      totalPendingAmount: number;
      overdueCount: number;
      totalOverdueAmount: number;
      hasActivePaymentLinks: boolean;
      nextPaymentDue: {
        dueDate: string;
        amount: number;
        description: string;
      } | null;
    };
  };
  spot: {
    _id: string;
    spotNumber: string;
    spotIdentifier: string;
    status: string;
    size:
      | {
          length: number;
          width: number;
        }
      | string;
    amenities: string[];
    price:
      | {
          daily: number;
          weekly: number;
          monthly: number;
        }
      | number;
    description: string;
    images: string[];
  };
  lease?: {
    _id: string;
    leaseStart: string;
    leaseEnd?: string;
    rentAmount: number;
    depositAmount: number;
    leaseStatus: string;
    occupants: number;
    rvInfo: {
      make: string;
      model: string;
      year: number;
      length: number;
      licensePlate: string;
    };
    isLeaseActive?: boolean;
    durationDays?: number;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship?: string;
    };
    specialRequests?: string[];
    documents?: Array<{
      name: string;
      url: string;
      uploadedAt?: string;
    }>;
    leaseAgreement?: string;
    notes?: string;
  };
  rent?: {
    currentRentAmount: number;
    depositAmount: number;
    dueDates: {
      currentMonthDueDate: string;
      nextMonthDueDate: string;
      earliestOverdueDate: string;
      overdueDueDates: string[];
      nextPaymentDueDate: string;
    };
    summary: {
      hasActiveLease: boolean;
      isFirstTimePayment: boolean;
      currentMonthAmount: number;
      currentMonthDescription: string;
      totalOverdueAmount: number;
      totalDue: number;
      currentMonthDueDate: string;
      nextMonthDueDate: string;
      overduePaymentsDetails: Array<{
        dueDate: string;
        amount: number;
        description: string;
        daysOverdue: number;
      }>;
      paymentAction: string;
      canPayNextMonth: boolean;
      warningMessage: string;
      hasOverduePayments: boolean;
      overdueCount: number;
      leaseExpirationWarning: string | null;
    };
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
  };
  serviceRequests?: {
    recent: Array<{
      _id: string;
      title: string;
      status: string;
      createdAt: string;
    }>;
    count: number;
  };
  announcements?: {
    unread: Array<{
      _id: string;
      title: string;
      content: string;
      createdAt: string;
    }>;
    unreadCount: number;
  };
  assignmentHistory: any[];
}

export interface ITenantUpdatePayload {
  user?: {
    name?: string;
    phoneNumber?: string;
    email?: string;
    rvInfo?: {
      make: string;
      model: string;
      year: number;
      length: number;
      licensePlate: string;
    };
  };
  lease?: {
    leaseType?: "MONTHLY" | "FIXED_TERM";
    leaseStart?: Date;
    leaseEnd?: Date;
    rentAmount?: number;
    depositAmount?: number;
    occupants?: number;
    pets?: {
      hasPets: boolean;
      petDetails?: {
        type: string;
        breed: string;
        name: string;
        weight: number;
      }[];
    };
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    specialRequests?: string[];
    documents?: string[];
    notes?: string;
  };
}
