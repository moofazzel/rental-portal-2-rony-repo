"use client";

import { deleteSpotById, updateSpotById } from "@/app/apiClient/adminApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ISpot, UpdateSpotInput } from "@/types/properties.type";
import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Droplets,
  Info,
  Loader2,
  MapPin,
  PawPrint,
  Ruler,
  Save,
  Shield,
  Toilet,
  Trash2,
  Wifi,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type LotType = "RV Lot" | "MH - Single" | "MH - Double" | "Storage";

interface Props {
  spot: ISpot;
  onClose: () => void;
  propertyAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  identifierType: "lotNumber" | "roadNumber";
  availableAmenities: string[];
}

export default function EditLotModal({
  spot,
  onClose,
  propertyAddress,
  identifierType,
  availableAmenities,
}: Props) {
  const [form, setForm] = useState<UpdateSpotInput & { lotType: LotType }>({
    spotNumber: spot.spotNumber,
    status: spot.status,
    size: { ...spot.size },
    price: { ...spot.price },
    description: spot.description,
    amenities: spot.amenities || [],
    isActive: spot.isActive,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lotType: (spot as any).lotType || "RV Lot", // Default to RV Lot if not set
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  // Amenity icon mapping
  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<
      string,
      React.ComponentType<{ className?: string }>
    > = {
      "30 AMP": Zap,
      "50 AMP": Zap,
      WiFi: Wifi,
      "Water Hookup": Droplets,
      "Sewer Hookup": Toilet,
      "Pet Friendly": PawPrint,
      Security: Shield,
    };
    return iconMap[amenity] || CheckCircle;
  };

  // DELETE handler
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteSpotById(spot.id);
      if (!res.success) {
        toast.error(res.message || "Failed to delete lot");
        return;
      }
      toast.success("Lot deleted successfully");
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to delete spot:", error);
      toast.error("Failed to delete lot");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // SAVE handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.spotNumber?.trim()) {
      toast.error("Spot Number is required");
      return;
    }

    if (!form.lotType) {
      toast.error("Lot Type is required");
      return;
    }

    if (!form.description?.trim()) {
      toast.error("Description is required");
      return;
    }

    const formData = {
      ...form,
      lotIdentifier: form.spotNumber, // Backward compatibility with backend
    };

    setSaving(true);
    try {
      const res = await updateSpotById(spot.id, formData);
      if (res.success) {
        toast.success("Changes saved successfully");
        onClose();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to save changes");
      }
    } catch (error) {
      console.error("Failed to update spot:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // status badge styling
  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "AVAILABLE":
        return "default";
      case "MAINTENANCE":
        return "destructive";
      case "RESERVED":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl w-full h-[85vh] p-0 overflow-hidden">
          <form className="flex h-full min-h-0 flex-col" onSubmit={handleSave}>
            <DialogHeader className="sticky top-0 z-10 px-6 py-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold">
                      Edit Lot Details
                    </DialogTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Spot #{spot.spotNumber}
                      </span>
                      <Badge variant={getStatusVariant(spot.status)}>
                        {spot.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 min-h-0 px-6 py-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <div className="p-1 bg-blue-100 rounded">
                        <Info className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="spotNumber">Spot Number</Label>
                        <Input
                          id="spotNumber"
                          value={form.spotNumber ?? ""}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              spotNumber: e.target.value,
                            }))
                          }
                          placeholder={
                            identifierType === "lotNumber"
                              ? "e.g., A1, B2, C3"
                              : "e.g., 33031, 33032, 33033"
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={form.status}
                          onValueChange={(value) =>
                            setForm((f) => ({
                              ...f,
                              status: value as ISpot["status"],
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {["AVAILABLE", "MAINTENANCE", "RESERVED"].map(
                              (s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lotType">
                        Lot Type <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="lotType"
                        value={form.lotType}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            lotType: e.target.value as LotType,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="RV Lot">RV Lot</option>
                        <option value="MH - Single">MH - Single</option>
                        <option value="MH - Double">MH - Double</option>
                        <option value="Storage">Storage</option>
                      </select>
                    </div>

                    {/* Lot Address Preview */}
                    {form.spotNumber && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <label className="text-sm font-medium text-blue-700 mb-2 block">
                          Lot Address Preview
                        </label>
                        <div className="text-blue-800 font-mono text-sm">
                          {identifierType === "roadNumber" ? (
                            <>
                              <div className="font-medium">
                                {form.spotNumber} {propertyAddress.street}
                              </div>
                              <div>
                                {propertyAddress.city}, {propertyAddress.state}{" "}
                                {propertyAddress.zip}
                              </div>
                              <div className="text-blue-600">
                                {propertyAddress.country}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-medium">
                                {propertyAddress.street} <br />{" "}
                                {form.spotNumber}
                              </div>
                              <div>
                                {propertyAddress.city}, {propertyAddress.state}{" "}
                                {propertyAddress.zip}
                              </div>
                              <div className="text-blue-600">
                                {propertyAddress.country}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <div className="p-1 bg-orange-100 rounded">
                        <CheckCircle className="w-4 h-4 text-orange-600" />
                      </div>
                      <span>Amenities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableAmenities.map((amenity) => {
                        const isSelected =
                          form.amenities?.includes(amenity) || false;
                        const AmenityIcon = getAmenityIcon(amenity);
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => {
                              const currentAmenities = form.amenities || [];
                              if (isSelected) {
                                setForm((f) => ({
                                  ...f,
                                  amenities: currentAmenities.filter(
                                    (a) => a !== amenity
                                  ),
                                }));
                              } else {
                                setForm((f) => ({
                                  ...f,
                                  amenities: [...currentAmenities, amenity],
                                }));
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
                                {amenity}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Dimensions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <div className="p-1 bg-green-100 rounded">
                        <Ruler className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Dimensions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="length" className="block font-medium">
                          Length (ft)
                        </label>
                        <Input
                          id="length"
                          type="number"
                          value={form.size?.length?.toString() ?? ""}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              size: { ...f.size!, length: +e.target.value },
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="width" className="block font-medium">
                          Width (ft)
                        </label>
                        <Input
                          id="width"
                          type="number"
                          value={form.size?.width?.toString() ?? ""}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              size: { ...f.size!, width: +e.target.value },
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                    {form.size &&
                      form.size.length > 0 &&
                      form.size.width > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          Total Area: {form.size.length * form.size.width} sq ft
                        </Badge>
                      )}
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <div className="p-1 bg-yellow-100 rounded">
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span>Pricing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Input
                        id="price"
                        type="number"
                        value={(() => {
                          if (form.price?.daily && form.price.daily > 0)
                            return form.price.daily.toString();
                          if (form.price?.weekly && form.price.weekly > 0)
                            return form.price.weekly.toString();
                          if (form.price?.monthly && form.price.monthly > 0)
                            return form.price.monthly.toString();
                          return "";
                        })()}
                        onChange={(e) => {
                          const value = +e.target.value;
                          const period =
                            (
                              document.getElementById(
                                "pricePeriod"
                              ) as HTMLSelectElement
                            )?.value || "monthly";
                          setForm((f) => ({
                            ...f,
                            price: {
                              daily: period === "daily" ? value : 0,
                              weekly: period === "weekly" ? value : 0,
                              monthly: period === "monthly" ? value : 0,
                            },
                          }));
                        }}
                        placeholder="Enter Price e.g. 100"
                        min="0"
                        className="flex-1"
                      />
                      <select
                        id="pricePeriod"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        defaultValue="monthly"
                        onChange={(e) => {
                          const value = parseFloat(
                            (
                              document.getElementById(
                                "price"
                              ) as HTMLInputElement
                            )?.value || "0"
                          );
                          setForm((f) => ({
                            ...f,
                            price: {
                              daily: e.target.value === "daily" ? value : 0,
                              weekly: e.target.value === "weekly" ? value : 0,
                              monthly: e.target.value === "monthly" ? value : 0,
                            },
                          }));
                        }}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <div className="p-1 bg-indigo-100 rounded">
                        <Info className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span>Description</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="block font-medium"
                      >
                        Lot Description
                      </label>
                      <Textarea
                        id="description"
                        value={form.description ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter detailed description of the lot..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            {/* Actions */}
            <DialogFooter className="sticky bottom-0 z-10 gap-3 px-6 py-4 border-t bg-background sm:flex-row sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                title="Delete lot"
                className="!px-2 text-white border bg-destructive hover:border-red-500 hover:text-black group"
              >
                {deleting ? (
                  <Loader2 className=" animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 group-hover:text-red-500" />
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="!px-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-1 bg-red-100 rounded">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              Delete Lot
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>Spot #{spot.spotNumber}</strong>? This action cannot be
              undone and will permanently remove this lot from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white !px-2"
            >
              {deleting ? (
                <>
                  <Loader2 className=" animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 />
                  Delete Lot
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
