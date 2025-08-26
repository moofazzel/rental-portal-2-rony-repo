"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ITenantApiResponse } from "@/types/tenant.types";
import Link from "next/link";

interface TenantProps {
  tenantRes: ITenantApiResponse | null;
}

export default function DashboardStats({ tenantRes }: TenantProps) {
  const rent = tenantRes?.rent;
  const payments = tenantRes?.payments;
  const recentPayment = payments?.recent?.[0];

  const getRentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "current_month_overdue":
        return "bg-red-100 text-red-800";
      case "payment_limit_reached":
        return "bg-yellow-100 text-yellow-800";
      case "first_time_payment":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      case "first_time_payment":
        return "First Payment";
      default:
        return "Unknown";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Rent Status Card */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Rent Status
            </CardTitle>
            <Badge
              className={`${getRentStatusColor(
                rent?.summary?.paymentAction || recentPayment?.status || ""
              )} text-xs font-medium`}
            >
              {getRentStatusText(
                rent?.summary?.paymentAction || recentPayment?.status || ""
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {rent?.currentRentAmount &&
                formatCurrency(rent?.currentRentAmount)}
            </span>
            <span className="text-sm text-gray-500">per month</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium text-gray-900">
                {formatDate(rent?.dueDates?.currentMonthDueDate || "")}
              </span>
            </div>

            {rent?.summary?.currentMonthAmount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Due:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(rent.summary.currentMonthAmount)}
                </span>
              </div>
            )}

            {rent?.summary?.totalOverdueAmount &&
              rent.summary.totalOverdueAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Overdue:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(rent.summary.totalOverdueAmount)}
                  </span>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Pay Rent Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Ready to Pay?
              </h3>
              <p className="text-blue-100 text-sm">
                Quick and secure payment processing
              </p>
            </div>

            <Link href="/pay-rent" className="block">
              <Button
                size="lg"
                className="w-full bg-white text-blue-600 hover:bg-gray-50 font-semibold text-lg py-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                Pay Rent Now
              </Button>
            </Link>

            <div className="flex items-center justify-center space-x-4 text-blue-100 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Secure
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Instant
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
