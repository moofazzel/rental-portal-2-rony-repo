export interface IProperty {
  id?: string;
  _id?: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  description?: string;
  identifierType: "lotNumber" | "roadNumber"; // New field for lot identification type
  totalLots: number;
  availableLots: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Additional fields from API
  amenities?: string[];
  images?: string[];
  rules?: string[];
  totalSpots?: number;
  availableSpots?: number;
  // Stripe account configuration
  stripeAccountId?: string;
  stripeAccountStatus?: "active" | "inactive" | "pending" | "restricted";
  stripeConnectAccountId?: string;
  stripePaymentLinks?: {
    id: string;
    url: string;
    active: boolean;
    created: Date;
  }[];
  useGlobalStripeAccount?: boolean; // Whether to use global account or property-specific
  // New API structure
  stripeAccount?: {
    _id: string;
    name: string;
    description?: string;
    stripeAccountId: string;
    isActive: boolean;
    isVerified: boolean;
    businessName?: string;
    businessEmail?: string;
    isGlobalAccount: boolean;
  } | null;
  hasStripeAccount?: boolean;
  totalMaxIncome?: number;
  totalCurrentActiveIncome?: number;
}

export interface IPropertyFull extends IProperty {
  lots?: ILot[];
  tenants?: ITenant[];
  payments?: IPayment[];
  spots?: ISpot[];
}

export interface ILot {
  id?: string;
  _id?: string;
  spotNumber: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  lotDescription?: string;
  lotSize?: {
    length: number;
    width: number;
  };
  lotPrice?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  propertyId: string;
  tenantId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITenant {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
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
  spot?:
    | {
        _id: string;
        spotNumber: string;
        status: string;
      }
    | string;
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
  };
  leaseType?: "monthly" | "fixed";
  leaseStart?: string;
  leaseEnd?: string;
  rent?: string;
  deposit?: string;
  occupants?: string;
  pets?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  specialRequests?: string[];
  totalLots?: string;
  stripePaymentLinkId?: string;
  stripePaymentLinkUrl?: string;
  lease?: {
    id?: string;
    leaseType: "MONTHLY" | "FIXED";
    leaseStart: string;
    leaseEnd?: string;
    rentAmount: number;
    depositAmount: number;
    occupants: number;
    pets: {
      hasPets: boolean;
      petDetails: string[];
    };
    leaseStatus: string;
    notes?: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
    specialRequests: string[];
  };
}

export interface IPayment {
  _id?: string;
  tenantId: string;
  propertyId: string;
  spotId: string;
  amount: number;
  type: "RENT" | "DEPOSIT" | "LATE_FEE" | "UTILITY" | "MAINTENANCE" | "OTHER";
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: "CASH" | "CHECK" | "BANK_TRANSFER" | "CREDIT_CARD" | "STRIPE";
  transactionId?: string;
  receiptNumber: string;
  description: string;
  notes?: string;
  lateFeeAmount?: number;
  totalAmount: number;
  createdBy: string;
  stripePaymentLinkId?: string;
  stripeTransactionId?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isOverdue: boolean;
  daysOverdue: number;
}

export interface ISpot {
  _id?: string;
  id: string;
  spotNumber: string;
  propertyId: string;
  status: "AVAILABLE" | "MAINTENANCE" | "RESERVED" | "BOOKED";
  size: {
    length: number;
    width: number;
  };
  amenities: string[];
  price: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  description: string;
  images?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ICreateSpot = Pick<
  ISpot,
  | "spotNumber"
  | "propertyId"
  | "size"
  | "amenities"
  | "price"
  | "description"
  | "images"
> & {
  status?: ISpot["status"];
  isActive?: boolean;
  lotIdentifier?: string; // Backward compatibility with backend
};

export type UpdateSpotInput = Partial<Omit<ISpot, "id" | "propertyId">> & {
  lotIdentifier?: string; // Backward compatibility with backend
};

export interface IInviteTenant {
  email: string;
  name: string;
  phoneNumber: string;
  preferredLocation: string;
  propertyId: string;
  spotId: string;
}
