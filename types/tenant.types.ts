export interface ITenant {
  _id?: string;

  name: string;
  email: string;
  phoneNumber: string;
  bio?: string;
  isInvited?: boolean;
  isVerified?: boolean;
  profileImage?: string;
  role?: "TENANT";

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
    notes?: string;
  };
}

// declares exactly the envelope you get back
export interface ITenantApiResponse {
  user: ITenant;
  property: {
    _id: string;
    name: string;
    description: string;
    amenities: string[];
    rules: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country?: string;
    };
  };
  payments?: {
    pending: [];
    recent: [];
    rentAmount: number;
    rentDueDate: string;
    rentStatus: string;
    rentPaymentMethod: string;
    rentPaymentDate: string;
    rentPaymentAmount: number;
    rentPaymentStatus: string;
  };
  spot: {
    _id: string;
    lotNumber: string;
    description: string;
    status: string;
    amenities: string[];
    size: {
      length: number;
      width: number;
    };
    price: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    spotIdentifier: string;
    spotNumber: string;
  };
  serviceRequests?: {
    count: number;
    recent: [];
    // open: number;
    // resolved: number;
  };
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
