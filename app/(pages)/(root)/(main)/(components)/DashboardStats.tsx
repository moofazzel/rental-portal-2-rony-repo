"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ITenantApiResponse } from "@/types/tenant.types";

interface TenantProps {
  tenantRes: ITenantApiResponse | null;
}

export default function DashboardStats({ tenantRes }: TenantProps) {
  const payment = tenantRes?.payments;

  const getRentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-400 text-green-900";
      case "unpaid":
        return "bg-yellow-400 text-yellow-900";
      case "overdue":
        return "bg-red-400 text-red-900";
      default:
        return "bg-gray-400 text-gray-900";
    }
  };

  const getRentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "unpaid":
        return "Unpaid";
      case "overdue":
        return "Overdue";
      case "pending":
      default:
        return "Unknown";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-100">
            Rent Status
          </CardTitle>
          <Badge
            variant="secondary"
            className={getRentStatusColor(payment?.rentStatus || "")}
          >
            {getRentStatusText(payment?.rentStatus || "")}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${payment?.rentAmount || 0}</div>
          <p className="text-xs text-green-200 mt-1">
            Due on {payment?.rentDueDate || "N/A"}
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">
            Service Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {tenantRes?.serviceRequests?.count}
          </div>
          <p className="text-xs text-blue-200 mt-1">1 open, 1 resolved</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">
            Lot Number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            <p>
              {tenantRes?.spot &&
              typeof tenantRes.spot === "object" &&
              "spotNumber" in tenantRes.spot ? (
                tenantRes.spot.spotNumber
              ) : (
                <span className="text-white text-3xl ">No spot assigned</span>
              )}
            </p>
          </div>
          <p className="text-xs text-purple-200 mt-1">
            {" "}
            <p>
              {tenantRes?.property &&
              typeof tenantRes.property === "object" &&
              "name" in tenantRes.property
                ? tenantRes.property.name
                : "No property assigned"}
            </p>
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-100">
            Lease Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{"Active"}</div>
          <p className="text-xs text-amber-200 mt-1">Since {"March, 2024"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
