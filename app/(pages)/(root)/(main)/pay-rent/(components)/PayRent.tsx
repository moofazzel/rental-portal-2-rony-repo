"use client";

import { createPaymentLink } from "@/app/apiClient/tenantApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPaymentSummary } from "@/types/payment.types";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  ExternalLink,
  Info,
  Shield,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function PayRent({
  rentData,
}: {
  rentData?: IPaymentSummary | null;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  // Handle case where rentData is null or undefined
  if (!rentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Unable to Load Payment Information
                </h1>
                <p className="text-gray-600">
                  There was an error loading your payment information. Please
                  try refreshing the page or contact support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Use real data from API with proper null checks
  const rentInfo = {
    currentMonth: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    propertyName: rentData?.propertyName || "Unknown Property",
    propertyAddress: (() => {
      // Handle both string and object address formats
      if (typeof rentData?.propertyAddress === "string") {
        return rentData.propertyAddress;
      }
      if (
        rentData?.propertyAddress &&
        typeof rentData.propertyAddress === "object"
      ) {
        const addr = rentData.propertyAddress as {
          street?: string;
          city?: string;
          state?: string;
          zip?: string;
          country?: string;
        };
        return [addr.street, addr.city, addr.state, addr.zip, addr.country]
          .filter(Boolean)
          .join(", ");
      }
      return "";
    })(),
    spotNumber: rentData?.spotNumber || "N/A",
    rentAmount: Number(rentData?.fullMonthRentAmount) || 0,
    depositAmount: Number(rentData?.depositAmount) || 0,
    totalDue: Number(rentData?.totalDue) || 0,
    isFirstTimePayment: rentData?.isFirstTimePayment || false,
    paymentAction: rentData?.paymentAction || "REGULAR_PAYMENT",
    leaseStart: rentData?.leaseStart,
    leaseEnd: rentData?.leaseEnd,
    isLeaseExpiringSoon: rentData?.isLeaseExpiringSoon || false,
    currentMonthAmount: Number(rentData?.currentMonthAmount) || 0,
    currentMonthDescription: rentData?.currentMonthDescription || "",
    isProRated: rentData?.isProRated || false,
    proRatedDays: Number(rentData?.proRatedDays) || 0,
    proRatedRentAmount: Number(rentData?.proRatedRentAmount) || 0,
    warningMessage: rentData?.warningMessage,
    canPayNextMonth: rentData?.canPayNextMonth || false,
    hasOverduePayments: rentData?.hasOverduePayments || false,
    overdueCount: Number(rentData?.overdueCount) || 0,
    totalOverdueAmount: Number(rentData?.totalOverdueAmount) || 0,
    currentMonthDueDate: rentData?.currentMonthDueDate,
    nextMonthDueDate: rentData?.nextMonthDueDate,
    overduePaymentsDetails: rentData?.overduePaymentsDetails || [],
    canPayCurrentAndOverdue: rentData?.canPayCurrentAndOverdue || false,
    paymentOptions: rentData?.paymentOptions || [],
  };

  const handlePaymentClick = async () => {
    if (!rentData) {
      console.error("No rent data available");
      return;
    }

    setIsLoading(true);
    try {
      const paymentData = {
        tenantId: session?.user?._id || "",
        currentDate: new Date().toISOString(),
      };

      const response = await createPaymentLink(paymentData);

      if (response.data?.paymentLink?.url) {
        // Redirect to payment page in same window
        toast.success("Redirecting to payment page...");
        window.location.href = response.data.paymentLink.url;
      } else {
        console.error("No payment link URL received");
        toast.error("Failed to create payment link. Please try again.");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error("Failed to create payment link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has an active lease
  if (!rentData?.hasActiveLease) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  No Active Lease
                </h1>
                <p className="text-gray-600">
                  You don&apos;t have an active lease. Please contact the office
                  for assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Handle different payment actions
  const renderPaymentAction = () => {
    switch (rentInfo.paymentAction) {
      case "FIRST_TIME_PAYMENT":
        return (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">
                    First Time Payment
                  </h3>
                  <p className="text-sm text-amber-700">
                    This is your first payment. Your deposit will be included in
                    this payment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "PAYMENT_LIMIT_REACHED":
        return (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Payment Limit Reached
                  </h3>
                  <p className="text-sm text-red-700">
                    {rentInfo.warningMessage ||
                      "You cannot pay more than one month ahead."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "CAN_PAY_NEXT_MONTH":
        return (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    Next Month Payment Available
                  </h3>
                  <p className="text-sm text-green-700">
                    You can pay for next month&apos;s rent. Current month is
                    already covered.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "CURRENT_MONTH_OVERDUE":
        return (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Current Month + Overdue Payments
                  </h3>
                  <p className="text-sm text-red-700">
                    You have overdue payments from previous months. You can pay
                    current month, overdue amounts, or both combined.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderPaymentButton = () => {
    if (rentInfo.paymentAction === "PAYMENT_LIMIT_REACHED") {
      return (
        <Button
          disabled
          className="w-full bg-gray-400 cursor-not-allowed text-white h-12 text-lg"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Not Available
        </Button>
      );
    }

    // Handle CURRENT_MONTH_OVERDUE scenario
    if (rentInfo.paymentAction === "CURRENT_MONTH_OVERDUE") {
      if (
        rentInfo.canPayCurrentAndOverdue &&
        rentInfo.paymentOptions.length > 0
      ) {
        // Find the combined payment option
        const combinedOption = rentInfo.paymentOptions.find(
          (opt) => opt.type === "COMBINED"
        );
        if (combinedOption) {
          return (
            <Button
              onClick={handlePaymentClick}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg text-white h-12 text-lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {isLoading
                ? "Creating Payment Link..."
                : `Pay Current + Overdue ($${(
                    Number(combinedOption.amount) || 0
                  ).toFixed(2)})`}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          );
        }
      }

      // If no combined option, show current month payment
      if (rentInfo.currentMonthAmount > 0) {
        return (
          <Button
            onClick={handlePaymentClick}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg text-white h-12 text-lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {isLoading
              ? "Creating Payment Link..."
              : `Pay Current Month ($${rentInfo.currentMonthAmount.toFixed(
                  2
                )})`}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        );
      }
    }

    // If there are specific payment options, show a summary button
    if (rentInfo.paymentOptions && rentInfo.paymentOptions.length > 0) {
      const totalOptionsAmount = rentInfo.paymentOptions.reduce(
        (sum, option) => sum + (Number(option.amount) || 0),
        0
      );
      return (
        <Button
          onClick={handlePaymentClick}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg text-white h-12 text-lg"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {isLoading
            ? "Creating Payment Link..."
            : `Pay Available Options ($${totalOptionsAmount.toFixed(2)})`}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      );
    }

    // Handle CAN_PAY_NEXT_MONTH scenario
    if (
      rentInfo.paymentAction === "CAN_PAY_NEXT_MONTH" &&
      rentInfo.canPayNextMonth
    ) {
      return (
        <Button
          onClick={handlePaymentClick}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg text-white h-12 text-lg"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {isLoading
            ? "Creating Payment Link..."
            : `Pay Next Month's Rent ($${rentInfo.rentAmount.toFixed(2)})`}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      );
    }

    // Only disable if no payment is due and not in CAN_PAY_NEXT_MONTH scenario
    if (
      rentInfo.totalDue === 0 &&
      rentInfo.paymentAction !== "CAN_PAY_NEXT_MONTH"
    ) {
      return (
        <Button
          disabled
          className="w-full bg-green-400 cursor-not-allowed text-white h-12 text-lg"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          No Payment Due
        </Button>
      );
    }

    return (
      <Button
        onClick={handlePaymentClick}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg text-white h-12 text-lg"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        {isLoading
          ? "Creating Payment Link..."
          : `Pay $${rentInfo.totalDue.toFixed(2)} with Stripe`}
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Pay Rent
            </h1>
            <p className="text-slate-600 mt-2">
              Secure payment for your rental at {rentInfo.propertyName}
            </p>
          </div>

          {/* Payment Action Banner */}
          {renderPaymentAction()}

          {/* Rent Summary Card */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {rentInfo.isFirstTimePayment
                  ? "First Payment Summary"
                  : "Rent Summary"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="font-medium">{rentInfo.propertyName}</p>
                  {rentInfo.propertyAddress && (
                    <p className="text-xs text-gray-500 mt-1">
                      {rentInfo.propertyAddress}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Spot Number</p>
                  <Badge variant="secondary">{rentInfo.spotNumber}</Badge>
                </div>
              </div>

              {/* Lease Info - Only show for first time payment */}
              {rentInfo.isFirstTimePayment && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lease Start</span>
                    <span className="font-medium text-blue-900">
                      {rentInfo.leaseStart
                        ? new Date(rentInfo.leaseStart).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">Lease End</span>
                    <span className="font-medium text-blue-900">
                      {rentInfo.leaseEnd
                        ? new Date(rentInfo.leaseEnd).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Not set"}
                    </span>
                  </div>
                  {rentInfo.isLeaseExpiringSoon && (
                    <div className="mt-2 p-2 bg-amber-100 rounded text-amber-800 text-xs">
                      ⚠️ Lease expires soon
                    </div>
                  )}
                </div>
              )}

              {/* Due Dates Info */}
              {rentInfo.currentMonthDueDate && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">
                    Current Month Due Date
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Due Date</span>
                      <span className="font-medium text-green-900">
                        {(() => {
                          try {
                            const date = new Date(rentInfo.currentMonthDueDate);
                            if (isNaN(date.getTime())) {
                              return "Invalid date";
                            }
                            return date.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            });
                          } catch {
                            return "Invalid date";
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Month Due Date Info - Only show if current month is not available */}
              {!rentInfo.currentMonthDueDate && rentInfo.nextMonthDueDate && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    Next Month Due Date
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Due Date</span>
                      <span className="font-medium text-blue-900">
                        {(() => {
                          try {
                            const date = new Date(rentInfo.nextMonthDueDate);
                            if (isNaN(date.getTime())) {
                              return "Invalid date";
                            }
                            return date.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            });
                          } catch {
                            return "Invalid date";
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Breakdown */}
              <div className="space-y-3">
                {/* Current Month Status */}
                {rentInfo.currentMonthAmount > 0 && (
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-amber-800 font-medium">
                      Current Month Amount
                    </span>
                    <span className="font-bold text-amber-900">
                      ${rentInfo.currentMonthAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-medium">
                    ${rentInfo.rentAmount.toFixed(2)}
                  </span>
                </div>

                {/* Show pro-rated amount if applicable */}
                {rentInfo.isProRated && rentInfo.proRatedRentAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Pro-rated Rent ({rentInfo.proRatedDays} days)
                    </span>
                    <span className="font-medium text-blue-600">
                      ${rentInfo.proRatedRentAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Show deposit if it exists and it's the first payment */}
                {rentInfo.isFirstTimePayment && rentInfo.depositAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Security Deposit
                      {rentInfo.isFirstTimePayment && (
                        <span className="text-xs text-amber-600 ml-1">
                          (First Payment)
                        </span>
                      )}
                    </span>
                    <span className="font-medium text-amber-600">
                      ${rentInfo.depositAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Show overdue amount if any */}
                {rentInfo.totalOverdueAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-red-600">Overdue Amount</span>
                    <span className="font-medium text-red-600">
                      ${rentInfo.totalOverdueAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Show overdue payment details if any */}
                {rentInfo.overduePaymentsDetails &&
                  rentInfo.overduePaymentsDetails.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-3">
                        Overdue Payments
                      </h4>
                      <div className="space-y-3">
                        {rentInfo.overduePaymentsDetails.map(
                          (overdue, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-red-900">
                                  {overdue.description ||
                                    `Overdue Payment (${
                                      overdue.month || "Unknown Month"
                                    })`}
                                </p>
                                <p className="text-sm text-red-700">
                                  Due:{" "}
                                  {(() => {
                                    try {
                                      const date = new Date(overdue.dueDate);
                                      if (isNaN(date.getTime())) {
                                        return "Invalid date";
                                      }
                                      return date.toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      });
                                    } catch {
                                      return "Invalid date";
                                    }
                                  })()}{" "}
                                  ({overdue.daysOverdue} days overdue)
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-red-900">
                                  ${(Number(overdue.amount) || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Show payment options if available */}
                {rentInfo.paymentOptions &&
                  rentInfo.paymentOptions.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">
                        Payment Options
                      </h4>
                      <div className="space-y-3">
                        {rentInfo.paymentOptions.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-blue-900">
                                {option.description}
                              </p>
                              <p className="text-sm text-blue-700">
                                Due:{" "}
                                {(() => {
                                  try {
                                    const date = new Date(option.dueDate);
                                    if (isNaN(date.getTime())) {
                                      return "Invalid date";
                                    }
                                    return date.toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    });
                                  } catch {
                                    return "Invalid date";
                                  }
                                })()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-900">
                                ${(Number(option?.amount) || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {rentInfo.isFirstTimePayment && (
                  <div className="border-t pt-3 flex items-center justify-between text-lg font-bold">
                    <span>Total Due</span>
                    <span className="text-blue-600">
                      ${rentInfo.totalDue.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Current Month Description */}
              {rentInfo.currentMonthDescription && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    {rentInfo.currentMonthDescription}
                  </p>
                </div>
              )}

              {/* Payment Button */}
              {renderPaymentButton()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
