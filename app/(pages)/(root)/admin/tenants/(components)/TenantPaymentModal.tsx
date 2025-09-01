"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
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
  paymentDate: z.string().min(1, "Payment date is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface TenantPaymentModalProps {
  tenant: ITenant;
}

// Payment Button Component (Trigger)
export function PaymentButton({
  tenant,
  onPaymentClick,
}: {
  tenant: ITenant;
  onPaymentClick?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    onPaymentClick?.(); // Notify parent that payment button was clicked
    setOpen(true);
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
      <TenantPaymentModal tenant={tenant} open={open} onOpenChange={setOpen} />
    </>
  );
}

// Modal Component
function TenantPaymentModal({
  tenant,
  open,
  onOpenChange,
}: {
  tenant: ITenant;
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

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: getDefaultAmount(),
      paymentDate: new Date().toISOString().split("T")[0],
      description: "",
      notes: "",
    },
  });

  // Mock mutation - replace with actual API call
  const recordPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentFormData) => {
      // TODO: Replace with actual API call
      console.log("Recording payment:", paymentData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: "Payment recorded successfully",
      };
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
        amount: getDefaultAmount(),
        paymentDate: new Date().toISOString().split("T")[0],
        description: "",
        notes: "",
      });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
              {...form.register("amount")}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-red-600">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Payment Date
            </Label>
            <Input
              id="paymentDate"
              type="date"
              {...form.register("paymentDate")}
            />
            {form.formState.errors.paymentDate && (
              <p className="text-sm text-red-600">
                {form.formState.errors.paymentDate.message}
              </p>
            )}
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
