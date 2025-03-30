import { z } from "zod";

export const addVehicleSchema = z.object({
    brand: z.string().min(3).max(50),
    model: z.string().min(3).max(50),
    color: z.string().min(3).max(50),
});

export const editVehicleSchema = z.object({
    vehicleId: z.string(),
    brand: z.string().min(3).max(50),
    model: z.string().min(3).max(50),
    color: z.string().min(3).max(50),
});

export const deleteVehicleSchema = z.object({
    vehicleId: z.string(),
});
