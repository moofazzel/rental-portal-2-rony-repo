"use client";

import { updateUserById } from "@/app/apiClient/adminApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ITenant } from "@/types/tenant.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Car, File, FileText, MapPin, Upload, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import DeleteTenantDialog from "./DeleteTenantDialog";

// New interface for tenant updates
export interface IUpdateTenantData {
  user?: {
    name?: string;
    phoneNumber?: string;
    email?: string;
    rvInfo?: {
      make: string;
      model: string;
      year: number;
      length: number;
      licensePlate: string;
    };
  };
  lease?: {
    leaseType?: "MONTHLY" | "FIXED_TERM";
    leaseStart?: Date;
    leaseEnd?: Date;
    rentAmount?: number;
    depositAmount?: number;
    occupants?: number;
    pets?: {
      hasPets: boolean;
      petDetails?: {
        type: string;
        breed: string;
        name: string;
        weight: number;
      }[];
    };
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    specialRequests?: string[];
    documents?: string[];
    notes?: string;
  };
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  rvMake: z.string().optional(),
  rvModel: z.string().optional(),
  rvYear: z.string().optional(),
  rvLength: z.string().optional(),
  rvLicensePlate: z.string().optional(),
  leaseType: z.enum(["monthly", "fixed"]),
  leaseStart: z.string().optional(),
  leaseEnd: z.string().optional(),
  rentAmount: z.string().min(1, "Rent amount is required"),
  depositAmount: z.string().min(1, "Security deposit is required"),
  occupants: z.string().min(1, "Number of occupants is required"),
  pets: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  specialRequests: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TenantEditModalProps {
  tenant: ITenant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TenantEditModal({
  tenant,
  open,
  onOpenChange,
}: TenantEditModalProps) {
  console.log("🚀 ~ tenant:", tenant);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tenant?.name || "",
      phoneNumber: tenant?.phoneNumber || "",
      email: tenant?.email || "",
      rvMake: tenant?.rvInfo?.make || "",
      rvModel: tenant?.rvInfo?.model || "",
      rvYear: tenant?.rvInfo?.year?.toString() || "",
      rvLength: tenant?.rvInfo?.length?.toString() || "",
      rvLicensePlate: tenant?.rvInfo?.licensePlate || "",
      leaseType: (tenant?.lease?.leaseType?.toLowerCase() ||
        tenant?.leaseType ||
        "monthly") as "monthly" | "fixed",
      leaseStart: tenant?.lease?.leaseStart
        ? new Date(tenant.lease.leaseStart).toISOString().split("T")[0]
        : tenant?.leaseStart
        ? new Date(tenant.leaseStart).toISOString().split("T")[0]
        : "",
      leaseEnd: tenant?.lease?.leaseEnd
        ? new Date(tenant.lease.leaseEnd).toISOString().split("T")[0]
        : tenant?.leaseEnd
        ? new Date(tenant.leaseEnd).toISOString().split("T")[0]
        : "",
      rentAmount: tenant?.lease?.rentAmount?.toString() || tenant?.rent || "",
      depositAmount:
        tenant?.lease?.depositAmount?.toString() || tenant?.deposit || "",
      occupants:
        tenant?.lease?.occupants?.toString() || tenant?.occupants || "",
      pets: tenant?.lease?.pets?.petDetails?.join(", ") || tenant?.pets || "",
      emergencyContactName: tenant?.lease?.emergencyContact?.name || "",
      emergencyContactPhone: tenant?.lease?.emergencyContact?.phone || "",
      emergencyContactRelationship:
        tenant?.lease?.emergencyContact?.relationship || "",
      specialRequests: tenant?.lease?.specialRequests?.join(", ") || "",
      notes: tenant?.lease?.notes || "",
    },
  });

  // Add these new states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // File upload handlers
  const handleFileUpload = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size must be less than 10MB");
      return;
    }
    setUploadedFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleLeaseTypeChange = (value: "monthly" | "fixed") => {
    form.setValue("leaseType", value);
    if (value === "monthly") {
      form.setValue("leaseEnd", "");
    }
  };

  //form validation before submitting
  const { mutateAsync: editTenantMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: updateUserById,
    });

  const onSubmit = async (data: FormData) => {
    try {
      const payload: IUpdateTenantData = {
        user: {
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          rvInfo: {
            make: data.rvMake || "",
            model: data.rvModel || "",
            year: parseInt(data.rvYear || "0") || 0,
            length: parseFloat(data.rvLength || "0") || 0,
            licensePlate: data.rvLicensePlate || "",
          },
        },
        lease: {
          leaseType: data.leaseType.toUpperCase() as "MONTHLY" | "FIXED_TERM",
          leaseStart: data.leaseStart ? new Date(data.leaseStart) : undefined,
          leaseEnd:
            data.leaseType === "monthly"
              ? undefined
              : data.leaseEnd
              ? new Date(data.leaseEnd)
              : undefined,
          rentAmount: parseFloat(data.rentAmount) || 0,
          depositAmount: parseFloat(data.depositAmount) || 0,
          occupants: parseInt(data.occupants) || 0,
          pets: {
            hasPets: !!data.pets,
            petDetails: data.pets
              ? data.pets
                  .split(", ")
                  .filter((p) => p.trim())
                  .map((pet) => ({
                    type: "Unknown",
                    breed: "Unknown",
                    name: pet.trim(),
                    weight: 0,
                  }))
              : [],
          },
          emergencyContact: {
            name: data.emergencyContactName || "",
            phone: data.emergencyContactPhone || "",
            relationship: data.emergencyContactRelationship || "",
          },
          specialRequests: data.specialRequests
            ? data.specialRequests.split(", ").filter((s) => s.trim())
            : [],
          notes: data.notes,
        },
      };

      const res = await editTenantMutation({
        userId: tenant._id!,
        data: payload,
      });
      console.log("update tenant data response", res);

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      onOpenChange(false);
      toast.success("User Updated successfully!");

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update tenant information.");
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col">
          <DialogHeader className=" top-0 bg-white z-50 px-6 py-4 flex items-center justify-between overflow-visible relative">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-blue-600" />
              Update Tenant: {tenant.name}
            </DialogTitle>

            {/* Custom Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="absolute -top-2 -right-2 h-8 w-8 p-0 bg-gray-100 hover:bg-gray-200 border border-gray-500 rounded-full z-[60]"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto pt-6 pb-6 px-6 space-y-6"
          >
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    className="cursor-not-allowed"
                    id="email"
                    {...form.register("email")}
                    placeholder="Enter email address"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter full name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...form.register("phoneNumber")}
                    placeholder="Enter phone number"
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* RV Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-orange-600" />
                  RV Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rvMake">RV Make</Label>
                  <Input
                    id="rvMake"
                    {...form.register("rvMake")}
                    placeholder="Enter RV make"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rvModel">RV Model</Label>
                  <Input
                    id="rvModel"
                    {...form.register("rvModel")}
                    placeholder="Enter RV model"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rvYear">RV Year</Label>
                  <Input
                    id="rvYear"
                    {...form.register("rvYear")}
                    type="number"
                    placeholder="Enter RV year"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rvLength">RV Length (ft)</Label>
                  <Input
                    id="rvLength"
                    {...form.register("rvLength")}
                    type="number"
                    placeholder="Enter RV length in feet"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="rvLicensePlate">License Plate</Label>
                  <Input
                    id="rvLicensePlate"
                    {...form.register("rvLicensePlate")}
                    placeholder="Enter license plate number"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Site Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  Site Address
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    className="cursor-not-allowed"
                    id="propertyName"
                    value={
                      typeof tenant.property === "object"
                        ? tenant.property.name
                        : "No data"
                    }
                    placeholder="Enter property name"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lotNumber">Lot Number</Label>
                  <Input
                    className="cursor-not-allowed"
                    id="lotNumber"
                    value={tenant?.lotNumber}
                    placeholder="Enter lot number"
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lease Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Lease Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lease Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="leaseType">Lease Type</Label>
                  <RadioGroup
                    value={form.watch("leaseType")}
                    onValueChange={handleLeaseTypeChange}
                    className="flex gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="monthly"
                        id="monthly"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="monthly"
                        className={`px-4 py-2 border rounded-md cursor-pointer transition-colors ${
                          form.watch("leaseType") === "monthly"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        Monthly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="fixed"
                        id="fixed"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="fixed"
                        className={`px-4 py-2 border rounded-md cursor-pointer transition-colors ${
                          form.watch("leaseType") === "fixed"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        Fixed Term
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Lease Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rentAmount">Rent Amount *</Label>
                    <Input
                      id="rentAmount"
                      {...form.register("rentAmount")}
                      type="number"
                      placeholder="Enter monthly rent amount"
                      required
                    />
                    {form.formState.errors.rentAmount && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.rentAmount.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Security Deposit *</Label>
                    <Input
                      id="depositAmount"
                      {...form.register("depositAmount")}
                      type="number"
                      placeholder="Enter security deposit amount"
                      required
                    />
                    {form.formState.errors.depositAmount && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.depositAmount.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupants">Number of Occupants *</Label>
                    <Input
                      id="occupants"
                      {...form.register("occupants")}
                      type="number"
                      placeholder="Enter number of occupants"
                      min="1"
                      required
                    />
                    {form.formState.errors.occupants && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.occupants.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pets">Pets</Label>
                    <Input
                      id="pets"
                      {...form.register("pets")}
                      placeholder="Enter pet information (optional)"
                    />
                  </div>

                  {/* Conditional Date Fields */}
                  {form.watch("leaseType") === "fixed" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="leaseStart">Lease Start Date *</Label>
                        <Input
                          id="leaseStart"
                          {...form.register("leaseStart")}
                          type="date"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaseEnd">Lease End Date *</Label>
                        <Input
                          id="leaseEnd"
                          {...form.register("leaseEnd")}
                          type="date"
                          required
                        />
                      </div>
                    </>
                  )}

                  {form.watch("leaseType") === "monthly" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="leaseStart">Lease Start Date *</Label>
                        <Input
                          id="leaseStart"
                          {...form.register("leaseStart")}
                          type="date"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaseEnd">Lease End Date</Label>
                        <Input
                          id="leaseEnd"
                          value="Ongoing"
                          className="bg-gray-50"
                          readOnly
                          disabled
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4 text-red-600" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    {...form.register("emergencyContactName")}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    {...form.register("emergencyContactPhone")}
                    placeholder="Enter emergency contact phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">
                    Relationship
                  </Label>
                  <Input
                    id="emergencyContactRelationship"
                    {...form.register("emergencyContactRelationship")}
                    placeholder="Enter relationship"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Input
                    id="specialRequests"
                    {...form.register("specialRequests")}
                    placeholder="Enter special requests (comma separated)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    {...form.register("notes")}
                    placeholder="Enter additional notes"
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-orange-600" />
                  Lease Agreement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!uploadedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      PDF files only (Max 10MB)
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="fileInput"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                    >
                      Select File
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between items-center gap-5 pt-4 border-t">
              <DeleteTenantDialog tenant={tenant} />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Updating..." : "Update Tenant"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
