// /services/page.tsx

import { getAllTenantServiceRequests } from "@/app/apiClient/tenantApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse } from "@/types/api.types";
import { IServiceRequest } from "@/types/tenantServiceRequest.types";
import {
  AlertTriangle,
  ArrowRight,
  Bug,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Droplets,
  FileText,
  Hammer,
  Home,
  Loader2,
  Plus,
  Settings,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import HelpSection from "../(components)/HelpSection";
import TenantPageHeader from "../(components)/TenantPageHeader";
import ServiceRequestModal from "./(components)/ServiceRequestModal";

export default async function ServicesRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  const result =
    (await getAllTenantServiceRequests()) as ApiResponse<IServiceRequest>;
  const serviceRequests = (result?.data?.serviceRequests ||
    []) as IServiceRequest[];

  const activeTab = tab === "form" ? "form" : "history";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "MAINTENANCE":
        return <Wrench className="w-5 h-5" />;
      case "ELECTRICAL":
        return <Zap className="w-5 h-5" />;
      case "PLUMBING":
        return <Droplets className="w-5 h-5" />;
      case "PEST_CONTROL":
        return <Bug className="w-5 h-5" />;
      case "HVAC":
        return <Settings className="w-5 h-5" />;
      default:
        return <Hammer className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case "MAINTENANCE":
        return "from-blue-500 to-blue-600";
      case "ELECTRICAL":
        return "from-yellow-500 to-orange-600";
      case "PLUMBING":
        return "from-cyan-500 to-blue-600";
      case "PEST_CONTROL":
        return "from-green-500 to-emerald-600";
      case "HVAC":
        return "from-purple-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <TenantPageHeader />

      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 text-white p-8 lg:p-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Wrench className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold">
                      Service Requests
                    </h1>
                    <p className="text-indigo-100 text-lg">
                      Manage and track your maintenance requests
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <FileText className="w-3 h-3 mr-1" />
                    {serviceRequests.length} Total Requests
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {
                      serviceRequests.filter((r) => r.status === "PENDING")
                        .length
                    }{" "}
                    Pending
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {
                      serviceRequests.filter((r) => r.status === "COMPLETED")
                        .length
                    }{" "}
                    Completed
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <ServiceRequestModal />
                <Link href="?tab=history">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-blue-100" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Total
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">
                {serviceRequests.length}
              </div>
              <p className="text-blue-100 text-sm">Service Requests</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-yellow-100" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Pending
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">
                {serviceRequests.filter((r) => r.status === "PENDING").length}
              </div>
              <p className="text-yellow-100 text-sm">Awaiting Response</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Loader2 className="w-8 h-8 text-purple-100" />
                <Badge className="bg-white/20 text-white border-white/30">
                  In Progress
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">
                {
                  serviceRequests.filter((r) => r.status === "IN_PROGRESS")
                    .length
                }
              </div>
              <p className="text-purple-100 text-sm">Being Worked On</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-100" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Completed
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">
                {serviceRequests.filter((r) => r.status === "COMPLETED").length}
              </div>
              <p className="text-green-100 text-sm">Successfully Resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Recent Requests */}
          <Card className="shadow-lg border-0">
            <CardHeader className="!pb-3 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Recent Service Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {serviceRequests.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Service Requests Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't submitted any service requests yet.
                  </p>
                  <ServiceRequestModal
                    trigger={
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Your First Request
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceRequests.slice(0, 5).map((request) => (
                    <Card
                      key={request._id}
                      className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <div
                        className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getTypeColor(
                          request.type
                        )}`}
                      />
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(
                              request.type
                            )} rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}
                          >
                            {getTypeIcon(request.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                  {request.title}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                  {request.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge
                                  className={getStatusColor(request.status)}
                                >
                                  {request.status}
                                </Badge>
                                <Badge
                                  className={getPriorityColor(request.priority)}
                                >
                                  {request.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Home className="w-4 h-4" />
                                  {request.propertyId?.name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(request.requestedDate)}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                View Details
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {serviceRequests.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="?tab=history">
                        <Button variant="outline" className="border-gray-300">
                          View All {serviceRequests.length} Requests
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <HelpSection
          icon={<AlertTriangle className="w-4 h-4 text-gray-600" />}
          title="Need Immediate Assistance?"
          description="For urgent issues or emergency situations, contact the office directly"
          phone="(555) 555-0000"
          hours="Office Hours: 9 AM - 5 PM (Emergency: 24/7)"
          className="shadow-lg border-0 bg-white/90 backdrop-blur-sm"
        />
      </div>
    </div>
  );
}
