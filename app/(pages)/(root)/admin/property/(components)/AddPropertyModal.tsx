"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Droplets,
  ImageIcon,
  List,
  MapPin,
  PawPrint,
  Shield,
  Toilet,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useId, useState } from "react";

import { createProperty } from "@/app/apiClient/adminApi";
import {
  AddPropertyInput,
  addPropertySchema,
} from "@/zod/addProperty.validation";

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
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

export default function AddPropertyModal() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [additionalAmenitiesInput, setAdditionalAmenitiesInput] = useState("");
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
      amenities: [],
      rules: [],
      images: [],
    },
  });

  // Reset form when dialog closes
  const handleOpenChange = (val: boolean) => {
    if (!val) {
      reset();
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

  // Initialize essential amenities when form opens
  useEffect(() => {
    if (open) {
      setValue("amenities", []);
      setAdditionalAmenitiesInput("");
    }
  }, [open, setValue]);

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
    setValue("amenities", allAmenities);
  };

  // Watch files from dropzone
  const images = watch("images") as File[];
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

  // Submit handler
  const onSubmit = async (values: AddPropertyInput) => {
    // Block submit if images are still uploading or not all uploaded
    const allImagesUploaded = (images || []).every((f) =>
      Boolean(uploadedByName[f.name])
    );
    if (isUploadingImages || (!allImagesUploaded && images.length > 0)) {
      toast.error("Please wait until images finish uploading");
      return;
    }
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
      // Send Cloudinary URLs to backend
      images: Object.values(uploadedByName).map((img) => img.secureUrl),
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

      <DialogContent className="max-w-4xl w-full h-[85vh] p-0 overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full min-h-0 flex-col"
        >
          <DialogHeader className="sticky top-0 z-10 px-6 py-4 border-b bg-background">
            <DialogTitle className="text-xl font-semibold">
              Add New Property
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
                                  )
                                );
                              } else {
                                setValue("amenities", [
                                  ...currentAmenities,
                                  amenity.name,
                                ]);
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
                toast("Property Adding Cancelled");
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                isUploadingImages ||
                (images.length > 0 &&
                  !(images || []).every((f) => Boolean(uploadedByName[f.name])))
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Saving…" : "Create Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
