import { API_BASE_URL } from "@/constants/ApiEndpointsConstants";

let backendStatus: "checking" | "available" | "unavailable" = "checking";
let lastCheck = 0;
const CHECK_INTERVAL = 30000; // Check every 30 seconds

export async function checkBackendStatus(): Promise<boolean> {
  const now = Date.now();

  // Return cached status if checked recently
  if (backendStatus !== "checking" && now - lastCheck < CHECK_INTERVAL) {
    return backendStatus === "available";
  }

  try {
    // Use the correct health endpoint URL
    const healthUrl = `${API_BASE_URL}/health`;

    const response = await fetch(healthUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Short timeout to avoid hanging
      signal: AbortSignal.timeout(5000),
    });
    console.log(
      "🚀 ~ health check response:",
      response.status,
      response.statusText
    );

    backendStatus = response.ok ? "available" : "unavailable";
    lastCheck = now;
    return backendStatus === "available";
  } catch (error) {
    console.error("🚀 ~ health check error:", error);
    backendStatus = "unavailable";
    lastCheck = now;
    return false;
  }
}

export function getBackendStatus() {
  return backendStatus;
}

export function isBackendAvailable(): boolean {
  return backendStatus === "available";
}

// Mock data for development when backend is unavailable
export const mockData = {
  properties: [],
  users: [],
  serviceRequests: [],
};

export function getMockData<T>(type: keyof typeof mockData): T[] {
  return mockData[type] as T[];
}
