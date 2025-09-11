"use server";

import { api } from "@/app/apiClient/api";
import { API_ENDPOINTS } from "@/constants/ApiEndpointsConstants";
import { IProperty } from "@/types/properties.type";
import { ISetTenantPassword } from "@/types/user.types";

export type TenantSetupFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// Get all properties for mapping property IDs to names
export async function getAllPropertiesAction(): Promise<{
  success: boolean;
  data?: IProperty[];
  error?: string;
}> {
  try {
    const response = await api<IProperty[]>(API_ENDPOINTS.ADMIN.properties, {
      method: "GET",
      requireToken: true,
    });

    if (!response.success) {
      return {
        success: false,
        error: response.message || "Failed to fetch properties",
      };
    }

    return {
      success: true,
      data: response.data || [],
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      success: false,
      error: "Failed to fetch properties",
    };
  }
}

// Set tenant password
export async function setTenantPasswordAction(
  prevState: TenantSetupFormState,
  formData: FormData
): Promise<TenantSetupFormState> {
  const email = formData.get("email") as string;
  const tenantId = formData.get("tenantId") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Client-side validation
  const errors: Record<string, string[]> = {};

  if (!email) {
    errors.email = ["Email is required"];
  }

  if (!tenantId) {
    errors.tenantId = ["Tenant ID is required"];
  }

  if (!password) {
    errors.password = ["Password is required"];
  } else if (password.length < 8) {
    errors.password = ["Password must be at least 8 characters long"];
  } else if (!/(?=.*[a-z])/.test(password)) {
    errors.password = ["Password must contain at least one lowercase letter"];
  } else if (!/(?=.*[A-Z])/.test(password)) {
    errors.password = ["Password must contain at least one uppercase letter"];
  } else if (!/(?=.*\d)/.test(password)) {
    errors.password = ["Password must contain at least one number"];
  }

  if (!confirmPassword) {
    errors.confirmPassword = ["Please confirm your password"];
  } else if (confirmPassword !== password) {
    errors.confirmPassword = ["Passwords do not match"];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  try {
    const response = await api<ISetTenantPassword>(
      API_ENDPOINTS.ADMIN.setTenantPassword,
      {
        method: "POST",
        requireToken: true,
        body: JSON.stringify({
          email,
          tenantId,
          password,
          confirmPassword,
        }),
      }
    );
    console.log("🚀 ~ tenantId:", tenantId);
    console.log("🚀 ~ response:", response);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to set password",
      };
    }

    return {
      success: true,
      message: "Setup completed successfully!",
    };
  } catch (error) {
    console.error("Error setting tenant password:", error);
    return {
      success: false,
      message: "Failed to set password. Please try again.",
    };
  }
}
