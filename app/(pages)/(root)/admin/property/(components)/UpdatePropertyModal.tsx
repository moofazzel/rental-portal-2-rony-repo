"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateProperty } from "@/app/apiClient/adminApi";
import { IProperty, IPropertyFull } from "@/types/properties.type";
import {
  UpdatePropertyInput,
  updatePropertySchema,
} from "@/zod/updateProperty.validation";

import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Edit3,
  Image as ImageIcon,
  MapPin,
  Settings,
} from "lucide-react";
import Image from "next/image";

interface Props {
  property: IPropertyFull;
}

// helper to coerce comma-string or array into string[]
const toStringArray = (v: unknown): string[] => {
  if (typeof v === "string") {
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(v)) {
    return v as string[];
  }
  return [];
};

export default function UpdatePropertyModal({ property }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();
  const id = useId();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UpdatePropertyInput>({
    resolver: zodResolver(
      updatePropertySchema
    ) as Resolver<UpdatePropertyInput>,
    defaultValues: {
      name: property.name,
      description: property.description || "",
      address: {
        street: property.address.street,
        city: property.address.city,
        state: property.address.state || "",
        zip: property.address.zip,
        country: property.address.country || "US",
      },
      amenities: property.amenities || [],
      rules: property.rules || [],
      totalLots: property.totalLots,
      availableLots: property.availableLots,
      isActive: property.isActive,
      images: [],
    },
  });

  // autofocus on open
  useEffect(() => {
    if (open) {
      document.getElementById(`${id}-name`)?.focus();
    }
  }, [open, id]);

  // preview image files
  const images = watch("images") as File[];
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue("images", e.target.files ? Array.from(e.target.files) : [], {
      shouldValidate: true,
    });

  const onSubmit: SubmitHandler<UpdatePropertyInput> = (vals) => {
    const dto: IProperty = {
      name: vals.name,
      description: vals.description || "",
      address: {
        street: vals.address.street,
        city: vals.address.city,
        state: vals.address.state || "",
        zip: vals.address.zip,
        country: "US", // Default to US since country field is required
      },
      identifierType: property.identifierType || "lotNumber", // Use existing or default to lotNumber
      amenities: vals.amenities || [],
      rules: vals.rules || [],
      totalLots: vals.totalLots || 0,
      availableLots: vals.availableLots || 0,
      isActive: vals.isActive ?? true,
      images: vals.images?.map((f) => f.name) || [],
    };

    start(async () => {
      try {
        await updateProperty({ propertyId: property.id || "", data: dto });
        toast.success("Property updated successfully");
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Failed to update community");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Edit Property
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="sticky top-0 bg-white z-50 px-6 py-4 flex items-center justify-between overflow-visible">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5 text-blue-600" />
            Edit Property: {property.name}
          </DialogTitle>
          <DialogClose className="relative -mt-4 -mr-4 p-2 hover:bg-gray-100 rounded-full z-50" />
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto pt-6 pb-6 px-6 space-y-6"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" /> Basic
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>Community Name</Label>
                <Input
                  id={`${id}-name`}
                  {...register("name")}
                  autoFocus
                  placeholder="Enter property name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-desc`}>Description</Label>
                <Textarea
                  id={`${id}-desc`}
                  rows={4}
                  {...register("description")}
                  placeholder="Describe the property..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" /> Address
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["street", "city", "state", "zip"] as const).map((k) => (
                <div key={k} className="space-y-2">
                  <Label htmlFor={`${id}-${k}`}>
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </Label>
                  <Input
                    id={`${id}-${k}`}
                    {...register(`address.${k}` as const)}
                    placeholder={`Enter ${k}`}
                  />
                  {errors.address?.[k] && (
                    <p className="text-sm text-red-600">
                      {errors.address[k]?.message}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-600" /> Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-amenities`}>
                  Amenities
                  <span className="text-[10px] font-normal">
                    (comma separated)
                  </span>
                </Label>
                <Input
                  id={`${id}-amenities`}
                  {...register("amenities", { setValueAs: toStringArray })}
                  placeholder="WiFi, Parking, Pool..."
                />
                {errors.amenities && (
                  <p className="text-sm text-red-600">
                    {errors.amenities.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-rules`}>
                  Rules
                  <span className="text-[10px] font-normal">
                    (comma separated)
                  </span>
                </Label>
                <Input
                  id={`${id}-rules`}
                  {...register("rules", { setValueAs: toStringArray })}
                  placeholder="No pets, Quiet hours..."
                />
                {errors.rules && (
                  <p className="text-sm text-red-600">{errors.rules.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-orange-600" /> Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Upload Images</Label>
              <Input type="file" multiple accept="image/*" onChange={onFiles} />
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {images.map((f, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover w-full h-24"
                      />
                      <Badge className="absolute top-1 right-1 text-xs">
                        {f.name}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                toast("Changes cancelled");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending || !isDirty}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {pending ? "Updating..." : "Update Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
