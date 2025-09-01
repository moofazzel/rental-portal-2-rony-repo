import { getAllServiceRequests } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IServiceRequest } from "@/types/serviceRequest.types";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Link,
  Wrench,
} from "lucide-react";
import { Suspense } from "react";
import ServiceRequestSkeleton from "./ServiceRequestSkeleton";

interface ServiceRequestsResponse {
  serviceRequests: IServiceRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function ServiceRequestData() {
  try {
    const serviceRes = (await getAllServiceRequests()) as {
      success: boolean;
      data: ServiceRequestsResponse | null;
    };
    const serviceRequests =
      serviceRes.success && serviceRes.data?.serviceRequests
        ? serviceRes.data.serviceRequests
        : [];

    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
              Service Requests
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
            {serviceRequests.slice(0, 3).map((request: IServiceRequest) => (
              <div
                key={request._id}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {request.title}
                        </span>
                        <Badge
                          className={`${getPriorityColor(
                            request.priority
                          )} border text-xs`}
                        >
                          {request.priority}
                        </Badge>
                      </div>
                      <Badge
                        className={`${getStatusColor(request.status)} border`}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </div>
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-900">
                          {request.type}
                        </span>{" "}
                        - {request.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>
                            {typeof request.propertyId === "object" &&
                            request.propertyId
                              ? request.propertyId.name
                              : "Unknown Property"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>
                            {typeof request.spotId === "object" &&
                            request.spotId
                              ? request.spotId.spotNumber
                              : "Unknown Spot"}
                          </span>
                        </div>
                        {typeof request.tenantId === "object" &&
                          request.tenantId && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              <span>{request.tenantId.name}</span>
                            </div>
                          )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Requested:{" "}
                      {new Date(request.requestedDate).toLocaleDateString()}
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
    );
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
              Service Requests
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8 text-center text-slate-500">
          <Wrench className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>Error loading service requests</p>
        </CardContent>
      </Card>
    );
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="w-4 h-4" />;
    case "IN_PROGRESS":
      return <Activity className="w-4 h-4" />;
    case "COMPLETED":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-50 text-red-700 border-red-200";
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "LOW":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function ServiceRequest() {
  return (
    <Suspense fallback={<ServiceRequestSkeleton />}>
      <ServiceRequestData />
    </Suspense>
  );
}
