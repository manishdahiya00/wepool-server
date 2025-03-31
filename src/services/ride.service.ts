import createHttpError from "http-errors";
import logger from "../config/logger";
import db from "../config/database";
import { ICreateRide, ISearchRide } from "../types";

export async function createRide({
    userId,
    vehicleId,
    from,
    to,
    date,
    time,
    noOfSeats,
    pricePerSeat,
    summary,
    stopOvers,
}: ICreateRide) {
    try {
        await db.ride.create({
            data: {
                userId,
                vehicleId,
                from,
                to,
                date,
                time,
                noOfSeats,
                pricePerSeat,
                summary,
                stopOvers: {
                    createMany: {
                        data: stopOvers.map((stopOver) => ({
                            ...stopOver,
                            userId,
                        })),
                    },
                },
            },
        });
    } catch (error) {
        console.log(error);
        logger.error(error);
        throw createHttpError(500, "Error creating ride");
    }
}

export async function searchRides({ from, to, date, noOfSeats }: ISearchRide) {
    try {
        const rides = await db.ride.findMany({
            where: {
                from,
                to,
                date,
                noOfSeats,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                user: {
                    select: {
                        fullName: true,
                    },
                },
                stopOvers: {
                    select: {
                        title: true,
                    },
                },
                from: true,
                to: true,
                date: true,
                time: true,
                noOfSeats: true,
                pricePerSeat: true,
                summary: true,
                vehicle: {
                    select: {
                        brand: true,
                        model: true,
                        color: true,
                    },
                },
            },
        });
        return rides;
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error fetching rides");
    }
}
