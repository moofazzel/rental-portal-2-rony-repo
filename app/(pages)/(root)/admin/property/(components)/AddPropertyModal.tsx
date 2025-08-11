"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, ImageIcon, List, MapPin } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { createProperty } from "@/app/apiClient/adminApi";
import {
  AddPropertyInput,
  addPropertySchema,
} from "@/zod/addProperty.validation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddPropertyModal() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddPropertyInput>({
    resolver: zodResolver(addPropertySchema) as Resolver<AddPropertyInput>,
    defaultValues: {
      name: "",
      description: "",
      address: { street: "", city: "", state: "", zip: "", country: "" },
      identifierType: "lotNumber",
      amenities: ["30 AMP", "50 AMP"],
      rules: [],
      images: [],
    },
  });

  // Reset form when dialog closes
  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    setOpen(val);
  };

  // Initialize electric amenities when form opens
  useEffect(() => {
    if (open) {
      setValue("amenities", ["30 AMP", "50 AMP"]);
    }
  }, [open, setValue]);

  // Handle additional amenities input
  const handleAdditionalAmenities = (value: string) => {
    const additionalAmenities = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Combine electric amenities with additional amenities
    const electricAmenities = ["30 AMP", "50 AMP"];
    const allAmenities = [...electricAmenities, ...additionalAmenities];
    setValue("amenities", allAmenities);
  };

  // Watch files for preview
  const images = watch("images") as File[];
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("images", e.target.files ? Array.from(e.target.files) : [], {
      shouldValidate: true,
    });
  };

  // Submit handler
  const onSubmit = async (values: AddPropertyInput) => {
    console.log("Form submitted with values:", values);
    console.log("Form errors:", errors);

    // Build DTO to match CreatePropertyDto
    const dto = {
      name: values.name,
      description: values.description,
      address: {
        ...values.address,
        state: values.address.state || "",
        country: values.address.country || "",
      },
      identifierType: values.identifierType,
      amenities: values.amenities,
      rules: values.rules ?? [],
      images: values.images?.map((f: File) => f.name) ?? [],
      totalLots: 0,
      availableLots: 0,
      isActive: true,
    };

    console.log("DTO being sent:", dto);

    try {
      setIsLoading(true);
      console.log("Calling createProperty API...");
      const res = await createProperty(dto);
      console.log("API response:", res);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      handleOpenChange(false);
      // Revalidate the property route to refresh the data
      router.refresh();
    } catch (error) {
      console.error("Error creating property:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Autofocus on open
  useEffect(() => {
    if (open) {
      document.getElementById(`${id}-name`)?.focus();
    }
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Property</Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-full h-[80vh] flex flex-col bg-white">
        <DialogHeader className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Add New Property
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 bg-red-500" />
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
        >
          {/* Hidden country for validation */}
          <input type="hidden" {...register("address.country")} />

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" /> Basic
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor={`${id}-name`} className="block font-medium">
                  Name
                </label>
                <Input
                  id={`${id}-name`}
                  placeholder="Property name"
                  {...register("name")}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor={`${id}-desc`} className="block font-medium">
                  Description
                </label>
                <Textarea
                  id={`${id}-desc`}
                  rows={3}
                  placeholder="Describe the property..."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" /> Address
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["street", "city", "state", "zip"] as const).map((field) => (
                <div key={field}>
                  <label
                    htmlFor={`${id}-${field}`}
                    className="block font-medium"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <Input
                    id={`${id}-${field}`}
                    placeholder={field}
                    {...register(`address.${field}` as const)}
                    className="placeholder:capitalize"
                  />
                  {errors.address?.[field] && (
                    <p className="text-red-600 text-sm">
                      {errors.address[field]?.message}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-purple-600" /> Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`${id}-identifierType`}
                    className="block font-medium"
                  >
                    Lot Identification Type
                  </label>
                  <select
                    id={`${id}-identifierType`}
                    {...register("identifierType")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lotNumber">Lot Number (e.g., A1, B2)</option>
                    <option value="roadNumber">
                      Road Number (e.g., 33031)
                    </option>
                  </select>
                  {errors.identifierType && (
                    <p className="text-red-600 text-sm">
                      {errors.identifierType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${id}-rules`} className="block font-medium">
                    Rules
                  </label>
                  <Input
                    id={`${id}-rules`}
                    placeholder="e.g. No smoking (separate with commas)"
                    onChange={(e) => {
                      const rules = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setValue("rules", rules);
                    }}
                  />
                  {errors.rules && (
                    <p className="text-red-600 text-sm">
                      {errors.rules.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor={`${id}-amenities`}
                  className="block font-medium"
                >
                  Additional Amenities
                </label>
                <Input
                  id={`${id}-amenities`}
                  placeholder="e.g. Pool, Gym (separate with commas)"
                  onChange={(e) => handleAdditionalAmenities(e.target.value)}
                />
                {errors.amenities && (
                  <p className="text-red-600 text-sm">
                    {errors.amenities.message}
                  </p>
                )}
              </div>

              {/* Electric */}
              <div>
                <label className="block font-medium mb-2">Electric</label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="30amp"
                      defaultChecked
                      onCheckedChange={(checked) => {
                        const currentAmenities = watch("amenities") || [];
                        if (checked) {
                          setValue("amenities", [
                            ...currentAmenities,
                            "30 AMP",
                          ]);
                        } else {
                          setValue(
                            "amenities",
                            currentAmenities.filter((item) => item !== "30 AMP")
                          );
                        }
                      }}
                    />
                    <label htmlFor="30amp" className="text-sm font-medium">
                      30 AMP
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="50amp"
                      defaultChecked
                      onCheckedChange={(checked) => {
                        const currentAmenities = watch("amenities") || [];
                        if (checked) {
                          setValue("amenities", [
                            ...currentAmenities,
                            "50 AMP",
                          ]);
                        } else {
                          setValue(
                            "amenities",
                            currentAmenities.filter((item) => item !== "50 AMP")
                          );
                        }
                      }}
                    />
                    <label htmlFor="50amp" className="text-sm font-medium">
                      50 AMP
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-orange-600" /> Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onFiles}
                className="block w-full text-sm text-gray-600"
              />
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {images.map((file, idx) => (
                    <Image
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={96}
                      height={96}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                handleOpenChange(false);
                toast("Property Adding Cancelled");
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Saving…" : "Create Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
