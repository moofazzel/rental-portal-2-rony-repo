import AdminDashboard from "@/app/(pages)/(root)/admin/(components)/AdminDashboard";
import AdminDashboardSkeleton from "@/app/(pages)/(root)/admin/(components)/AdminDashboardSkeleton";
import { ServiceRequest } from "@/app/(pages)/(root)/admin/requests/types/service-request";
import { getAllProperties, getAllTenants } from "@/app/apiClient/adminApi";
import { Notice } from "@/types/notice.types";
import { IProperty } from "@/types/properties.type";
import { ITenant } from "@/types/tenant.types";
import { Suspense } from "react";

// Force dynamic rendering since this page makes API calls
export const dynamic = "force-dynamic";

interface DashboardStats {
  totalProperties: number;
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  activeTenants: number;
  pendingApprovals: number;
  openRequests: number;
  totalRevenue: number;
  occupancyRate: number;
}

interface DashboardData {
  properties: IProperty[];
  tenants: ITenant[];
  serviceRequests: ServiceRequest[];
  notices: Notice[];
  stats: DashboardStats;
}

// Server-side data fetching
async function getDashboardData(): Promise<DashboardData> {
  try {
    // Fetch data in parallel
    const [propertiesResponse, tenantsResponse] = await Promise.all([
      getAllProperties(),
      getAllTenants(),
    ]);

    // Mock data for service requests and notices (replace with real APIs)
    const serviceRequests: ServiceRequest[] = [
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

    const notices: Notice[] = [
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

    const properties =
      propertiesResponse.success && propertiesResponse.data
        ? propertiesResponse.data
        : [];
    const tenants =
      tenantsResponse.success && tenantsResponse.data
        ? tenantsResponse.data
        : [];

    // Calculate dashboard stats
    const totalProperties = properties.length;
    const totalSpots = properties.reduce(
      (sum, prop) => sum + prop.totalLots,
      0
    );
    const availableSpots = properties.reduce(
      (sum, prop) => sum + (prop.availableLots || 0),
      0
    );
    const occupiedSpots = totalSpots - availableSpots;
    const activeTenants = tenants.filter((t) => t.isVerified).length;
    const pendingApprovals = tenants.filter((t) => !t.isVerified).length;
    const openRequests = serviceRequests.filter(
      (r) => r.status !== "Resolved"
    ).length;
    const totalRevenue = tenants.reduce(
      (sum, t) => sum + parseInt(t.rent || "0"),
      0
    );
    const occupancyRate =
      totalSpots > 0 ? (occupiedSpots / totalSpots) * 100 : 0;

    const stats: DashboardStats = {
      totalProperties,
      totalSpots,
      occupiedSpots,
      availableSpots,
      activeTenants,
      pendingApprovals,
      openRequests,
      totalRevenue,
      occupancyRate,
    };

    return {
      properties,
      tenants,
      serviceRequests,
      notices,
      stats,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return empty data instead of throwing error
    return {
      properties: [],
      tenants: [],
      serviceRequests: [],
      notices: [],
      stats: {
        totalProperties: 0,
        totalSpots: 0,
        occupiedSpots: 0,
        availableSpots: 0,
        activeTenants: 0,
        pendingApprovals: 0,
        openRequests: 0,
        totalRevenue: 0,
        occupancyRate: 0,
      },
    };
  }
}

export default async function AdminPage() {
  const dashboardData = await getDashboardData();

  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboard initialData={dashboardData} />
    </Suspense>
  );
}
