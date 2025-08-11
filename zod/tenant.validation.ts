import { z } from "zod";

export const inviteTenantSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  preferredLocation: z.string().min(1, "Property is required"),
  propertyId: z.string().min(1, "Property is required"),
  spotId: z.string().min(1, "Lot is required"),
});

export type InviteTenantFormData = z.infer<typeof inviteTenantSchema>;
