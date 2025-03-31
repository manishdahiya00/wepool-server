import { z } from "zod";

export const createRideSchema = z.object({
    vehicleId: z.string(),
    from: z.string(),
    to: z.string(),
    date: z.string(),
    time: z.string(),
    noOfSeats: z.number(),
    pricePerSeat: z.number(),
    stopOvers: z.array(
        z.object({
            title: z.string(),
        }),
    ),
    summary: z.string(),
});

export const searchRideSchema = z.object({
    from: z.string(),
    to: z.string(),
    date: z.string(),
    noOfSeats: z.number(),
});
