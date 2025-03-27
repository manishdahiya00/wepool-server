import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(3, "Full name must be at least 3 characters long")
        .max(50, "Full name cannot exceed 50 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(15, "Password cannot exceed 15 characters"),
    deviceId: z.string().min(3, "Device ID must be at least 3 characters long"),
    deviceName: z.string().min(3, "Device name must be at least 3 characters"),
    deviceType: z.string().min(3, "Device type must be at least 3 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string(),
});
