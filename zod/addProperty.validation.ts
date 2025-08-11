import { z } from "zod";

// Updated to match backend createPropertyValidationSchema
export const addPropertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required").optional(),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().optional(),
  }),
  identifierType: z.enum(["lotNumber", "roadNumber"]).default("lotNumber"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  rules: z.array(z.string()).optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export type AddPropertyInput = z.infer<typeof addPropertySchema>;
