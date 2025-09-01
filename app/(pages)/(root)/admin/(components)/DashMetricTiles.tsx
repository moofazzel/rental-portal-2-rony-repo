import { getAllProperties, getAllTenants } from "@/app/apiClient/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, DollarSign, TrendingUp, Users } from "lucide-react";
import { Suspense } from "react";
import DashMetricTilesSkeleton from "./DashMetricTilesSkeleton";

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

async function DashMetricTilesData() {
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
      (sum, prop) => sum + (prop.totalSpots || 0),
      0
    );
    const availableSpots = properties.reduce(
      (sum, prop) => sum + (prop.availableSpots || 0),
      0
    );
    const occupiedSpots = totalSpots - availableSpots;
    const activeTenants = tenants.filter((t) => t.isVerified).length;
    const pendingApprovals = tenants.filter((t) => !t.isVerified).length;
    const totalRevenue = properties.reduce(
      (sum, prop) => sum + (prop.totalCurrentActiveIncome || 0),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-blue-50">
              Number of Properties
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Building className="h-5 w-5 text-blue-100" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold mb-2">
              {stats.totalProperties}
            </div>
            <p className="text-sm text-blue-100 font-medium leading-relaxed">
              {stats.totalSpots} total units
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-emerald-50">
              Occupancy Rate
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 text-emerald-100" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold mb-2">
              {stats.occupancyRate.toFixed(1)}%
            </div>
            <p className="text-sm text-emerald-100 font-medium leading-relaxed">
              {stats.availableSpots} available units
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-purple-50">
              Active Tenants
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="h-5 w-5 text-purple-100" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold mb-2">{stats.activeTenants}</div>
            <p className="text-sm text-purple-100 font-medium leading-relaxed">
              {stats.pendingApprovals} pending applicants
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-amber-50">
              Monthly Revenue
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="h-5 w-5 text-amber-100" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold mb-2">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-amber-100 font-medium leading-relaxed">
              $
              {properties
                .reduce((sum, prop) => sum + (prop.totalMaxIncome || 0), 0)
                .toLocaleString()}{" "}
              max revenue
            </p>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error fetching metric tiles data:", error);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="text-base font-semibold text-gray-500">
                Error loading data
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-3xl font-bold mb-2">--</div>
              <p className="text-sm text-gray-500">Unable to load data</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

export default function DashMetricTiles() {
  return (
    <Suspense fallback={<DashMetricTilesSkeleton />}>
      <DashMetricTilesData />
    </Suspense>
  );
}
