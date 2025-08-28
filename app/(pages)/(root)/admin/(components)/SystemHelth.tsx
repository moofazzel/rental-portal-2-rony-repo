import { getAllProperties, getAllTenants } from "@/app/apiClient/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, CheckCircle, Clock } from "lucide-react";
import { Suspense } from "react";
import SystemHealthSkeleton from "./SystemHealthSkeleton";

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

async function SystemHealthData() {
  try {
    // Fetch data in parallel
    const [propertiesResponse, tenantsResponse] = await Promise.all([
      getAllProperties(),
      getAllTenants(),
    ]);

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
      openRequests: 0, // Will be fetched by ServiceRequest component
      totalRevenue,
      occupancyRate,
    };

    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Activity className="h-6 w-6 text-green-400" />
            </div>
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">All systems operational</p>
                <p className="text-xs text-slate-400">Status: Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Last backup</p>
                <p className="text-xs text-slate-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium">System Uptime</p>
                <p className="text-xs text-slate-400">99.99% this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Next maintenance</p>
                <p className="text-xs text-slate-400">Unknown</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching system health data:", error);
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Activity className="h-6 w-6 text-red-400" />
            </div>
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-400">
            <p>Error loading system health data</p>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default function SystemHelth() {
  return (
    <Suspense fallback={<SystemHealthSkeleton />}>
      <SystemHealthData />
    </Suspense>
  );
}
