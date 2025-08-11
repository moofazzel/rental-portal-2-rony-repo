import { Types } from "mongoose";

export const AnnouncementTypes = [
  "GENERAL",
  "MAINTENANCE",
  "EVENT",
  "SECURITY",
  "BILLING",
  "EMERGENCY",
  "RULE_UPDATE",
] as const;

export const AnnouncementPriorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

export const AnnouncementTargetAudiences = [
  "ALL",
  "TENANTS_ONLY",
  "OWNERS_ONLY",
  "RESIDENTS_ONLY",
  "STAFF_ONLY",
  "PROPERTY_SPECIFIC",
] as const;

// Optional: In case you want strict typing
export type AnnouncementType1 = (typeof AnnouncementTypes)[number];
export type AnnouncementPriority1 = (typeof AnnouncementPriorities)[number];
export type AnnouncementTargetAudience1 =
  (typeof AnnouncementTargetAudiences)[number];

// Announcement types: customize as needed
export type AnnouncementType =
  | "GENERAL"
  | "MAINTENANCE"
  | "EVENT"
  | "SECURITY"
  | "BILLING"
  | "EMERGENCY"
  | "RULE_UPDATE";

// Priority levels for announcements
export type AnnouncementPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// Define your audience categories
export type AnnouncementTargetAudience =
  | "ALL"
  | "TENANTS_ONLY"
  | "ADMINS_ONLY"
  | "PROPERTY_SPECIFIC";

export interface INotice {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  propertyId?:
    | {
        _id: string;
        name: string;
        address?: {
          street: string;
          city: string;
          state: string;
          zip: string;
          country: string;
        };
      }
    | string; // If null, it's a system-wide announcement
  isActive: boolean;
  expiryDate?: Date; // Optional expiry date
  createdBy: string; // Admin who created the announcement
  attachments?: string[]; // ✅ Now optional: URLs to attached files/images
  readBy: Types.ObjectId[]; // Array of user IDs who have read this announcement
  targetAudience: AnnouncementTargetAudience;
  sendNotification: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  isExpired: boolean;
  isCurrentlyActive: boolean;
  readCount: number;
}

// Main interface
export interface ICreateNotice {
  title: string;
  content: string;
  type: AnnouncementType;
  priority?: AnnouncementPriority;
  propertyId?: string;
  expiryDate?: Date;
  attachments?: string[];
  targetAudience?: AnnouncementTargetAudience;
  sendNotification?: boolean;
  tags?: string[];
}

export interface IUpdateNotice {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority?: AnnouncementPriority;
  propertyId?: string;
  expiryDate?: Date;
  attachments?: string[];
  targetAudience?: AnnouncementTargetAudience;
  sendNotification?: boolean;
  tags?: string[];
}

export type UpdateNoticeArgs = {
  noticeId: string;
  data: Partial<INotice>;
};
