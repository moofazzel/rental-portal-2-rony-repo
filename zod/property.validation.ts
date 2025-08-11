import { z } from "zod";

export const lotSchema = z.object({
  name: z.string(),
  size: z.string(),
  status: z.enum(["Available", "Sold", "Reserved"]),
});

export const propertySchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  lots: z.array(lotSchema),
});



// Inferred TS types
export type Lot = z.infer<typeof lotSchema>;
export type Property = z.infer<typeof propertySchema>;


