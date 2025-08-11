import { getToken, handleAuthError } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";

export interface ApiOptions extends RequestInit {
  requireToken?: boolean;
  revalidate?: {
    queryKeys?: string[][];
    tags?: string[];
  };
}

export async function api<T>(
  url: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T> & { revalidate?: ApiOptions["revalidate"] }> {
  const method = options.method?.toUpperCase() || "GET";
  const { requireToken = false, revalidate, ...fetchOptions } = options;

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
}
