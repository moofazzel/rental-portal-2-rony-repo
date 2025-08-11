"use client";

import { updateServiceRequestById } from "@/app/apiClient/adminApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UpdateServiceRequestArgs } from "@/types/serviceRequest.types";
import { Trash2 } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  IServiceRequest,
  ServiceRequestStatus,
  ServiceRequestType,
} from "../types/service-request";
import { DeleteServiceRequestDialog } from "./DeleteServiceRequestDialog";

type ServiceRequestModalProps = {
  open: boolean;
  onClose: () => void;
  request: IServiceRequest;
};

export default function ServiceRequestModal({
  open,
  onClose,
  request,
}: ServiceRequestModalProps) {
  console.log(request);
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  //validate form before submitting
  const { mutateAsync: updateServiceRequestMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: updateServiceRequestById,
    });

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents form from reloading the page

    const formData = new FormData(e.currentTarget);
    const status = formData.get("status") as ServiceRequestStatus;

    if (!status) {
      toast.error("Status is required.");
      return;
    }

    const payload: UpdateServiceRequestArgs = {
      requestId: request._id,
      data: {
        title: request.title,
        description: request.description,
        type: request.type,
        tenantId: request.tenantId?._id || "", // full object
        propertyId: request.propertyId || undefined, // full object
        spotId: request.spotId?._id || "", // full object
        status,
        requestedDate: request.requestedDate,
        completedDate: request.completedDate || undefined,
      },
    };

    try {
      const res = await updateServiceRequestMutation(payload);
      console.log(res);
      if (!res.success) {
        toast.error(res.message || "Update failed");

        //

        return;
      }
      onClose();
      toast.success("Service request updated.");
      router.refresh();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update service request.");
    }
  };

  const getTypeIcon = (type: ServiceRequestType) => {
    switch (type) {
      case "MAINTENANCE":
        return "🔧";
      case "UTILITY":
        return "⚡";
      case "SECURITY":
        return "🔒";
      case "CLEANING":
        return "🧹";
      case "OTHER":
        return "📋";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{getTypeIcon(request.type)}</span>
              {request.title}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate}>
            <div className="flex flex-col lg:flex-row gap-6 mt-4">
              {/* Left Column */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <Label className="text-sm font-medium">Tenant Name</Label>
                  <Input
                    readOnly
                    value={request.tenantId?.name}
                    className="mt-1 px-0 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-sm text-muted-foreground"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Tenant Email</Label>
                  <Input
                    readOnly
                    value={request.tenantId?.email}
                    className="mt-1 px-0 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-xs text-muted-foreground"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Spot Number</Label>
                  <Input
                    readOnly
                    value={request.spotId?.spotNumber}
                    className="mt-1 px-0 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-sm text-muted-foreground"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Requested Date</Label>
                  <Input
                    readOnly
                    value={new Date(request.requestedDate).toLocaleDateString()}
                    className="mt-1 px-0 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-muted-foreground"
                  />
                </div>

                {request.completedDate && (
                  <div>
                    <Label className="text-sm font-medium">
                      Completed Date
                    </Label>
                    <Input
                      readOnly
                      value={new Date(
                        request.completedDate
                      ).toLocaleDateString()}
                      className="mt-1 px-0 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-muted-foreground"
                    />
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Property Name</Label>
                  <Input
                    readOnly
                    value={request.propertyId?.name || ""}
                    className="mt-1 px-0 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-sm text-muted-foreground"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Property Address
                  </Label>
                  <Input
                    readOnly
                    value={`${request.propertyId?.address?.street ?? ""}, ${
                      request.propertyId?.address?.city ?? ""
                    }, ${request.propertyId?.address?.state ?? ""} ${
                      request.propertyId?.address?.zip ?? ""
                    }`}
                    className="mt-1 px-0 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-xs text-muted-foreground"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Input
                    readOnly
                    value={request.type}
                    className="mt-1 px-0 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-sm text-muted-foreground"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    readOnly
                    value={request.description}
                    className="mt-1 resize-none border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-sm text-muted-foreground"
                    rows={1}
                  />
                </div>

                {request.tenantNotes && (
                  <div>
                    <Label className="text-sm font-medium">Tenant Notes</Label>
                    <Textarea
                      readOnly
                      value={request.tenantNotes}
                      className="mt-1 resize-none border-none outline-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-sm text-muted-foreground"
                      rows={1}
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select name="status" defaultValue={request.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 flex-shrink-0 mt-6">
              {/* Left: Delete Button */}
              <button
                type="button"
                className="cursor-pointer bg-transparent hover:bg-red-50 p-4 rounded-lg transition-colors"
                aria-label="Delete notice"
                onClick={() => {
                  setDeleteDialogOpen(true);
                  onClose();
                }}
              >
                <Trash2 className="w-[22px] h-[22px] text-red-500" />
              </button>

              {/* Right: Cancel and Update */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating" : "Update Request"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <DeleteServiceRequestDialog
        request={request}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
