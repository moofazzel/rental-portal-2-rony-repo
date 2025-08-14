import { z } from "zod";

// Zod schema for updating a property, aligns with CreatePropertyDto
export const updatePropertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required").optional(),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  identifierType: z.enum(["lotNumber", "roadNumber"]).optional(),
  //   amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  amenities: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  //   totalLots: z
  //     .number({ invalid_type_error: "Total lots must be a number" })
  //     .min(0, "Must be 0 or more"),
  //   availableLots: z
  //     .number({ invalid_type_error: "Available lots must be a number" })
  //     .min(0, "Must be 0 or more"),
  //   isActive: z.boolean(),
  totalLots: z.number().min(0, "Must be 0 or more").optional(),
  availableLots: z.number().min(0, "Must be 0 or more").optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
