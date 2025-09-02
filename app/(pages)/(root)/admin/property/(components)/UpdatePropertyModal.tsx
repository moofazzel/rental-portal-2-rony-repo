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

import {
  uploadToCloudinaryAction,
  type CloudinaryUploadResult,
} from "@/app/actions/cloudinary-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  CheckCircle,
  Droplets,
  Image as ImageIcon,
  List,
  MapPin,
  PawPrint,
  Shield,
  Toilet,
  Wifi,
  Zap,
} from "lucide-react";
import ImageDropzone from "./ImageDropzone";

// Essential amenities configuration with icons
const ESSENTIAL_AMENITIES = [
  { name: "30 AMP", icon: Zap, category: "Electrical" },
  { name: "50 AMP", icon: Zap, category: "Electrical" },
  { name: "WiFi", icon: Wifi, category: "Connectivity" },
  { name: "Water Hookup", icon: Droplets, category: "Utilities" },
  { name: "Sewer Hookup", icon: Toilet, category: "Utilities" },
  { name: "Pet Friendly", icon: PawPrint, category: "Policies" },
  { name: "Security", icon: Shield, category: "Security" },
];

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
  const [additionalAmenitiesInput, setAdditionalAmenitiesInput] = useState("");

  // Cloudinary upload state
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    CloudinaryUploadResult[]
  >([]);
  const [uploadedFileNames, setUploadedFileNames] = useState<Set<string>>(
    () => new Set()
  );
  const [uploadingNames, setUploadingNames] = useState<Set<string>>(
    () => new Set()
  );
  const [uploadedByName, setUploadedByName] = useState<
    Record<string, CloudinaryUploadResult>
  >({});

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
      identifierType: property.identifierType || "lotNumber",
      amenities: property.amenities || [],
      rules: property.rules || [],
      totalLots: property.totalLots,
      availableLots: property.availableLots,
      isActive: property.isActive,
      images: [],
    },
  });

  // Reset form when dialog closes
  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setAdditionalAmenitiesInput("");
      // Clear upload states on close
      setUploadedImages([]);
      setUploadedFileNames(new Set());
      setUploadingNames(new Set());
      setUploadedByName({});
      setIsUploadingImages(false);
    }
    setOpen(val);
  };

  // Initialize amenities when form opens - only show what was originally added
  useEffect(() => {
    if (open) {
      // Keep only the amenities that were originally in the property
      // Don't automatically add missing essential amenities
      const originalAmenities = property.amenities || [];
      setValue("amenities", originalAmenities);

      // Initialize additional amenities input with non-essential amenities
      const nonEssentialAmenities = originalAmenities.filter(
        (item) => !ESSENTIAL_AMENITIES.map((a) => a.name).includes(item)
      );
      setAdditionalAmenitiesInput(nonEssentialAmenities.join(", "));
    }
  }, [open, setValue, property.amenities]);

  // Handle additional amenities input
  const handleAdditionalAmenities = (value: string) => {
    setAdditionalAmenitiesInput(value);

    const additionalAmenities = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Get current essential amenities (those that are selected from the predefined list)
    const currentAmenities = watch("amenities") || [];
    const essentialAmenityNames = ESSENTIAL_AMENITIES.map((a) => a.name);
    const selectedEssentialAmenities = currentAmenities.filter((amenity) =>
      essentialAmenityNames.includes(amenity)
    );

    // Combine selected essential amenities with additional amenities
    const allAmenities = [
      ...selectedEssentialAmenities,
      ...additionalAmenities,
    ];
    setValue("amenities", allAmenities, { shouldDirty: true });
  };

  // Watch files from dropzone
  const images = watch("images") as File[];

  useEffect(() => {
    const uploadNewFiles = async () => {
      if (!images || images.length === 0) return;
      // Filter only files that are not uploaded yet and not currently uploading
      const newFiles = images.filter(
        (f) => !uploadedFileNames.has(f.name) && !uploadingNames.has(f.name)
      );
      if (newFiles.length === 0) return;

      setIsUploadingImages(true);
      try {
        setUploadingNames((prev) => {
          const next = new Set(prev);
          newFiles.forEach((f) => next.add(f.name));
          return next;
        });

        const results = await Promise.all(
          newFiles.map(async (file) => {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("folder", "properties");
            const result = await uploadToCloudinaryAction(fd);
            if (!result.success) {
              throw new Error(result.error);
            }
            return { fileName: file.name, data: result.data };
          })
        );

        setUploadedImages((prev) => [...prev, ...results.map((r) => r.data)]);
        setUploadedByName((prev) => {
          const next = { ...prev };
          results.forEach(({ fileName, data }) => {
            next[fileName] = data;
          });
          return next;
        });
        setUploadedFileNames((prev) => {
          const next = new Set(prev);
          newFiles.forEach((f) => next.add(f.name));
          return next;
        });
        toast.success(`${results.length} image(s) uploaded`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast.error(message);
      } finally {
        setUploadingNames((prev) => {
          const next = new Set(prev);
          newFiles.forEach((f) => next.delete(f.name));
          return next;
        });
        setIsUploadingImages(false);
      }
    };

    void uploadNewFiles();
    // Only re-run when files list changes length or different names are added
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // autofocus on open
  useEffect(() => {
    if (open) {
      document.getElementById(`${id}-name`)?.focus();
    }
  }, [open, id]);

  const onSubmit: SubmitHandler<UpdatePropertyInput> = (vals) => {
    // Block submit if images are still uploading or not all uploaded
    const allImagesUploaded = (images || []).every((f) =>
      Boolean(uploadedByName[f.name])
    );
    if (isUploadingImages || (!allImagesUploaded && images.length > 0)) {
      toast.error("Please wait until images finish uploading");
      return;
    }

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
      identifierType:
        vals.identifierType || property.identifierType || "lotNumber",
      amenities: vals.amenities || [],
      rules: vals.rules || [],
      totalLots: vals.totalLots || 0,
      availableLots: vals.availableLots || 0,
      isActive: vals.isActive ?? true,
      // Send Cloudinary URLs to backend if new images uploaded, otherwise keep existing
      images:
        Object.values(uploadedByName).length > 0
          ? Object.values(uploadedByName).map((img) => img.secureUrl)
          : property.images || [],
    };

    start(async () => {
      if (!property?._id) {
        toast.error("Property ID is required");
        return;
      }

      try {
        const res = await updateProperty({
          propertyId: property._id,
          data: dto,
        });
        console.log("🚀 ~ res:", res);
        if (res.statusCode === 404) {
          toast.error("Something went wrong");
          return;
        }
        if (res.success) {
          toast.success("Property updated successfully");
        }

        handleOpenChange(false);
        router.refresh();
      } catch {
        toast.error("Failed to update community");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {/* <Button size="lg" variant="outline" className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Edit Property
        </Button> */}

        <button className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-2 py-2 border border-blue-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Update Property</p>
              </div>
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full h-[85vh] p-0 overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full min-h-0 flex-col"
        >
          <DialogHeader className="sticky top-0 z-10 px-6 py-4 border-b bg-background">
            <DialogTitle className="text-xl font-semibold">
              Edit Property: {property.name}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 px-6 py-6">
            <div className="space-y-6">
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
                      <p className="text-red-600 text-sm">
                        {errors.name.message}
                      </p>
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
                  {(["street", "city", "state", "zip"] as const).map(
                    (field) => (
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
                    )
                  )}
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardHeader className="">
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
                        defaultValue={property.identifierType || "lotNumber"}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="lotNumber">Lot Number</option>
                        <option value="roadNumber">Road Number</option>
                      </select>
                      {errors.identifierType && (
                        <p className="text-red-600 text-sm">
                          {errors.identifierType.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`${id}-rules`}
                        className="block font-medium"
                      >
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
                          setValue("rules", rules, { shouldDirty: true });
                        }}
                        defaultValue={property.rules?.join(", ") || ""}
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
                      placeholder="e.g. Pool, Laundry, Clubhouse (separate with commas)"
                      value={additionalAmenitiesInput}
                      onChange={(e) =>
                        handleAdditionalAmenities(e.target.value)
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add any additional amenities beyond the essentials
                    </p>
                    {errors.amenities && (
                      <p className="text-red-600 text-sm">
                        {errors.amenities.message}
                      </p>
                    )}
                  </div>

                  {/* Essential Amenities */}
                  <div>
                    <label className="block font-medium mb-3">
                      Essential Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ESSENTIAL_AMENITIES.map((amenity) => {
                        const AmenityIcon = amenity.icon;
                        const isSelected = (watch("amenities") || []).includes(
                          amenity.name
                        );
                        return (
                          <button
                            key={amenity.name}
                            type="button"
                            onClick={() => {
                              const currentAmenities = watch("amenities") || [];
                              if (isSelected) {
                                setValue(
                                  "amenities",
                                  currentAmenities.filter(
                                    (item) => item !== amenity.name
                                  ),
                                  { shouldDirty: true }
                                );
                              } else {
                                setValue(
                                  "amenities",
                                  [...currentAmenities, amenity.name],
                                  { shouldDirty: true }
                                );
                              }
                            }}
                            className={`flex items-center space-x-3 p-3 rounded-lg border-2 font-medium transition-all text-left ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <AmenityIcon
                              className={`h-5 w-5 ${
                                isSelected ? "text-blue-600" : "text-gray-500"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {amenity.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {amenity.category}
                              </div>
                            </div>
                          </button>
                        );
                      })}
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
                <CardContent className="space-y-4">
                  <ImageDropzone
                    images={images}
                    setImages={(files) =>
                      setValue("images", files, { shouldValidate: true })
                    }
                    disabled={isUploadingImages}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((file, idx) => {
                      const uploaded = uploadedByName[file.name];
                      const isUploading = uploadingNames.has(file.name);
                      if (uploaded) {
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={file.name + idx}
                            src={uploaded.secureUrl}
                            alt={file.name}
                            className="w-full h-24 object-cover rounded border"
                          />
                        );
                      }
                      return (
                        <div key={file.name + idx} className="relative">
                          {isUploading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                            </div>
                          )}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className={`w-full h-24 object-cover rounded border ${
                              isUploading ? "opacity-60" : ""
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          {/* Actions */}
          <DialogFooter className="sticky bottom-0 z-10 gap-3 px-6 py-4 border-t bg-background sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                handleOpenChange(false);
                toast("Changes cancelled");
              }}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                pending ||
                !isDirty ||
                isUploadingImages ||
                (images.length > 0 &&
                  !(images || []).every((f) => Boolean(uploadedByName[f.name])))
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {pending ? "Updating..." : "Update Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
