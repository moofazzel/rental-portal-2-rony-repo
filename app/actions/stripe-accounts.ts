"use server";

import {
  createStripeAccount,
  deleteStripeAccount,
  getStripeAccountsWithPropertyDetails,
  linkPropertiesToAccount,
  setDefaultStripeAccount,
  unlinkPropertiesFromAccount,
  updateStripeAccount,
} from "@/app/apiClient/adminApi";
import { revalidatePath } from "next/cache";

interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Property {
  _id: string;
  name: string;
  address: PropertyAddress;
}

interface StripeAccountResponse {
  _id: string;
  name: string;
  description?: string;
  stripeAccountId: string;
  stripeSecretKey: string;
  accountType: "STANDARD" | "CONNECT";
  businessName?: string;
  businessEmail?: string;
  isActive: boolean;
  isVerified: boolean;
  isGlobalAccount: boolean;
  isDefaultAccount: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  propertyIds: Property[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  stripeAccounts: StripeAccountResponse[];
  unassignedProperties: Property[];
  defaultAccount: {
    _id: string;
    name: string;
    stripeAccountId: string;
    isDefaultAccount: boolean;
    properties: Property[];
  };
  summary: {
    totalStripeAccounts: number;
    totalProperties: number;
    assignedProperties: number;
    unassignedProperties: number;
    hasDefaultAccount: boolean;
    defaultAccountPropertiesCount: number;
  };
}

export interface StripeAccountData {
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
}

export interface UpdateStripeAccountData {
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

export async function createStripeAccountAction(
  accountData: StripeAccountData
) {
  try {
    const response = await createStripeAccount({
      name: accountData.name,
      description: accountData.description,
      stripeAccountId: accountData.stripeAccountId,
      stripeSecretKey: accountData.stripeSecretKey,
      accountType: accountData.accountType || "STANDARD",
      isGlobalAccount: accountData.isGlobalAccount,
      isDefaultAccount: accountData.isDefaultAccount,
      businessName: accountData.businessName,
      businessEmail: accountData.businessEmail,
      metadata: accountData.metadata,
    });

    if (response.success) {
      revalidatePath("/admin/stripe-accounts");
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.message || "Failed to create account",
      };
    }
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function getStripeAccountsData() {
  try {
    const response = await getStripeAccountsWithPropertyDetails();

    if (response.success && response.data) {
      const apiData = response.data as unknown as ApiResponse;

      // Map Stripe accounts to the expected format
      const accounts = apiData.stripeAccounts
        .filter((account: StripeAccountResponse) => !account.isDeleted)
        .map((account: StripeAccountResponse) => ({
          id: account._id,
          name: account.name,
          accountId: account.stripeAccountId,
          stripeSecretKey: account.stripeSecretKey,
          accountType: account.accountType,
          status: (account.isVerified ? "active" : "pending") as
            | "active"
            | "pending"
            | "restricted",
          businessName: account.businessName,
          businessEmail: account.businessEmail,
          description: account.description,
          isActive: account.isActive,
          isGlobalAccount: account.isGlobalAccount,
          isDefaultAccount: account.isDefaultAccount,
          isDeleted: account.isDeleted,
          deletedAt: account.deletedAt,
          propertyIds: account.propertyIds || [],
          metadata: account.metadata,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        }));

      // Create a properties array from all properties (assigned + unassigned)
      const allProperties: Array<{
        _id: string;
        name: string;
        address: PropertyAddress;
        totalLots: number;
        availableLots: number;
        isActive: boolean;
        stripeAccount?: {
          _id: string;
          name: string;
          stripeAccountId: string;
          stripeSecretKey: string;
          accountType: "STANDARD" | "CONNECT";
          isVerified: boolean;
          businessName?: string;
          businessEmail?: string;
          isGlobalAccount: boolean;
          isActive: boolean;
        };
        hasStripeAccount?: boolean;
      }> = [];

      // Add assigned properties
      accounts.forEach((account) => {
        if (account.propertyIds && account.propertyIds.length > 0) {
          account.propertyIds.forEach((property) => {
            allProperties.push({
              ...property,
              totalLots: 0, // Default value - should come from API
              availableLots: 0, // Default value - should come from API
              isActive: true, // Default value - should come from API
              hasStripeAccount: true,
              stripeAccount: {
                _id: account.id,
                name: account.name,
                stripeAccountId: account.accountId,
                stripeSecretKey: account.stripeSecretKey,
                accountType: account.accountType,
                isVerified: account.status === "active",
                businessName: account.businessName,
                businessEmail: account.businessEmail,
                isGlobalAccount: account.isGlobalAccount,
                isActive: account.isActive,
              },
            });
          });
        }
      });

      // Add unassigned properties (no stripeAccount)
      apiData.unassignedProperties.forEach((property) => {
        allProperties.push({
          ...property,
          totalLots: 0, // Default value - should come from API
          availableLots: 0, // Default value - should come from API
          isActive: true, // Default value - should come from API
          hasStripeAccount: false,
          stripeAccount: undefined,
        });
      });

      return {
        success: true,
        accounts: accounts,
        properties: allProperties,
        summary: apiData.summary,
        defaultAccount: apiData.defaultAccount,
      };
    } else {
      return {
        success: false,
        error: response.message || "Failed to fetch data",
        accounts: [],
        properties: [],
        summary: null,
        defaultAccount: null,
      };
    }
  } catch (error) {
    console.error("Error fetching Stripe accounts data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch data",
      accounts: [],
      properties: [],
      summary: null,
      defaultAccount: null,
    };
  }
}

export async function linkPropertiesToAccountAction(
  accountId: string,
  propertyIds: string[]
) {
  console.log("🚀 ~ propertyIds:", propertyIds);
  console.log("🚀 ~ accountId:", accountId);
  try {
    const response = await linkPropertiesToAccount(accountId, propertyIds);

    if (response.success) {
      revalidatePath("/admin/stripe-accounts");
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.message || "Failed to link properties",
      };
    }
  } catch (error) {
    console.error("Error linking properties to account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to link properties",
    };
  }
}

export async function unlinkPropertiesFromAccountAction(
  accountId: string,
  propertyIds: string[]
) {
  try {
    const response = await unlinkPropertiesFromAccount(accountId, propertyIds);

    if (response.success) {
      revalidatePath("/admin/stripe-accounts");
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.message || "Failed to unlink properties",
      };
    }
  } catch (error) {
    console.error("Error unlinking properties from account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to unlink properties",
    };
  }
}

export async function setDefaultAccountAction(accountId: string) {
  try {
    const response = await setDefaultStripeAccount(accountId);

    if (response.success) {
      revalidatePath("/admin/stripe-accounts");
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.message || "Failed to set default account",
      };
    }
  } catch (error) {
    console.error("Error setting default account:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to set default account",
    };
  }
}

export async function updateStripeAccountAction(
  accountId: string,
  updateData: UpdateStripeAccountData
) {
  try {
    const response = await updateStripeAccount(accountId, updateData);

    if (response.success) {
      revalidatePath("/admin/stripe-accounts");
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.message || "Failed to update account",
      };
    }
  } catch (error) {
    console.error("Error updating Stripe account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update account",
    };
  }
}

export async function deleteStripeAccountAction(accountId: string) {
  try {
    const response = await deleteStripeAccount(accountId);

    if (response.success) {
      revalidatePath("/admin/stripe-accounts");
      return { success: true };
    } else {
      return {
        success: false,
        error: response.message || "Failed to delete account",
      };
    }
  } catch (error) {
    console.error("Error deleting Stripe account:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete account",
    };
  }
}
