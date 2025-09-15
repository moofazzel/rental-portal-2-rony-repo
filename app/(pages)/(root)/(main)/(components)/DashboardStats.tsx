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
  console.log("🚀 ~ rent:", rent);
  const payments = tenantRes?.payments;
  const spot = tenantRes?.spot;

  // Determine rent status based on payment summary and lease status
  const getRentStatus = () => {
    // If no active lease, show inactive status
    if (!rent?.summary?.hasActiveLease) {
      return {
        status: "inactive",
        color: "bg-gray-100 text-gray-600",
        text: "No Active Lease",
      };
    }

    // Check for first-time payment
    if (rent?.summary?.paymentAction === "FIRST_TIME_PAYMENT") {
      return {
        status: "first_time",
        color: "bg-blue-100 text-blue-800",
        text: "First Payment Due",
      };
    }

    // Use the actual paymentStatus from the API response (casting to any to bypass TypeScript)
    const paymentStatus = (payments?.summary as any)?.paymentStatus;

    if (!paymentStatus) {
      return {
        status: "unknown",
        color: "bg-gray-100 text-gray-800",
        text: "No Payment Info",
      };
    }

    const { hasOverduePayments, hasPendingPayments, isUpToDate } =
      paymentStatus;

    if (hasOverduePayments) {
      return {
        status: "overdue",
        color: "bg-red-100 text-red-800",
        text: "Overdue",
      };
    }

    if (hasPendingPayments) {
      return {
        status: "pending",
        color: "bg-yellow-100 text-yellow-800",
        text: "Pending",
      };
    }

    if (isUpToDate) {
      return {
        status: "up_to_date",
        color: "bg-green-100 text-green-800",
        text: "Up to Date",
      };
    }

    return {
      status: "unknown",
      color: "bg-gray-100 text-gray-800",
      text: "Unknown",
    };
  };

  const rentStatus = getRentStatus();

  // Get the actual rent amount from rent object - only if lease is active
  const getRentAmount = () => {
    // If no active lease, don't show rent amount
    if (!rent?.summary?.hasActiveLease) {
      return null;
    }

    // For first-time payment, show current month amount (includes rent + deposit)
    if (
      rent?.summary?.paymentAction === "FIRST_TIME_PAYMENT" &&
      rent.summary.currentMonthAmount > 0
    ) {
      return rent.summary.currentMonthAmount;
    }

    if (rent?.currentRentAmount && rent.currentRentAmount > 0) {
      return rent.currentRentAmount;
    }

    // Use fullMonthRentAmount if currentRentAmount is 0
    if (rent?.fullMonthRentAmount && rent.fullMonthRentAmount > 0) {
      return rent.fullMonthRentAmount;
    }

    return null;
  };

  const rentAmount = getRentAmount();
  const hasActiveLease = rent?.summary?.hasActiveLease;
  const isFirstTimePayment =
    rent?.summary?.paymentAction === "FIRST_TIME_PAYMENT";

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
              className={`${rentStatus.color} text-xs font-medium`}
              style={{
                // Add a colored border to the badge for extra color pop
                border: "1.5px solid #3b82f6",
                background:
                  rentStatus.color === "bg-green-100 text-green-800"
                    ? "linear-gradient(90deg, #bbf7d0 0%, #f0fdf4 100%)"
                    : rentStatus.color === "bg-red-100 text-red-800"
                    ? "linear-gradient(90deg, #fecaca 0%, #fef2f2 100%)"
                    : rentStatus.color === "bg-yellow-100 text-yellow-800"
                    ? "linear-gradient(90deg, #fef9c3 0%, #fefce8 100%)"
                    : undefined,
                color:
                  rentStatus.color === "bg-green-100 text-green-800"
                    ? "#166534"
                    : rentStatus.color === "bg-red-100 text-red-800"
                    ? "#991b1b"
                    : rentStatus.color === "bg-yellow-100 text-yellow-800"
                    ? "#854d0e"
                    : undefined,
              }}
            >
              {rentStatus.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {hasActiveLease ? (
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-bold text-blue-900">
                {rentAmount ? formatCurrency(rentAmount) : "N/A"}
              </span>
              <span className="text-xs sm:text-sm text-blue-500">
                {isFirstTimePayment ? "first payment" : "per month"}
              </span>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-lg font-semibold text-gray-600 mb-2">
                No Active Lease
              </div>
              <p className="text-sm text-gray-500">
                Contact your property manager to set up a lease agreement
              </p>
            </div>
          )}

          {hasActiveLease && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-blue-700">Due Date:</span>
                <span className="font-medium text-blue-900">
                  {formatDate(
                    rent?.dueDates?.currentMonthDueDate ||
                      rent?.dueDates?.nextPaymentDueDate ||
                      ""
                  )}
                </span>
              </div>

              {isFirstTimePayment && rent?.summary?.currentMonthDescription && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-blue-800">
                        First Payment
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-900">
                        {formatCurrency(rent.summary.currentMonthAmount)}
                      </div>
                      <div className="text-xs text-blue-600">
                        {rent.summary.currentMonthDescription}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isFirstTimePayment && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        Security Deposit
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-900">
                        {formatCurrency(rent.depositAmount)}
                      </div>
                      <div className="text-xs text-green-600">Paid</div>
                    </div>
                  </div>
                </div>
              )}

              {rent?.isProRated === true &&
                rent?.proRatedDays > 0 &&
                rent?.proRatedRentAmount > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">
                          Pro-rated Rent
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-blue-900">
                          {formatCurrency(rent.proRatedRentAmount)}
                        </div>
                        <div className="text-xs text-blue-600">
                          {rent.proRatedDays} days
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Overdue Amount - Only show if there's an actual overdue amount */}
              {(payments?.summary?.totalOverdueAmount ?? 0) > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-red-800">
                        Overdue Amount
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-900">
                        {formatCurrency(
                          payments?.summary?.totalOverdueAmount ?? 0
                        )}
                      </div>
                      {(payments?.summary?.overdueCount ?? 0) > 0 && (
                        <div className="text-xs text-red-600">
                          {payments?.summary?.overdueCount} payment
                          {(payments?.summary?.overdueCount ?? 0) > 1
                            ? "s"
                            : ""}{" "}
                          overdue
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Amount - Only show if there's an actual pending amount */}
              {(payments?.summary?.totalPendingAmount ?? 0) > 0 && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-yellow-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-yellow-800">
                        Pending Payment
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-yellow-900">
                        {formatCurrency(
                          payments?.summary?.totalPendingAmount ?? 0
                        )}
                      </div>
                      <div className="text-xs text-yellow-600">Processing</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasActiveLease && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Next Steps
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">
                    Please wait for your property owner or manager to update
                    your lease agreement.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pay Rent Card - Only show if lease is active */}
      {hasActiveLease ? (
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
      ) : (
        <Card className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 border border-gray-300 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                  Payment Unavailable
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Complete your lease setup to enable payments
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Lease Required</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
