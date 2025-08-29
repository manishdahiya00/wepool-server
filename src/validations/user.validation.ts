import { z } from "zod";

export const editProfileSchema = z.object({
    fullName: z
        .string()
        .min(3, "Full name must be at least 3 characters long")
        .max(50, "Full name cannot exceed 50 characters"),
    dob: z.string().min(3, "Date of birth must be at least 3 characters long"),
    mobileNumber: z
        .string()
        .min(3, "Mobile number must be at least 3 characters long"),
    email: z.string().email("Enter a valid email address"),
    bio: z.string().max(500).optional(),
});
