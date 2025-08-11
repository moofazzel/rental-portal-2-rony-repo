import { ServiceRequest } from "@/app/(pages)/(root)/admin/requests/types/service-request";
import { getAllProperties, getAllTenants } from "@/app/apiClient/adminApi";
import { Notice } from "@/types/notice.types";
import { useQuery } from "@tanstack/react-query";

// Query keys for caching
export const queryKeys = {
  properties: ["admin", "properties"] as const,
  tenants: ["admin", "tenants"] as const,
  serviceRequests: ["admin", "service-requests"] as const,
  notices: ["admin", "notices"] as const,
};

// Fetch properties
export function useProperties() {
  return useQuery({
    queryKey: queryKeys.properties,
    queryFn: async () => {
      const response = await getAllProperties();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch properties");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Fetch tenants
export function useTenants() {
  return useQuery({
    queryKey: queryKeys.tenants,
    queryFn: async () => {
      const response = await getAllTenants();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch tenants");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mock service requests - replace with real API when available
export function useServiceRequests() {
  return useQuery({
    queryKey: queryKeys.serviceRequests,
    queryFn: async (): Promise<ServiceRequest[]> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - replace with real API call
      return [
        {
          id: "1",
          tenantName: "John Doe",
          category: "Electrical",
          description: "Outlet not working",
          createdAt: "2024-01-15",
          status: "Submitted",
        },
        {
          id: "2",
          tenantName: "Jane Smith",
          category: "Plumbing",
          description: "Leaky faucet",
          createdAt: "2024-01-14",
          status: "In Progress",
        },
        {
          id: "3",
          tenantName: "Bob Wilson",
          category: "HVAC",
          description: "AC not cooling",
          createdAt: "2024-01-13",
          status: "Resolved",
        },
        {
          id: "4",
          tenantName: "Alice Johnson",
          category: "Pest Control",
          description: "Ants in kitchen",
          createdAt: "2024-01-12",
          status: "Submitted",
        },
        {
          id: "5",
          tenantName: "Charlie Brown",
          category: "Electrical",
          description: "Light switch broken",
          createdAt: "2024-01-11",
          status: "In Progress",
        },
      ];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mock notices - replace with real API when available
export function useNotices() {
  return useQuery({
    queryKey: queryKeys.notices,
    queryFn: async (): Promise<Notice[]> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mock data - replace with real API call
      return [
        {
          id: "1",
          title: "Pool Maintenance",
          content: "Pool will be closed for maintenance from 2-4 PM today",
          date_published: "2024-01-15",
          priority: "medium",
          category: "Maintenance",
        },
        {
          id: "2",
          title: "Community BBQ",
          content: "Join us for community BBQ this weekend at the clubhouse",
          date_published: "2024-01-14",
          priority: "low",
          category: "Events",
        },
        {
          id: "3",
          title: "Emergency Water Shutoff",
          content: "Water will be shut off for 2 hours tomorrow for repairs",
          date_published: "2024-01-13",
          priority: "high",
          category: "Utilities",
        },
      ];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Combined dashboard data hook
export function useDashboardData() {
  const propertiesQuery = useProperties();
  const tenantsQuery = useTenants();
  const serviceRequestsQuery = useServiceRequests();
  const noticesQuery = useNotices();

  // Calculate loading state
  const isLoading =
    propertiesQuery.isLoading ||
    tenantsQuery.isLoading ||
    serviceRequestsQuery.isLoading ||
    noticesQuery.isLoading;

  // Calculate error state
  const error =
    propertiesQuery.error ||
    tenantsQuery.error ||
    serviceRequestsQuery.error ||
    noticesQuery.error;

  // Calculate dashboard stats
  const stats = {
    totalProperties: propertiesQuery.data?.length || 0,
    totalSpots:
      propertiesQuery.data?.reduce((sum, prop) => sum + prop.totalLots, 0) || 0,
    occupiedSpots:
      propertiesQuery.data?.reduce(
        (sum, prop) => sum + (prop.totalLots - (prop.availableLots || 0)),
        0
      ) || 0,
    availableSpots:
      propertiesQuery.data?.reduce(
        (sum, prop) => sum + (prop.availableLots || 0),
        0
      ) || 0,
    activeTenants: tenantsQuery.data?.filter((t) => t.isVerified).length || 0,
    pendingApprovals:
      tenantsQuery.data?.filter((t) => !t.isVerified).length || 0,
    openRequests:
      serviceRequestsQuery.data?.filter((r) => r.status !== "Resolved")
        .length || 0,
    totalRevenue:
      tenantsQuery.data?.reduce((sum, t) => sum + parseInt(t.rent || "0"), 0) ||
      0,
    occupancyRate: 0, // Will be calculated below
  };

  // Calculate occupancy rate
  if (stats.totalSpots > 0) {
    stats.occupancyRate = (stats.occupiedSpots / stats.totalSpots) * 100;
  }

  return {
    // Data
    properties: propertiesQuery.data || [],
    tenants: tenantsQuery.data || [],
    serviceRequests: serviceRequestsQuery.data || [],
    notices: noticesQuery.data || [],
    stats,

    // Loading states
    isLoading,
    isPropertiesLoading: propertiesQuery.isLoading,
    isTenantsLoading: tenantsQuery.isLoading,
    isServiceRequestsLoading: serviceRequestsQuery.isLoading,
    isNoticesLoading: noticesQuery.isLoading,

    // Error states
    error,
    propertiesError: propertiesQuery.error,
    tenantsError: tenantsQuery.error,
    serviceRequestsError: serviceRequestsQuery.error,
    noticesError: noticesQuery.error,

    // Refetch functions
    refetchAll: () => {
      propertiesQuery.refetch();
      tenantsQuery.refetch();
      serviceRequestsQuery.refetch();
      noticesQuery.refetch();
    },
    refetchProperties: propertiesQuery.refetch,
    refetchTenants: tenantsQuery.refetch,
    refetchServiceRequests: serviceRequestsQuery.refetch,
    refetchNotices: noticesQuery.refetch,
  };
}
