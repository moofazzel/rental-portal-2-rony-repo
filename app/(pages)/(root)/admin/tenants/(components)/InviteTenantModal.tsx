"use client";

import {
  getAllProperties,
  getAllSpots,
  inviteTenant,
} from "@/app/apiClient/adminApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  inviteTenantSchema,
  type InviteTenantFormData,
} from "@/zod/tenant.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";

export default function InviteTenantModal({
  fromDropdown = false,
}: {
  fromDropdown?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<InviteTenantFormData>({
    resolver: zodResolver(inviteTenantSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      preferredLocation: "",
      propertyId: "",
      spotId: "",
    },
  });

  // get all properties
  const { data: properties, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: getAllProperties,
    refetchOnMount: true,
    staleTime: 0,
  });

  // get all available spots/lots for selected property
  const { data: spots, isLoading: isSpotLoading } = useQuery({
    queryKey: ["spots", selectedProperty],
    queryFn: () => getAllSpots({ propertyId: selectedProperty }),
    enabled: !!selectedProperty,
    refetchOnMount: true,
    staleTime: 0,
  });

  // Force refetch fresh data when modal opens
  useEffect(() => {
    if (open) {
      // Invalidate and refetch properties
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      // Invalidate spots for all properties to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["spots"] });
    }
  }, [open, queryClient]);

  const resetModal = () => {
    form.reset();
    setSelectedProperty("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetModal();
    setOpen(false);
  };
  //form validation before submitting
  // const { mutateAsync: inviteTenantMutation, isPending: isSubmitting } =
  //   useMutation({
  //     mutationFn: inviteTenant,
  //   });

  const onSubmit = async (data: InviteTenantFormData) => {
    setIsSubmitting(true);
    try {
      const response = await inviteTenant(data);

      // if (response?.data?.data?.autoFillUrl) {
      //   console.log(response.data?.data?.autoFillUrl);
      // } else {
      //   console.warn("autoFillUrl not found in the response:", response.data);
      // }

      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setOpen(false);
      toast.success("Tenant invited successfully!");
      resetModal();
      router.refresh(); // Revalidate the page

      setOpen(false);
    } catch {
      toast.error("An error occurred while inviting the tenant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertyChange = (propertyId: string) => {
    setSelectedProperty(propertyId);
    form.setValue("propertyId", propertyId);
    form.setValue("preferredLocation", propertyId);
    form.setValue("spotId", ""); // Reset lot selection when property changes
  };

  return (
    <>
      {fromDropdown ? (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="flex cursor-pointer items-center gap-2 "
        >
          <Users className="h-4 w-4 mr-2" />
          Invite Tenant
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          style={{ padding: "10px" }}
          className="flex items-center gap-2 px-[10px] cursor-pointer"
        >
          <UserPlus2 size={18} />
          Invite Tenant
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogPortal>
          <DialogOverlay className="bg-white/40 fixed inset-0 z-50" />
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white/90 rounded-lg border border-gray-200 shadow-xl transition-all">
            <DialogHeader>
              <DialogTitle className="text-center font-bold text-xl">
                Invite a New Tenant
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Doe"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="jane@example.com"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={"us"}
                          value={field.value}
                          onChange={(phone) => field.onChange(phone)}
                          inputStyle={{ width: "100%" }}
                          inputProps={{
                            name: "phoneNumber",
                            required: true,
                            disabled: isSubmitting,
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-x-4">
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={() => (
                      <FormItem className="flex-1">
                        <FormLabel>Property *</FormLabel>
                        <Select
                          value={selectedProperty}
                          onValueChange={handlePropertyChange}
                          disabled={isSubmitting || isPropertiesLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  isPropertiesLoading
                                    ? "Loading properties..."
                                    : "Select Property"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {properties?.data?.map((property) => (
                              <SelectItem
                                value={property._id || ""}
                                key={property._id || ""}
                              >
                                {property.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spotId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Lot *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={
                            !selectedProperty || isSpotLoading || isSubmitting
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  isSubmitting
                                    ? "Submitting..."
                                    : isSpotLoading
                                    ? "Loading lots..."
                                    : !selectedProperty
                                    ? "Select Property First"
                                    : spots?.data?.length === 0
                                    ? "No available lots"
                                    : "Select Lot"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {spots?.data?.length === 0 &&
                            selectedProperty &&
                            !isSpotLoading ? (
                              <SelectItem value="no-lots" disabled>
                                No available lots for this property
                              </SelectItem>
                            ) : (
                              spots?.data?.map((lot) => (
                                <SelectItem
                                  value={lot._id || ""}
                                  key={lot._id || ""}
                                >
                                  {lot.spotNumber}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Invite..." : "Send Invite"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
