"use client";

import { uploadToCloudinaryAction } from "@/app/actions/cloudinary-upload";
import { removeLeaseAgreement } from "@/app/actions/remove-lease-agreement";
import { updateUserById } from "@/app/apiClient/adminApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  checkPdfAccessibility,
  getSecurePdfUrl,
} from "@/lib/cloudinary-client";
import { ITenant } from "@/types/tenant.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  Car,
  CheckCircle,
  File,
  FileText,
  MapPin,
  Upload,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
    additionalRentAmount?: number;
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
    leaseAgreement?: string;
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
  additionalRentAmount: z.string().optional(),
  depositAmount: z.string().min(1, "Security deposit is required"),
  occupants: z.string().min(1, "Number of occupants is required"),
  pets: z.string().optional(),
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
      rentAmount:
        tenant?.lease?.rentAmount?.toString() ||
        tenant?.lotPrice?.monthly?.toString() ||
        "",
      additionalRentAmount:
        tenant?.lease?.additionalRentAmount?.toString() || "",
      depositAmount:
        tenant?.lease?.depositAmount?.toString() || tenant?.deposit || "",
      occupants:
        tenant?.lease?.occupants?.toString() || tenant?.occupants || "",
      pets:
        tenant?.lease?.pets?.petDetails &&
        tenant.lease.pets.petDetails.length > 0
          ? tenant.lease.pets.petDetails
              .map((pet) =>
                typeof pet === "string"
                  ? pet
                  : `${(pet as any).type || "Unknown"} ${
                      (pet as any).breed || "Unknown"
                    } ${(pet as any).name || "Unknown"} ${
                      (pet as any).weight || 0
                    }`
              )
              .join(", ")
          : "",

      specialRequests: tenant?.lease?.specialRequests?.join(", ") || "",
      notes: tenant?.lease?.notes || "",
    },
  });

  // Add these new states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [showAdditionalRent, setShowAdditionalRent] = useState(
    !!(
      tenant?.lease?.additionalRentAmount &&
      tenant.lease.additionalRentAmount > 0
    )
  );

  // Check if tenant has an existing lease agreement
  const existingLeaseAgreement = tenant?.lease?.leaseAgreement;

  // State for tracking deletion
  const [isDeletingAgreement, setIsDeletingAgreement] = useState(false);

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
    setUploadProgress(0);
    setUploadStatus("idle");
    setUploadedFileUrl("");
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
    setUploadProgress(0);
    setUploadStatus("idle");
    setUploadedFileUrl("");
  };

  const handleRemoveExistingAgreement = async () => {
    if (!tenant?.lease?.id || !existingLeaseAgreement) {
      toast.error("No lease agreement to remove");
      return;
    }

    try {
      setIsDeletingAgreement(true);

      // Call the server action to remove the lease agreement
      const result = await removeLeaseAgreement(tenant.lease.id);

      if (result.success) {
        toast.success("Lease agreement removed successfully");
        // Reset the uploaded file URL to clear the display
        setUploadedFileUrl("");
        // Refresh the page to get updated data
        router.refresh();
      } else {
        throw new Error(result.message || "Failed to remove lease agreement");
      }
    } catch (error) {
      console.error("Error removing lease agreement:", error);
      toast.error("Failed to remove lease agreement. Please try again.");
    } finally {
      setIsDeletingAgreement(false);
    }
  };

  const handleFileUploadWithProgress = async (file: File) => {
    if (!file) return null;

    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "documents");

      const uploadResult = await uploadToCloudinaryAction(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadResult.success) {
        setUploadStatus("success");

        // Generate a secure URL that avoids untrusted customer issues
        const secureUrl = getSecurePdfUrl(uploadResult.data.publicId);
        setUploadedFileUrl(secureUrl);

        // Verify the URL is accessible
        const isAccessible = await checkPdfAccessibility(secureUrl);
        if (!isAccessible) {
          console.warn(
            "PDF URL may not be accessible, using original URL as fallback"
          );
          setUploadedFileUrl(uploadResult.data.secureUrl);
        }

        toast.success("Lease agreement uploaded successfully!");
        return isAccessible ? secureUrl : uploadResult.data.secureUrl;
      } else {
        setUploadStatus("error");
        console.error("Upload failed:", uploadResult.error);
        toast.error(`Failed to upload lease agreement: ${uploadResult.error}`);
        return null;
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      setUploadProgress(0);
      toast.error("Upload failed. Please try again.");
      return null;
    }
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
      // Upload file if present
      let finalUploadedFileUrl = "";
      if (uploadedFile && uploadStatus !== "success") {
        setIsUploading(true);
        const uploadedUrl = await handleFileUploadWithProgress(uploadedFile);
        if (!uploadedUrl) {
          setIsUploading(false);
          return;
        }
        finalUploadedFileUrl = uploadedUrl;
        setIsUploading(false);
      } else if (uploadStatus === "success") {
        finalUploadedFileUrl = uploadedFileUrl;
      } else if (existingLeaseAgreement && !uploadedFile) {
        // Keep existing lease agreement if no new file is uploaded
        finalUploadedFileUrl = existingLeaseAgreement;
      }

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
          additionalRentAmount: showAdditionalRent
            ? parseFloat(data.additionalRentAmount || "0") || 0
            : 0,
          depositAmount: parseFloat(data.depositAmount) || 0,
          occupants: parseInt(data.occupants) || 0,
          pets: {
            hasPets: !!data.pets && data.pets.trim() !== "",
            petDetails:
              data.pets && data.pets.trim() !== ""
                ? data.pets.split(", ").map((pet) => {
                    const parts = pet.trim().split(" ");
                    return {
                      type: parts[0] || "Unknown",
                      breed: parts[1] || "Unknown",
                      name: parts[2] || "Unknown",
                      weight: parseFloat(parts[3]) || 0,
                    };
                  })
                : [],
          },
          // document is empty array forcefully
          documents: [],
          leaseAgreement: finalUploadedFileUrl,
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

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Tenant Updated successfully!");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update tenant information.");
      console.error(error);
    }
  };

  useEffect(() => {
    form.reset(
      {
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
        rentAmount:
          tenant?.lease?.rentAmount?.toString() ||
          tenant?.lotPrice?.monthly?.toString() ||
          "",
        additionalRentAmount:
          tenant?.lease?.additionalRentAmount?.toString() || "",
        depositAmount:
          tenant?.lease?.depositAmount?.toString() || tenant?.deposit || "",
        occupants:
          tenant?.lease?.occupants?.toString() || tenant?.occupants || "",
        pets:
          tenant?.lease?.pets?.petDetails &&
          tenant.lease.pets.petDetails.length > 0
            ? tenant.lease.pets.petDetails
                .map((pet) =>
                  typeof pet === "string"
                    ? pet
                    : `${(pet as any).type || "Unknown"} ${
                        (pet as any).breed || "Unknown"
                      } ${(pet as any).name || "Unknown"} ${
                        (pet as any).weight || 0
                      }`
                )
                .join(", ")
            : "",

        specialRequests: tenant?.lease?.specialRequests?.join(", ") || "",
        notes: tenant?.lease?.notes || "",
      },
      { keepDefaultValues: true }
    );

    // Reset file upload states
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setUploadedFileUrl("");
    setIsDragOver(false);

    // Set existing lease agreement URL if available
    if (tenant?.lease?.leaseAgreement) {
      setUploadedFileUrl(tenant.lease.leaseAgreement);
    }

    // Reset additional rent state
    setShowAdditionalRent(
      !!(
        tenant?.lease?.additionalRentAmount &&
        tenant.lease.additionalRentAmount > 0
      )
    );
  }, [tenant, form]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-full h-[85vh] p-0 overflow-hidden">
          <form
            className="flex h-full min-h-0 flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <DialogHeader className="sticky top-0 z-10 px-6 py-4 border-b bg-background">
              <DialogTitle className="text-xl font-semibold">
                Update Tenant: {tenant.name}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 min-h-0 px-6 py-6">
              <div className="space-y-6">
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
                      <label htmlFor="leaseType" className="block font-medium">
                        Lease Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleLeaseTypeChange("monthly")}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                            form.watch("leaseType") === "monthly"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium">Monthly</div>
                          <div className="text-xs text-gray-500">
                            Renewable monthly
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLeaseTypeChange("fixed")}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                            form.watch("leaseType") === "fixed"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium">Fixed Term</div>
                          <div className="text-xs text-gray-500">
                            Specific duration
                          </div>
                        </button>
                      </div>
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
                          readOnly
                          required
                          className="cursor-not-allowed"
                        />
                        {form.formState.errors.rentAmount && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.rentAmount.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="depositAmount">
                          Security Deposit *
                        </Label>
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
                          title="Enter pet information (e.g., Dog Golden Retriever Max 50)"
                          {...form.register("pets")}
                          placeholder="Enter pet information (e.g., Dog Golden Retriever Max 50)"
                        />
                      </div>

                      {/* Conditional Date Fields */}
                      {form.watch("leaseType") === "fixed" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="leaseStart">
                              Lease Start Date *
                            </Label>
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
                            <Label htmlFor="leaseStart">
                              Lease Start Date *
                            </Label>
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

                    {/* Additional Rent Amount Section */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="additionalRentCheckbox"
                          checked={showAdditionalRent}
                          onCheckedChange={(checked) =>
                            setShowAdditionalRent(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="additionalRentCheckbox"
                          className="text-sm font-medium"
                        >
                          Additional Rent Amount
                        </Label>
                      </div>
                      {showAdditionalRent && (
                        <div className="pl-6">
                          <Input
                            id="additionalRentAmount"
                            {...form.register("additionalRentAmount")}
                            type="number"
                            placeholder="Enter additional rent amount"
                            className="max-w-xs"
                          />
                        </div>
                      )}
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

                {/* File Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-orange-600" />
                      Lease Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Show existing lease agreement if available */}
                    {existingLeaseAgreement &&
                      !uploadedFile &&
                      uploadStatus === "idle" && (
                        <div className="mb-4">
                          <div className="border rounded-lg p-4 bg-blue-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <File className="h-8 w-8 text-blue-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Current Lease Agreement
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PDF file uploaded
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(
                                      existingLeaseAgreement,
                                      "_blank"
                                    )
                                  }
                                >
                                  View
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleRemoveExistingAgreement}
                                  disabled={isDeletingAgreement}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                                >
                                  {isDeletingAgreement ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

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
                          <span className="font-medium">Click to upload</span>{" "}
                          or drag and drop
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
                          {existingLeaseAgreement
                            ? "Upload New File"
                            : "Select File"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <File className="h-8 w-8 text-red-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {uploadedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(uploadedFile.size / (1024 * 1024)).toFixed(
                                    2
                                  )}{" "}
                                  MB
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

                        {/* Upload Progress */}
                        {uploadStatus === "uploading" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                Uploading...
                              </span>
                              <span className="text-gray-500">
                                {uploadProgress}%
                              </span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}

                        {/* Upload Success */}
                        {uploadStatus === "success" && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Upload Successful
                              </p>
                              <p className="text-xs text-green-600">
                                File is ready to be saved with tenant
                                information
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Upload Error */}
                        {uploadStatus === "error" && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-red-800">
                                Upload Failed
                              </p>
                              <p className="text-xs text-red-600">
                                Please try uploading again
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Upload Button */}
                        {uploadedFile && uploadStatus === "idle" && (
                          <Button
                            type="button"
                            onClick={() =>
                              handleFileUploadWithProgress(uploadedFile)
                            }
                            className="w-full"
                          >
                            Upload Lease Agreement
                          </Button>
                        )}

                        {/* Retry Button */}
                        {uploadStatus === "error" && (
                          <Button
                            type="button"
                            onClick={() =>
                              handleFileUploadWithProgress(uploadedFile)
                            }
                            variant="outline"
                            className="w-full"
                          >
                            Retry Upload
                          </Button>
                        )}
                      </div>
                    )}
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
              </div>
            </ScrollArea>

            {/* Actions */}
            <DialogFooter className="sticky bottom-0 z-10 gap-3 px-6 py-4 border-t bg-background sm:flex-row sm:justify-between">
              <DeleteTenantDialog
                tenant={tenant}
                onDeleteSuccess={() => onOpenChange(false)}
              />
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
                  disabled={isSubmitting || isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading
                    ? "Uploading..."
                    : isSubmitting
                    ? "Updating..."
                    : "Update Tenant"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
