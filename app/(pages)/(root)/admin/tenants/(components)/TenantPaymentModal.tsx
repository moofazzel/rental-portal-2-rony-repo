"use client";

import { recordTenantPayment } from "@/app/apiClient/adminApi";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PaymentType, PaymentUpdateData } from "@/types/payment.types";
import { ITenant } from "@/types/tenant.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar, DollarSign, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Form validation schema
const paymentFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  paymentDate: z.date({
    required_error: "Payment date is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  description: z.string().optional(),
  notes: z.string().optional(),
  paymentType: z.enum(["rent", "deposit", "both"]).optional(),
  type: z.enum(["RENT", "DEPOSIT", "BOTH"]).optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

// Payment Button Component (Trigger)
export function PaymentButton({
  tenant,
  isFirstPayment = false,
  onPaymentClick,
}: {
  tenant: ITenant;
  isFirstPayment?: boolean;
  onPaymentClick?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    onPaymentClick?.(); // Notify parent that payment button was clicked
    setOpen(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Reset the click source when modal closes
    if (!newOpen) {
      // Small delay to ensure the modal close event is processed
      setTimeout(() => {
        onPaymentClick?.();
      }, 50);
    }
  };

  return (
    <>
      <Button
        size="sm"
        type="button"
        variant="outline"
        onClick={handleClick}
        className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
      >
        <DollarSign className="w-3 h-3" />
        Payment
      </Button>
      <TenantPaymentModal
        tenant={tenant}
        isFirstPayment={isFirstPayment}
        open={open}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}

// Modal Component
function TenantPaymentModal({
  tenant,
  isFirstPayment = false,
  open,
  onOpenChange,
}: {
  tenant: ITenant;
  isFirstPayment?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  console.log("🚀 ~ tenant:", tenant);
  console.log("🚀 ~ tenant:", tenant);
  const router = useRouter();

  const getDefaultAmount = () => {
    // Use rentSummary data first, then fallback to legacy fields
    if (tenant.rentSummary) {
      // If there are payment options, use the first one's amount
      if (
        tenant.rentSummary.paymentOptions &&
        tenant.rentSummary.paymentOptions.length > 0
      ) {
        return tenant.rentSummary.paymentOptions[0].amount.toString();
      }
      // If it's pro-rated, use the pro-rated amount
      if (
        tenant.rentSummary.isProRated &&
        tenant.rentSummary.proRatedRentAmount > 0
      ) {
        return tenant.rentSummary.proRatedRentAmount.toString();
      }
      // Otherwise use the rent amount
      return tenant.rentSummary.rentAmount?.toString() || "";
    }
    return (
      tenant.lease?.rentAmount?.toString() ||
      tenant.lotPrice?.monthly?.toString() ||
      tenant.rent ||
      ""
    );
  };

  // Function to calculate amount based on payment type
  const calculateAmountForPaymentType = (paymentType: string) => {
    if (!isFirstPayment) return getDefaultAmount();

    // Use rentSummary data first, then fallback to legacy fields
    let rentAmount = 0;
    let depositAmount = 0;

    if (tenant.rentSummary) {
      rentAmount = tenant.rentSummary.rentAmount || 0;
      depositAmount = tenant.rentSummary.depositAmount || 0;
    } else {
      rentAmount = tenant.lease?.rentAmount || tenant.lotPrice?.monthly || 0;
      depositAmount = tenant.lease?.depositAmount || 0;
    }

    switch (paymentType) {
      case "rent":
        return rentAmount.toString();
      case "deposit":
        return depositAmount.toString();
      case "both":
        return (rentAmount + depositAmount).toString();
      default:
        return getDefaultAmount();
    }
  };

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: isFirstPayment
        ? calculateAmountForPaymentType("both")
        : getDefaultAmount(),
      paymentDate:
        isFirstPayment &&
        (tenant.rentSummary?.leaseStart || tenant.lease?.leaseStart)
          ? new Date(
              tenant.rentSummary?.leaseStart || tenant.lease?.leaseStart!
            )
          : new Date(),
      dueDate: tenant.rentSummary?.nextMonthDueDate
        ? new Date(tenant.rentSummary.nextMonthDueDate)
        : new Date(),
      description: isFirstPayment
        ? tenant.rentSummary?.isProRated
          ? `Pro-rated First Month Rent (${tenant.rentSummary.proRatedDays} days)`
          : "First payment"
        : tenant.rentSummary?.paymentOptions &&
          tenant.rentSummary.paymentOptions.length > 0
        ? tenant.rentSummary.paymentOptions[0].description
        : "Monthly rent payment",
      notes: "",
      paymentType: isFirstPayment ? "both" : "rent",
      type: isFirstPayment ? "BOTH" : "RENT",
    },
  });

  // Record payment mutation using real API
  const recordPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentFormData) => {
      // Calculate amount based on payment type for first payments
      let finalAmount = parseFloat(paymentData.amount);
      let description = paymentData.description || undefined;

      if (isFirstPayment && paymentData.paymentType) {
        // Use rentSummary data first, then fallback to legacy fields
        let rentAmount = 0;
        let depositAmount = 0;

        if (tenant.rentSummary) {
          rentAmount = tenant.rentSummary.rentAmount || 0;
          depositAmount = tenant.rentSummary.depositAmount || 0;
        } else {
          rentAmount =
            tenant.lease?.rentAmount || tenant.lotPrice?.monthly || 0;
          depositAmount = tenant.lease?.depositAmount || 0;
        }

        switch (paymentData.paymentType) {
          case "rent":
            finalAmount = rentAmount;
            description = "First month rent payment";
            break;
          case "deposit":
            finalAmount = depositAmount;
            description = "Security deposit payment";
            break;
          case "both":
            finalAmount = rentAmount + depositAmount;
            description = "First month rent + security deposit";
            break;
        }
      }

      // Map the form type to PaymentType
      let paymentType: PaymentType = "RENT";
      if (paymentData.type === "DEPOSIT") {
        paymentType = "DEPOSIT";
      } else if (paymentData.type === "BOTH") {
        paymentType = "RENT"; // Default to RENT for combined payments
      }

      const paymentPayload: PaymentUpdateData = {
        amount: finalAmount,
        paidDate: paymentData.paymentDate.toISOString(),
        dueDate: paymentData.dueDate.toISOString(),
        description: description,
        type: paymentType,
        notes: paymentData.notes || undefined,
      };

      if (!tenant._id) {
        throw new Error("Tenant ID is required");
      }

      const response = await recordTenantPayment(tenant._id, paymentPayload);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error("Failed to record payment");
      console.error(error);
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      await recordPaymentMutation.mutateAsync(data);
    } catch (error) {
      console.error("Payment recording failed:", error);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      const resetData: PaymentFormData = {
        amount: isFirstPayment
          ? calculateAmountForPaymentType("both")
          : getDefaultAmount(),
        paymentDate:
          isFirstPayment &&
          (tenant.rentSummary?.leaseStart || tenant.lease?.leaseStart)
            ? new Date(
                tenant.rentSummary?.leaseStart || tenant.lease?.leaseStart!
              )
            : new Date(),
        dueDate: (() => {
          // For first time payments, use lease start date
          if (
            isFirstPayment &&
            (tenant.rentSummary?.leaseStart || tenant.lease?.leaseStart)
          ) {
            return new Date(
              tenant.rentSummary?.leaseStart || tenant.lease?.leaseStart!
            );
          }
          // For regular payments, use next month due date
          if (tenant.rentSummary?.nextMonthDueDate) {
            return new Date(tenant.rentSummary.nextMonthDueDate);
          }
          // Fallback to current date
          return new Date();
        })(),
        description: isFirstPayment
          ? tenant.rentSummary?.isProRated
            ? `Pro-rated First Month Rent (${tenant.rentSummary.proRatedDays} days)`
            : "First payment"
          : tenant.rentSummary?.paymentOptions &&
            tenant.rentSummary.paymentOptions.length > 0
          ? tenant.rentSummary.paymentOptions[0].description
          : "Monthly rent payment",
        notes: "",
        paymentType: isFirstPayment ? "both" : "rent",
        type: isFirstPayment ? "BOTH" : "RENT",
      };

      form.reset(resetData);

      // Trigger form validation and re-rendering to ensure UI updates
      setTimeout(() => {
        form.trigger(["amount", "paymentDate", "dueDate", "description"]);
      }, 0);
    }
  }, [
    open,
    form,
    isFirstPayment,
    tenant.rentSummary?.rentAmount,
    tenant.rentSummary?.leaseStart,
    tenant.rentSummary?.nextMonthDueDate,
    tenant.lease?.rentAmount,
    tenant.lease?.leaseStart,
    tenant.lotPrice?.monthly,
  ]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md h-[80vh] flex flex-col p-0"
        onClick={handleDialogClick}
      >
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 bg-white border-b p-6 pb-4 z-10">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <DollarSign className="w-5 h-5 text-green-600" />
            Record Payment - {tenant.name}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Rent Summary Information */}
            {tenant.rentSummary && (
              <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg space-y-3 border">
                <div className="grid grid-cols-2 justify gap-3 text-sm">
                  <div className="flex justie gap-3">
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium text-gray-900">
                      {tenant.rentSummary.propertyName}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-gray-600">Spot:</span>
                    <span className="font-medium text-gray-900">
                      {tenant.rentSummary.spotNumber}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-600">Monthly Rent:</span>
                  <span className="font-semibold text-green-600">
                    ${tenant.rentSummary.rentAmount}
                  </span>
                </div>

                {/* Payment Type Indicators */}
                <div className="flex flex-wrap gap-2">
                  {tenant.rentSummary.isFirstTimePayment && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      First Payment
                    </span>
                  )}

                  {tenant.rentSummary.isProRated && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                      Pro-Rated Payment
                    </span>
                  )}

                  {tenant.rentSummary.isFirstTimePayment &&
                    tenant.rentSummary.depositAmount > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        Security Deposit
                      </span>
                    )}
                </div>

                {tenant.rentSummary.isProRated && (
                  <div className="space-y-2 p-3 bg-white rounded border">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pro-rated Days:</span>
                        <span className="font-medium">
                          {tenant.rentSummary.proRatedDays} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pro-rated Amount:</span>
                        <span className="font-medium text-orange-600">
                          ${tenant.rentSummary.proRatedRentAmount}
                        </span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-600">Security Deposit:</span>
                        <span className="font-medium text-blue-600">
                          ${tenant.rentSummary.depositAmount}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Full Month Amount:</span>
                      <span className="font-medium">
                        ${tenant.rentSummary.fullMonthRentAmount}
                      </span>
                    </div>
                  </div>
                )}

                {tenant.rentSummary.totalOverdueAmount > 0 && (
                  <div className="flex justify-between text-sm p-2 bg-red-50 rounded border border-red-200">
                    <span className="text-red-700 font-medium">
                      Overdue Amount:
                    </span>
                    <span className="font-bold text-red-600">
                      ${tenant.rentSummary.totalOverdueAmount}
                    </span>
                  </div>
                )}
                {tenant.rentSummary.warningMessage && (
                  <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                    {tenant.rentSummary.warningMessage}
                  </div>
                )}
              </div>
            )}

            {/* Payment Options from rentSummary */}
            {tenant.rentSummary?.paymentOptions &&
              tenant.rentSummary.paymentOptions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <h3 className="font-medium text-gray-900">
                      Available Payment Options
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Click on any option below to auto-fill the payment form
                  </p>
                  <div className="space-y-2">
                    {tenant.rentSummary.paymentOptions.map((option, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
                        onClick={() => {
                          form.setValue("amount", option.amount.toString());
                          form.setValue("description", option.description);
                          if (option.dueDate) {
                            form.setValue("dueDate", new Date(option.dueDate));
                          }
                          // Set payment type based on option type
                          if (option.type === "NEXT_MONTH") {
                            form.setValue("type", "RENT");
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 group-hover:text-green-800">
                              {option.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Due:{" "}
                              {option.dueDate
                                ? new Date(option.dueDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold text-green-600 text-lg">
                              ${option.amount}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {option.type.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="flex items-center gap-2 font-medium text-gray-700"
              >
                <DollarSign className="w-4 h-4 text-green-600" />
                Payment Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter payment amount"
                value={form.watch("amount")}
                onChange={(e) => form.setValue("amount", e.target.value)}
                className="text-lg font-medium cursor-pointer"
                readOnly
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isFirstPayment && (
                <div className="space-y-2">
                  <Label
                    htmlFor="paymentType"
                    className="font-medium text-gray-700"
                  >
                    Payment Type
                  </Label>
                  <Select
                    value={form.watch("paymentType")}
                    onValueChange={(value) => {
                      form.setValue(
                        "paymentType",
                        value as "rent" | "deposit" | "both"
                      );
                      // Update amount based on payment type
                      const newAmount = calculateAmountForPaymentType(value);
                      form.setValue("amount", newAmount);
                      // Trigger form validation and re-render
                      form.trigger("amount");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent Only</SelectItem>
                      <SelectItem value="deposit">Deposit Only</SelectItem>
                      <SelectItem value="both">Rent + Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.paymentType && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.paymentType.message}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-medium text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Payment Received Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-10"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {(() => {
                        const paymentDate = form.watch("paymentDate");
                        return paymentDate
                          ? paymentDate.toLocaleDateString()
                          : "Pick a date";
                      })()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={form.watch("paymentDate")}
                      onSelect={(date) => {
                        if (date) {
                          form.setValue("paymentDate", date);
                          // Trigger form validation to ensure UI updates
                          form.trigger("paymentDate");
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.paymentDate && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.paymentDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-purple-600" />
                Due Date
                {tenant.rentSummary?.isFirstTimePayment && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Fixed for first payment
                  </span>
                )}
              </Label>
              {tenant.rentSummary?.isFirstTimePayment ? (
                <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {(() => {
                      const dueDate = form.watch("dueDate");
                      return dueDate
                        ? dueDate.toLocaleDateString()
                        : "No date set";
                    })()}
                  </span>
                </div>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-10"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {(() => {
                        const dueDate = form.watch("dueDate");
                        return dueDate
                          ? dueDate.toLocaleDateString()
                          : "Pick a date";
                      })()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={form.watch("dueDate")}
                      onSelect={(date) => {
                        if (date) {
                          form.setValue("dueDate", date);
                          // Trigger form validation to ensure UI updates
                          form.trigger("dueDate");
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
              {form.formState.errors.dueDate && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.dueDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="flex items-center gap-2 font-medium text-gray-700"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                Payment Description
              </Label>
              <Input
                id="description"
                placeholder="e.g., Monthly rent for January 2024"
                {...form.register("description")}
                className="h-10"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="font-medium text-gray-700">
                Admin Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this payment recording..."
                {...form.register("notes")}
                rows={3}
                className="resize-none"
              />
              {form.formState.errors.notes && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.notes.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <DialogFooter className=" bg-white border-t p-6 pt-4 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={recordPaymentMutation.isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={recordPaymentMutation.isPending}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            onClick={form.handleSubmit(onSubmit)}
          >
            {recordPaymentMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Recording Payment...
              </div>
            ) : (
              "Record Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Default export for backward compatibility
export default PaymentButton;
