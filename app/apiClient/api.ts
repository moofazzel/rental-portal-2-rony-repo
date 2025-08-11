import { checkBackendStatus } from "@/lib/backendStatus";
import { getToken, handleAuthError } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";

export interface ApiOptions extends RequestInit {
  requireToken?: boolean;
  revalidate?: {
    queryKeys?: string[][];
    tags?: string[];
  };
  useMockData?: boolean; // Allow explicit mock data usage
}

export async function api<T>(
  url: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T> & { revalidate?: ApiOptions["revalidate"] }> {
  const method = options.method?.toUpperCase() || "GET";
  const {
    requireToken = false,
    revalidate,
    useMockData = false,
    ...fetchOptions
  } = options;

  // Check if backend is available (only in development)
  if (process.env.NODE_ENV === "development" && !useMockData) {
    const isBackendAvailable = await checkBackendStatus();
    if (!isBackendAvailable) {
      console.warn(`⚠️ Backend unavailable. Request to ${url} will fail.`);
      console.info(
        `💡 Use useMockData: true option for development without backend.`
      );
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Only add Authorization header if explicitly requested
  if (requireToken) {
    const token = await getToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `${token}`;
    }
  }

  // Warn during development if GET/HEAD has a body
  if ((method === "GET" || method === "HEAD") && fetchOptions.body) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`⚠️ ${method} request should not have a body. Removing it.`);
    }
    delete fetchOptions.body;
  }

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      method,
      headers,
    });

    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      // Auto logout on authentication failure
      if (typeof window !== "undefined") {
        handleAuthError();
        return {
          success: false,
          message: "Authentication failed. Please login again.",
          data: null,
          revalidate,
        } as ApiResponse<T> & { revalidate?: ApiOptions["revalidate"] };
      }
    }

    const json = await res.json();

    // Return the response with revalidation options if provided
    return {
      ...json,
      revalidate,
    };
  } catch (error) {
    // Handle network errors (no backend, connection issues, etc.)
    console.error(`API request failed for ${url}:`, error);

    // Check if it's a connection error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        statusCode: 0,
        message:
          "Unable to connect to server. Please check your connection or try again later.",
        data: null,
        revalidate,
        error: "NETWORK_ERROR",
      } as ApiResponse<T> & { revalidate?: ApiOptions["revalidate"] };
    }

    // Handle other fetch errors
    return {
      success: false,
      statusCode: 0,
      message: "An unexpected error occurred. Please try again.",
      data: null,
      revalidate,
      error: "FETCH_ERROR",
    } as ApiResponse<T> & { revalidate?: ApiOptions["revalidate"] };
  }
}
