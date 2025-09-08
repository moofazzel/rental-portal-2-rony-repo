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
import { PaymentUpdateData } from "@/types/payment.types";
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
  description: z.string().optional(),
  notes: z.string().optional(),
  paymentType: z.enum(["rent", "deposit", "both"]).optional(),
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
  const router = useRouter();

  const getDefaultAmount = () => {
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

    const rentAmount =
      tenant.lease?.rentAmount || tenant.lotPrice?.monthly || 0;
    const depositAmount = tenant.lease?.depositAmount || 0;

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
        isFirstPayment && tenant.lease?.leaseStart
          ? new Date(tenant.lease.leaseStart)
          : new Date(),
      description: isFirstPayment ? "First payment" : "Monthly rent payment",
      notes: "",
      paymentType: isFirstPayment ? "both" : "rent",
    },
  });

  // Record payment mutation using real API
  const recordPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentFormData) => {
      // Calculate amount based on payment type for first payments
      let finalAmount = parseFloat(paymentData.amount);
      let description = paymentData.description || undefined;

      if (isFirstPayment && paymentData.paymentType) {
        const rentAmount =
          tenant.lease?.rentAmount || tenant.lotPrice?.monthly || 0;
        const depositAmount = tenant.lease?.depositAmount || 0;

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

      const paymentPayload: PaymentUpdateData = {
        amount: finalAmount,
        paidDate: paymentData.paymentDate.toISOString(),
        description: description,
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
      form.reset({
        amount: isFirstPayment
          ? calculateAmountForPaymentType("both")
          : getDefaultAmount(),
        paymentDate:
          isFirstPayment && tenant.lease?.leaseStart
            ? new Date(tenant.lease.leaseStart)
            : new Date(),
        description: isFirstPayment ? "First payment" : "Monthly rent payment",
        notes: "",
        paymentType: isFirstPayment ? "both" : "rent",
      });
    }
  }, [
    open,
    form,
    isFirstPayment,
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
      <DialogContent className="max-w-md" onClick={handleDialogClick}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Manual Payment - {tenant.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter payment amount"
              value={form.watch("amount")}
              onChange={(e) => form.setValue("amount", e.target.value)}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-red-600">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-between">
            {isFirstPayment && (
              <div className="space-y-2 flex-1">
                <Label htmlFor="paymentType">Payment Type</Label>
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
            <div className="space-y-2 flex-1">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Payment Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {form.watch("paymentDate") ? (
                      form.watch("paymentDate").toLocaleDateString()
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={form.watch("paymentDate")}
                    onSelect={(date) => {
                      if (date) {
                        form.setValue("paymentDate", date);
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
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </Label>
            <Input
              id="description"
              placeholder="e.g., Monthly rent for January 2024"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this payment..."
              {...form.register("notes")}
              rows={3}
            />
            {form.formState.errors.notes && (
              <p className="text-sm text-red-600">
                {form.formState.errors.notes.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={recordPaymentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={recordPaymentMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {recordPaymentMutation.isPending
                ? "Recording..."
                : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Default export for backward compatibility
export default PaymentButton;
