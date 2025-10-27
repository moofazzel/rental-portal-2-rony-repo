import { z } from "zod";

export const applicationFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  currentAddress: z.string().min(1, "Current address is required"),

  // RV Information
  rvYear: z
    .number()
    .min(1960, "Please enter a valid year")
    .max(new Date().getFullYear() + 1, "Please enter a valid year"),
  rvLength: z
    .number()
    .min(15, "RV length must be at least 15 feet")
    .max(60, "RV length cannot exceed 60 feet"),
  rvMake: z.string().min(1, "RV make is required"),
  rvModel: z.string().min(1, "RV model is required"),
  rvType: z.string().min(1, "Please select an RV type"),

  // Occupancy & Pets
  numOccupants: z
    .number()
    .min(1, "Number of occupants is required")
    .max(10, "Maximum 10 occupants allowed"),
  hasPets: z.string().min(1, "Please specify if you have pets"),
  petDetails: z.string().optional(),

  // Stay Details
  moveInDate: z.date({
    required_error: "Please select a move-in date",
  }),
  stayDuration: z.string().min(1, "Please select a stay duration"),

  // Additional Information
  additionalNotes: z.string().optional(),
  hearAboutUs: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
