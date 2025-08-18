"use client";

import {
  getPaymentBySessionId,
  type PaymentReceiptResponse,
} from "@/app/apiClient/tenantApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  CreditCard,
  Download,
  MapPin,
  Receipt,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Loading Skeleton Component
function ReceiptSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header Skeleton */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        {/* Receipt Card Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Receipt Number Skeleton */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>

            {/* Property and Tenant Information Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-20 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>

            {/* Payment Details Skeleton */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Breakdown Skeleton */}
            <div className="border-t pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>

            {/* Stripe Information Skeleton */}
            <div className="border-t pt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Skeleton className="h-5 w-32 mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
            </div>

            {/* Timestamps Skeleton */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const accountId = searchParams.get("accountId");
  const [receipt, setReceipt] = useState<PaymentReceiptResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!sessionId) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }

      if (!accountId) {
        setError("No account ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await getPaymentBySessionId(sessionId, accountId);


        if (!response.success) {
          throw new Error(response.message || "Failed to fetch receipt");
        }

        setReceipt(response.data);
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError("Failed to load payment receipt");
        toast.error("Failed to load payment receipt");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [sessionId, accountId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const downloadReceipt = () => {
    // TODO: Implement receipt download functionality
    toast.info("Receipt download feature coming soon!");
  };

  if (loading) {
    return <ReceiptSkeleton />;
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                <Receipt className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Receipt Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "Unable to load payment receipt"}
              </p>
              <Link href="/pay-rent">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Payments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 text-green-500 mb-4">
            <CheckCircle className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your payment has been processed successfully. Here&apos;s your
            receipt.
          </p>
          {receipt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
              <p className="text-green-800 font-medium">
                Amount Paid:{" "}
                <span className="text-green-900 text-xl">
                  {formatCurrency(receipt.totalAmount)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Receipt Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                Payment Receipt
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadReceipt}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Receipt Number */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Receipt Number
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {receipt.receiptNumber}
                </span>
              </div>
            </div>

            {/* Property and Tenant Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4" />
                    Property
                  </label>
                  <p className="text-lg text-gray-900">
                    {receipt.property.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {receipt.property.address.street as string},{" "}
                    {receipt.property.address.city},{" "}
                    {receipt.property.address.state}{" "}
                    {receipt.property.address.zip}
                  </p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Property
                    </span>
                    {receipt.property.lotNumber && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Lot: {receipt.property.lotNumber}
                      </span>
                    )}
                    {receipt.property.unitNumber && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Unit: {receipt.property.unitNumber}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Spot/Lot
                  </label>
                  <p className="text-lg text-gray-900">
                    {receipt.spot.spotNumber}
                  </p>
                  {receipt.spot.spotType && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {receipt.spot.spotType}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Tenant
                  </label>
                  <p className="text-lg text-gray-900">{receipt.tenant.name}</p>
                  <p className="text-sm text-gray-500">
                    {receipt.tenant.email}
                  </p>
                  {receipt.tenant.phone && (
                    <p className="text-sm text-gray-500">
                      {receipt.tenant.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Payment Type
                  </label>
                  <p className="text-lg text-gray-900 capitalize">
                    {receipt.type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      receipt.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {receipt.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <p className="text-lg text-gray-900">{receipt.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    {getPaymentMethodIcon(receipt.paymentMethod)}
                    Payment Method
                  </label>
                  <p className="text-lg text-gray-900 capitalize">
                    {receipt.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </label>
                    <p className="text-lg text-gray-900">
                      {formatDate(receipt.dueDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      Paid Date
                    </label>
                    <p className="text-lg text-gray-900">
                      {formatDateTime(receipt.paidDate)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Transaction ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {receipt.stripeTransactionId}
                    </p>
                  </div>
                  {receipt.stripeAccount && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Payment Processor
                      </label>
                      <p className="text-lg text-gray-900">
                        {receipt.stripeAccount.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="border-t pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Amount</span>
                  <span className="font-medium">
                    {formatCurrency(receipt.amount)}
                  </span>
                </div>
                {receipt.lateFeeAmount && receipt.lateFeeAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Late Fee</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(receipt.lateFeeAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total Amount</span>
                  <span className="text-green-600">
                    {formatCurrency(receipt.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stripe Information */}
            <div className="border-t pt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">
                  Payment Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Stripe Session ID:</span>
                    <p className="font-mono text-blue-900 text-xs break-all">
                      {receipt.stripeSessionId}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Payment Intent ID:</span>
                    <p className="font-mono text-blue-900 text-xs break-all">
                      {receipt.stripePaymentIntentId}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Transaction ID:</span>
                    <p className="font-mono text-blue-900 text-xs break-all">
                      {receipt.stripeTransactionId}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Payment Link ID:</span>
                    <p className="font-mono text-blue-900 text-xs break-all">
                      {receipt.stripePaymentLinkId}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600">
                    These IDs can be used for payment verification and customer
                    support.
                  </p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Receipt Created
                  </label>
                  <p className="text-gray-900">
                    {formatDateTime(receipt.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {formatDateTime(receipt.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pay-rent">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
