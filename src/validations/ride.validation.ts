import { sub } from "date-fns";
import { z } from "zod";

export const createRideSchema = z.object({
    vehicleId: z.string(),
    from: z.string(),
    subFrom: z.string(),
    fromLat: z.string(),
    fromLong: z.string(),
    to: z.string(),
    subTo: z.string(),
    toLat: z.string(),
    toLong: z.string(),
    date: z.string(),
    time: z.string(),
    noOfSeats: z.number(),
    pricePerSeat: z.number(),
    summary: z.string(),
    stopovers: z.array(z.string()),
});

export const searchRideSchema = z.object({
    from: z.string(),
    to: z.string(),
    date: z.string(),
    noOfSeats: z.number(),
});

export const editRideSchema = z.object({
    vehicleId: z.string(),
    id: z.string(),
    from: z.string(),
    subFrom: z.string(),
    fromLat: z.string(),
    fromLong: z.string(),
    to: z.string(),
    subTo: z.string(),
    toLat: z.string(),
    toLong: z.string(),
    date: z.string(),
    time: z.string(),
    noOfSeats: z.number(),
    pricePerSeat: z.number(),
    summary: z.string(),
    stopovers: z.array(z.string()),
});

export const cancelRideSchema = z.object({
    id: z.string(),
});

export const joinRideSchema = z.object({
    rideId: z.string(),
});

export const createStopOverSchema = z.object({
    titles: z.array(z.string()).min(1, "At least one stopover is required"),
    rideId: z.string(),
});

export const getStopOversOfRideSchema = z.object({
    rideId: z.string(),
});
