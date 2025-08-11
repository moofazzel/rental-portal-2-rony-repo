"use client";

import { createSpot } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ICreateSpot, ISpot } from "@/types/properties.type";
import { CheckCircle, DollarSign, Home, Plus, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AddSpotModalProps {
  propertyId: string;
  amenities: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  identifierType: "lotNumber" | "roadNumber";
}

type LotType = "RV Lot" | "MH - Single" | "MH - Double" | "Storage";

export default function AddLotModal({
  propertyId,
  amenities,
  address,
  identifierType,
}: AddSpotModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Seed initial form with parent amenities
  const getInitialForm = (): ICreateSpot & { lotType: LotType } => ({
    spotNumber: "",
    propertyId,
    status: "AVAILABLE",
    size: { length: 0, width: 0 },
    amenities: [], // Start with empty amenities array
    price: { daily: 0, weekly: 0, monthly: 0 },
    description: "",
    images: [],
    lotType: "RV Lot",
  });
  const [form, setForm] = useState<ICreateSpot & { lotType: LotType }>(
    getInitialForm()
  );
  const currentStatus: ISpot["status"] = form.status ?? "AVAILABLE";

  const handleSave = async () => {
    if (!form.spotNumber.trim()) {
      toast.error("Spot Number is required");
      return;
    }

    if (!form.lotType) {
      toast.error("Lot Type is required");
      return;
    }

    if (
      !form.price ||
      (!form.price.daily && !form.price.weekly && !form.price.monthly)
    ) {
      toast.error("Price is required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    const formData = {
      ...form,
      lotIdentifier: form.spotNumber, // Backward compatibility with backend
    };

    setSaving(true);
    try {
      const res = await createSpot(formData);
      if (res.success) {
        toast.success("Lot added successfully");
        setOpen(false);
        router.refresh();
        setForm(getInitialForm());
      } else {
        toast.error(res.message || "Failed to add lot");
      }
    } catch {
      toast.error("Failed to add lot");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 border-green-200";
      case "OCCUPIED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MAINTENANCE":
        return "bg-red-100 text-red-800 border-red-200";
      case "RESERVED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Add Lot
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Home className="h-5 w-5 text-green-600" />
            Add New Lot
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-4 w-4 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spotNumber">
                    Lot Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="spotNumber"
                    value={form.spotNumber}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, spotNumber: e.target.value }))
                    }
                    placeholder={
                      identifierType === "lotNumber"
                        ? "e.g., A1, B2, C3"
                        : "e.g., 33031, 33032, 33033"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="status"
                    value={currentStatus}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as ISpot["status"],
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {["AVAILABLE", "MAINTENANCE"].map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <Badge className={getStatusColor(currentStatus)}>
                    {currentStatus.charAt(0) +
                      currentStatus.slice(1).toLowerCase()}
                  </Badge>
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
                  <Label className="text-sm font-medium text-blue-700 mb-2 block">
                    Lot Address Preview
                  </Label>
                  <div className="text-blue-800 font-mono text-sm">
                    {identifierType === "roadNumber" ? (
                      <>
                        <div className="font-medium">
                          {form.spotNumber} {address.street}
                        </div>
                        <div>
                          {address.city}, {address.state} {address.zip}
                        </div>
                        <div className="text-blue-600">{address.country}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium">
                          {address.street} {form.spotNumber}
                        </div>
                        <div>
                          {address.city}, {address.state} {address.zip}
                        </div>
                        <div className="text-blue-600">{address.country}</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Lot Identifier Display */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Lot Identification Type
                </Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                  <strong>Type:</strong>{" "}
                  {identifierType === "lotNumber"
                    ? "Lot Number"
                    : "Road Number"}
                  <br />
                  <strong>Example:</strong>{" "}
                  {identifierType === "lotNumber"
                    ? "1, 2, 3, A1, B2"
                    : "33031, 33032, 33033"}
                  <br />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-4 w-4 text-orange-600" />
                Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={form.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setForm((f) => ({
                            ...f,
                            amenities: [...f.amenities, amenity],
                          }));
                        } else {
                          setForm((f) => ({
                            ...f,
                            amenities: f.amenities.filter((a) => a !== amenity),
                          }));
                        }
                      }}
                    />
                    <label
                      htmlFor={amenity}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Size & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Ruler className="h-4 w-4 text-purple-600" />
                Size & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={form.size?.length?.toString() || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        size: {
                          ...f.size,
                          length: +e.target.value,
                        },
                      }))
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (ft)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={form.size?.width?.toString() || ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        size: {
                          ...f.size,
                          width: +e.target.value,
                        },
                      }))
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              {form.size && form.size.length > 0 && form.size.width > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Total Area: {form.size.length * form.size.width} sq ft
                </Badge>
              )}

              <Separator />

              {/* Pricing */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Price <span className="text-red-500">*</span>
                </Label>
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
                        (document.getElementById("price") as HTMLInputElement)
                          ?.value || "0"
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
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe the lot, its features, and any special considerations..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setForm(getInitialForm());
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? "Adding Lot..." : "Add Lot"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
