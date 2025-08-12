"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ITenantApiResponse } from "@/types/tenant.types";

interface TenantProps {
  tenantRes: ITenantApiResponse | null;
}

export default function DashboardStats({ tenantRes }: TenantProps) {
  const rent = tenantRes?.rent;
  const payments = tenantRes?.payments;
  const lease = tenantRes?.lease;
  const recentPayment = payments?.recent?.[0]; // Get most recent payment

  const getRentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-400 text-green-900";
      case "unpaid":
        return "bg-yellow-400 text-yellow-900";
      case "overdue":
        return "bg-red-400 text-red-900";
      case "pending":
        return "bg-blue-400 text-blue-900";
      case "current_month_overdue":
        return "bg-red-400 text-red-900";
      case "payment_limit_reached":
        return "bg-yellow-400 text-yellow-900";
      default:
        return "bg-gray-400 text-gray-900";
    }
  };

  const getRentStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "Paid";
      case "unpaid":
        return "Unpaid";
      case "overdue":
        return "Overdue";
      case "pending":
        return "Pending";
      case "current_month_overdue":
        return "Overdue";
      case "payment_limit_reached":
        return "Paid One Month Ahead";
      default:
        return "Unknown";
    }
  };

  const getLeaseStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-400 text-green-900";
      case "expired":
        return "bg-red-400 text-red-900";
      case "pending":
        return "bg-yellow-400 text-yellow-900";
      default:
        return "bg-gray-400 text-gray-900";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A" || dateString === "Invalid Date")
      return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
            className={getRentStatusColor(
              rent?.summary?.paymentAction || recentPayment?.status || ""
            )}
          >
            {getRentStatusText(
              rent?.summary?.paymentAction || recentPayment?.status || ""
            )}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {rent?.currentRentAmount && formatCurrency(rent?.currentRentAmount)}
          </div>
          <p className="text-xs text-green-200 mt-1">
            {rent?.summary?.hasOverduePayments
              ? `${rent.summary.overdueCount} overdue payments`
              : `Due on ${formatDate(
                  rent?.dueDates?.currentMonthDueDate || ""
                )}`}
          </p>
          {rent?.summary?.totalOverdueAmount &&
            rent.summary.totalOverdueAmount > 0 && (
              <p className="text-xs text-red-200 mt-1">
                Overdue: {formatCurrency(rent.summary.totalOverdueAmount)}
              </p>
            )}
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
            {tenantRes?.serviceRequests?.count || 0}
          </div>
          <p className="text-xs text-blue-200 mt-1">
            {tenantRes?.serviceRequests?.recent?.length || 0} recent requests
          </p>
          {tenantRes?.serviceRequests?.recent?.[0] && (
            <p className="text-xs text-blue-200">
              Latest: {tenantRes.serviceRequests.recent[0].title}
            </p>
          )}
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
            {tenantRes?.spot?.spotNumber || "No spot assigned"}
          </div>
          <p className="text-xs text-purple-200 mt-1">
            {tenantRes?.spot?.spotIdentifier || ""}
          </p>
          <p className="text-xs text-purple-200">
            {tenantRes?.property?.name || "No property assigned"}
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
          <div className="text-3xl font-bold">
            <Badge
              variant="secondary"
              className={getLeaseStatusColor(lease?.leaseStatus || "")}
            >
              {lease?.leaseStatus || "Unknown"}
            </Badge>
          </div>
          <p className="text-xs text-amber-200 mt-1">
            Since {formatDate(lease?.leaseStart || "")}
          </p>

          {lease?.rvInfo && (
            <p className="text-xs text-amber-200">
              {lease.rvInfo.year} {lease.rvInfo.make} {lease.rvInfo.model}
            </p>
          )}
          {tenantRes?.announcements?.unreadCount &&
            tenantRes.announcements.unreadCount > 0 && (
              <p className="text-xs text-amber-200">
                {tenantRes.announcements.unreadCount} unread announcements
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
