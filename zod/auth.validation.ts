import { string, z } from "zod";

export const SignUpSchema = z
  .object({
    name: string().min(2, "Name must be at least 2 characters"),
    email: string().email("Invalid email"),
    password: string().min(6, "Password must be at least 6 characters"),
    confirmPassword: string(),
    phoneNumber: string().min(10, "Phone number must be at least 10 digits"),
    preferredLocation: string().min(
      2,
      "Location must be at least 2 characters"
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});
