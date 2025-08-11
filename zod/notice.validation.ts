import { z } from "zod";

// Enum definitions
export enum AnnouncementPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum AnnouncementTargetAudience {
  ALL = "ALL",
  TENANTS_ONLY = "TENANTS_ONLY",
  ADMINS_ONLY = "ADMINS_ONLY",
  PROPERTY_SPECIFIC = "PROPERTY_SPECIFIC",
}

export enum AnnouncementType {
  GENERAL = "GENERAL",
  MAINTENANCE = "MAINTENANCE",
  EVENT = "EVENT",
  SECURITY = "SECURITY",
  BILLING = "BILLING",
  EMERGENCY = "EMERGENCY",
  RULE_UPDATE = "RULE_UPDATE",
}

// Zod schema
export const noticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),

  type: z.nativeEnum(AnnouncementType, {
    errorMap: () => ({ message: "Type is required" }),
  }),

  priority: z.nativeEnum(AnnouncementPriority, {
    errorMap: () => ({ message: "Priority is required" }),
  }),

  targetAudience: z.nativeEnum(AnnouncementTargetAudience, {
    errorMap: () => ({ message: "Target Audience is required" }),
  }),
  expiryDate: z.coerce.date({
    errorMap: () => ({ message: "Please select a valid expiry date." }),
  }),

  // propertyId: z.string().min(1, { message: "" }),
  propertyId: z.string({ required_error: "Property is required" }).min(1, {
    message: "Property must be selected",
  }),
  sendNotification: z.boolean().optional(),

  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
});

// export type NoticeSchema = z.infer<typeof noticeSchema>;
