"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ITenant } from "@/types/tenant.types"; // :contentReference[oaicite:0]{index=0}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Pencil, User } from "lucide-react";

interface TenantInfo {
  personal: {
    emergencyContact: string;
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
  const router = useRouter();

  useEffect(() => {
    const handle = () => setOpen(true);
    window.addEventListener("openEditProfileModal", handle);
    return () => window.removeEventListener("openEditProfileModal", handle);
  }, []);

  // react-hook-form setup with defaults
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: tenant.name,
      email: tenant.email,
      phoneNumber: tenant.phoneNumber,
      emergencyContact: tenantInfo.personal.emergencyContact,
      address: {
        property: tenantInfo.address.property,
        lot: tenantInfo.address.lot,
        street: tenantInfo.address.street,
        city: tenantInfo.address.city,
        state: tenantInfo.address.state,
        zip: tenantInfo.address.zip,
      },
    },
  });

  // reset form to latest values whenever modal opens
  useEffect(() => {
    if (open) {
      reset({
        name: tenant.name,
        email: tenant.email,
        phoneNumber: tenant.phoneNumber,
        emergencyContact: "",
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

  const onSubmit = async (data: { emergencyContact: string }) => {
    void data;
    // TEMP STUB: pretend it worked
    toast.success("Emergency contact updated (no network)");
    setOpen(false);
    router.refresh(); // so you can see changes when you hook real API
  };

  //   const onSubmit = async (data: { emergencyContact: string }) => {
  //     try {
  //       const res = await updateTenant({
  //         id: tenant._id!,
  //         emergencyContact: data.emergencyContact,
  //       });
  //       if (res.success) {
  //         toast.success("Emergency contact updated");
  //         setOpen(false);
  //         router.refresh();
  //       } else {
  //         toast.error(res.message || "Update failed");
  //       }
  //     } catch {
  //       toast.error("Failed to update");
  //     }
  //   };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 !px-8">
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full h-[80vh] flex flex-col bg-white">
        <DialogHeader className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogClose className="p-2 hover:bg-gray-100 rounded-full" />
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
        >
          {/* Personal Information Card */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input readOnly {...register("name")} />
                </div>
                <div className="space-y-1">
                  <Label>Phone Number</Label>
                  <Input readOnly {...register("phoneNumber")} />
                </div>
                <div className="space-y-1">
                  <Label>Email Address</Label>
                  <Input readOnly {...register("email")} />
                </div>
                {/* Emergency Contact */}
                <div className="space-y-1">
                  <Label>Emergency Contact</Label>
                  <Input
                    className="bg-red-100"
                    {...register("emergencyContact", { required: true })}
                    placeholder="Enter emergency contact"
                  />
                  {errors.emergencyContact && (
                    <p className="text-red-600 text-sm">Required</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tenant Address Card */}
          {/* Tenant Address Card */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                Tenant Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="property">Property</Label>
                  <Input
                    id="property"
                    readOnly
                    {...register("address.property")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lot">Lot Number</Label>
                  <Input id="lot" readOnly {...register("address.lot")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="street">Street</Label>
                  <Input id="street" {...register("address.street")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("address.city")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...register("address.state")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" {...register("address.zip")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
