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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Rent Status Card */}
      <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-200 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-blue-900">
              Rent Status
            </CardTitle>
            <Badge
              className={`${getRentStatusColor(
                rent?.summary?.paymentAction || recentPayment?.status || ""
              )} text-xs font-medium`}
              style={{
                // Add a colored border to the badge for extra color pop
                border: "1.5px solid #3b82f6",
                background:
                  getRentStatusColor(
                    rent?.summary?.paymentAction || recentPayment?.status || ""
                  ) === "bg-green-100 text-green-800"
                    ? "linear-gradient(90deg, #bbf7d0 0%, #f0fdf4 100%)"
                    : getRentStatusColor(
                        rent?.summary?.paymentAction ||
                          recentPayment?.status ||
                          ""
                      ) === "bg-red-100 text-red-800"
                    ? "linear-gradient(90deg, #fecaca 0%, #fef2f2 100%)"
                    : getRentStatusColor(
                        rent?.summary?.paymentAction ||
                          recentPayment?.status ||
                          ""
                      ) === "bg-yellow-100 text-yellow-800"
                    ? "linear-gradient(90deg, #fef9c3 0%, #fefce8 100%)"
                    : undefined,
                color:
                  getRentStatusColor(
                    rent?.summary?.paymentAction || recentPayment?.status || ""
                  ) === "bg-green-100 text-green-800"
                    ? "#166534"
                    : getRentStatusColor(
                        rent?.summary?.paymentAction ||
                          recentPayment?.status ||
                          ""
                      ) === "bg-red-100 text-red-800"
                    ? "#991b1b"
                    : getRentStatusColor(
                        rent?.summary?.paymentAction ||
                          recentPayment?.status ||
                          ""
                      ) === "bg-yellow-100 text-yellow-800"
                    ? "#854d0e"
                    : undefined,
              }}
            >
              {getRentStatusText(
                rent?.summary?.paymentAction || recentPayment?.status || ""
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-blue-900">
              {rent?.currentRentAmount &&
                formatCurrency(rent?.currentRentAmount)}
            </span>
            <span className="text-xs sm:text-sm text-blue-500">per month</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-blue-700">Due Date:</span>
              <span className="font-medium text-blue-900">
                {formatDate(rent?.dueDates?.currentMonthDueDate || "")}
              </span>
            </div>

            {rent?.summary?.currentMonthAmount && (
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-blue-700">Total Due:</span>
                <span className="font-semibold text-blue-900">
                  {formatCurrency(rent.summary.currentMonthAmount)}
                </span>
              </div>
            )}

            {rent?.summary?.totalOverdueAmount &&
              rent.summary.totalOverdueAmount > 0 && (
                <div className="flex justify-between text-xs sm:text-sm">
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
      <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white drop-shadow">
                Ready to Pay?
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm">
                Quick and secure payment processing
              </p>
            </div>

            <Link href="/pay-rent" className="block">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-100 via-white to-indigo-100 text-blue-700 hover:bg-blue-50 font-semibold text-base sm:text-lg py-4 sm:py-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-2 border-blue-200"
              >
                Pay Rent Now
              </Button>
            </Link>

            <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-blue-100 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 sm:mr-2 border border-green-700"></div>
                <span className="text-green-100">Secure</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-300 rounded-full mr-1 sm:mr-2 border border-yellow-600"></div>
                <span className="text-yellow-100">Instant</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
