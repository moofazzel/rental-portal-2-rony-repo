// serviceRequests.validation.ts
import { z } from "zod";

/** reuse your same enums in the client form */
export const createServiceRequestSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  type: z.enum(["MAINTENANCE", "UTILITY", "SECURITY", "CLEANING", "OTHER"]),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .optional()
    .default("MEDIUM"),
  images: z.array(z.string().url("Invalid URL")).optional(),
  tenantNotes: z.string().max(2000).optional(),
});

/** for use with react-hook-form’s zodResolver */
export type CreateServiceRequestInput = z.infer<
  typeof createServiceRequestSchema
>;
