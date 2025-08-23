"use client";

import { ServiceRequest } from "@/app/(pages)/(root)/admin/requests/types/service-request";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "@/constants/RouteConstants";
import { Notice } from "@/types/notice.types";
import { IProperty } from "@/types/properties.type";
import { ITenant } from "@/types/tenant.types";
import {
  Activity,
  AlertCircle,
  Bell,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Home,
  Mail,
  Phone,
  Plus,
  Settings,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

interface AdminDashboardProps {
  initialData: DashboardData;
}

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const { stats, tenants, properties, serviceRequests, notices } = initialData;
  const { data: session } = useSession();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Clock className="w-4 h-4" />;
      case "In Progress":
        return <Activity className="w-4 h-4" />;
      case "Resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Dashboard{" "}
              <span className="text-blue-500 text-md">
                ({session?.user?.role})
              </span>
            </h1>
            <p className="text-slate-600 mt-2">
              Welcome back!{" "}
              <span className="text-blue-500 text-lg font-bold">
                {session?.user?.name}
              </span>{" "}
              Here&apos;s what&apos;s happening with your communities today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={Route.TenantsPath}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white cursor-pointer"
              >
                <Plus />
                Invite Tenant
              </Button>
            </Link>
            <Link href={Route.NoticesPath}>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 cursor-pointer  "
              >
                <Bell />
                Create Notice
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold text-blue-50">
                Total Properties
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
                {stats.totalSpots} total spots available
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
                {stats.occupiedSpots} of {stats.totalSpots} spots occupied
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
              <div className="text-3xl font-bold mb-2">
                {stats.activeTenants}
              </div>
              <p className="text-sm text-purple-100 font-medium leading-relaxed">
                {stats.pendingApprovals} pending approvals
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
                From {stats.activeTenants} active tenants
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Open Requests
              </CardTitle>
              <div className="p-2 bg-red-100 rounded-lg">
                <Wrench className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.openRequests}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Service requests pending resolution
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Available Spots
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Home className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats.availableSpots}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Ready for new tenants
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Active Notices
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {notices.length}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Community announcements
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="xl:col-span-2 space-y-8">
            {/* Recent Service Requests */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wrench className="h-5 w-5 text-blue-600" />
                    </div>
                    Recent Service Requests
                  </CardTitle>
                  <Link href="/admin/requests">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View All
                      <Eye className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {serviceRequests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-slate-900">
                              {request.tenantName}
                            </span>
                            <Badge
                              className={`${getStatusColor(
                                request.status
                              )} border`}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                {request.status}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">
                            <span className="font-medium">
                              {request.category}
                            </span>{" "}
                            - {request.description}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {request.createdAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {serviceRequests.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <Wrench className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No service requests found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Overview */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Building className="h-5 w-5 text-emerald-600" />
                    </div>
                    Property Overview
                  </CardTitle>
                  <Link href="/admin/property">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      Manage Properties
                      <Settings className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">
                            {property.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-2">
                            {property.description}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Home className="w-3 h-3" />
                            {property.address.street}, {property.address.city}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            {property.totalLots - (property.availableLots || 0)}
                            /{property.totalLots}
                          </div>
                          <div className="text-sm text-slate-600">Occupied</div>
                          <div className="text-xs text-emerald-600 font-medium">
                            {property.availableLots} available
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <Building className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No properties found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Link href="/admin/tenants">
                  <Button
                    size="lg"
                    className="w-full justify-start bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white cursor-pointer"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    Manage Tenants
                  </Button>
                </Link>
                <Link href="/admin/payments">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 mr-3" />
                    View Payments
                  </Button>
                </Link>
                <Link href="/admin/notices">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Manage Notices
                  </Button>
                </Link>
                <Link href="/admin/requests">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <Wrench className="w-4 h-4 mr-3" />
                    Service Requests
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Notices */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Bell className="h-5 w-5 text-amber-600" />
                  </div>
                  Recent Notices
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {notices.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      className="p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <span className="font-medium text-sm text-slate-900 line-clamp-1">
                          {notice.title}
                        </span>
                        <Badge
                          className={`${getPriorityColor(
                            notice.priority
                          )} border text-xs`}
                        >
                          {notice.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                        {notice.content}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {notice.date_published}
                      </p>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <div className="p-6 text-center text-slate-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">No notices found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {tenants
                    .filter((t) => !t.isVerified)
                    .slice(0, 3)
                    .map((tenant) => (
                      <div
                        key={tenant._id}
                        className="p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <span className="font-medium text-sm text-slate-900">
                            {tenant.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            Pending
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {tenant.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {tenant.phoneNumber}
                          </div>
                          {tenant.lotNumber && (
                            <div className="flex items-center gap-2">
                              <Home className="w-3 h-3" />
                              Lot: {tenant.lotNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {tenants.filter((t) => !t.isVerified).length === 0 && (
                    <div className="p-6 text-center text-slate-500">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">No pending approvals</p>
                    </div>
                  )}
                </div>
                {tenants.filter((t) => !t.isVerified).length > 3 && (
                  <div className="p-4 border-t border-slate-100">
                    <Link href="/admin/tenants">
                      <Button variant="outline" className="w-full text-sm">
                        View All Pending
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Health */}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Open requests</p>
                  <p className="text-xs text-slate-400">
                    {stats.openRequests} pending
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Next maintenance</p>
                  <p className="text-xs text-slate-400">Tomorrow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
