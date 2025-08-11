// lib/uploadSchema.ts
import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  community: z.string().min(1, "Select a community"),
  fileType: z.enum(["img", "pdf", "doc"], {
    required_error: "File type is required",
  }),
});
