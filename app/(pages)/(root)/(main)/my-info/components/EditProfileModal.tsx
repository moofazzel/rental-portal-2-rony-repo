"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateEmergencyContact } from "@/app/apiClient/tenantApi";
import { ITenant } from "@/types/tenant.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Pencil, Save, User } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Custom styles for phone input
const phoneInputStyles = `
  .react-tel-input .form-control {
    height: 32px !important;
    font-size: 14px !important;
    border-radius: 6px !important;
    border: 1px solid #d1d5db !important;
    padding-left: 48px !important;
  }
  .react-tel-input .form-control:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 1px #3b82f6 !important;
  }
  .react-tel-input .flag-dropdown {
    border-radius: 6px 0 0 6px !important;
    border: 1px solid #d1d5db !important;
  }
  .react-tel-input .flag-dropdown.open {
    border-color: #3b82f6 !important;
  }
  .react-tel-input .selected-flag {
    height: 32px !important;
    padding: 0 0 0 8px !important;
  }
  .react-tel-input .country-list {
    font-size: 14px !important;
    max-height: 200px !important;
  }
`;

interface TenantInfo {
  personal: {
    emergencyContact: {
      name: string;
      phone: string;
      relationship?: string;
    };
  };
  address: {
    property: string;
    lot: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface EditProfileModalProps {
  tenant: ITenant;
  tenantInfo: TenantInfo;
}

export default function EditProfileModal({
  tenant,
  tenantInfo,
}: EditProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handle = () => setOpen(true);
    window.addEventListener("openEditProfileModal", handle);
    return () => window.removeEventListener("openEditProfileModal", handle);
  }, []);

  // Auto-focus emergency contact input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        const phoneInput = document.querySelector(
          ".react-tel-input input"
        ) as HTMLInputElement;
        if (phoneInput) {
          phoneInput.focus();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: tenant.name,
      email: tenant.email,
      phoneNumber: tenant.phoneNumber,
      emergencyContact: tenantInfo.personal.emergencyContact?.phone || "",
      address: {
        property: tenantInfo.address.property,
        lot: tenantInfo.address.lot,
        street: tenantInfo.address.street,
        city: tenantInfo.address.city,
        state: tenantInfo.address.state,
        zip: tenantInfo.address.zip,
      },
    },
    mode: "onChange",
  });

  const emergencyContactValue = watch("emergencyContact");

  // Register emergency contact with validation
  const emergencyContactField = register("emergencyContact", {
    required: "Emergency contact phone is required",
    validate: (value) => {
      if (!value) {
        return "Emergency contact phone is required";
      }
      // Remove any non-digit characters for validation
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        return "Phone number must be at least 10 digits";
      }
      return true;
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        name: tenant.name,
        email: tenant.email,
        phoneNumber: tenant.phoneNumber,
        emergencyContact: tenantInfo.personal.emergencyContact?.phone || "",
        address: {
          property: tenantInfo.address.property,
          lot: tenantInfo.address.lot,
          street: tenantInfo.address.street,
          city: tenantInfo.address.city,
          state: tenantInfo.address.state,
          zip: tenantInfo.address.zip,
        },
      });
    }
  }, [open, tenant, tenantInfo, reset]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (!data.emergencyContact) {
        toast.error("Emergency contact is required");
        return;
      }

      const response = await updateEmergencyContact({
        phone: data.emergencyContact,
      });

      if (response.success) {
        toast.success("Emergency contact updated successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update emergency contact");
      }
    } catch (error) {
      toast.error("Failed to update emergency contact");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: phoneInputStyles }} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl w-full flex flex-col bg-white p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Edit Profile
                </DialogTitle>
                <p className="text-xs text-gray-600">
                  Update your personal information and address details
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 min-h-0 px-6 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Personal Information */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                      <User className="w-3 h-3 text-blue-600" />
                    </div>
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        {...register("email")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        {...register("phoneNumber")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="emergency"
                        className="text-xs font-medium"
                      >
                        Emergency Contact Phone *
                      </Label>

                      {/* Show current emergency contact info if exists */}
                      {tenantInfo.personal.emergencyContact?.name && (
                        <div className="mb-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium">
                            Current: {tenantInfo.personal.emergencyContact.name}
                          </p>
                          {tenantInfo.personal.emergencyContact
                            .relationship && (
                            <p className="text-xs text-blue-600">
                              Relationship:{" "}
                              {
                                tenantInfo.personal.emergencyContact
                                  .relationship
                              }
                            </p>
                          )}
                        </div>
                      )}

                      <PhoneInput
                        key={`emergency-${open}`}
                        country={"us"}
                        value={emergencyContactValue || ""}
                        onChange={(phone) => {
                          setValue("emergencyContact", phone, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        onBlur={emergencyContactField.onBlur}
                        inputClass={
                          errors.emergencyContact
                            ? "border-red-300 text-sm h-8 !w-full"
                            : "text-sm h-8 !w-full"
                        }
                        containerClass="w-full"
                        buttonClass="h-8"
                        dropdownClass="text-sm"
                        enableSearch={true}
                        searchPlaceholder="Search country..."
                        inputProps={{
                          required: true,
                          placeholder: "Enter phone number",
                        }}
                      />
                      {errors.emergencyContact && (
                        <p className="text-red-600 text-xs">
                          {errors.emergencyContact.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-green-600" />
                    </div>
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="property" className="text-xs font-medium">
                        Property
                      </Label>
                      <Input
                        id="property"
                        {...register("address.property")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lot" className="text-xs font-medium">
                        Lot Number
                      </Label>
                      <Input
                        id="lot"
                        {...register("address.lot")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="street" className="text-xs font-medium">
                        Street Address
                      </Label>
                      <Input
                        id="street"
                        {...register("address.street")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="city" className="text-xs font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        {...register("address.city")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="state" className="text-xs font-medium">
                        State
                      </Label>
                      <Input
                        id="state"
                        {...register("address.state")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="zip" className="text-xs font-medium">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        {...register("address.zip")}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed text-sm h-8"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  className="text-xs px-3 py-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
