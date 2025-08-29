import createHttpError from "http-errors";
import db from "../config/database";
import { ICreateStopOvers } from "../types";
import logger from "../config/logger";

export async function createStopOvers({
    userId,
    rideId,
    titles,
}: ICreateStopOvers) {
    try {
        await db.stopOver.createMany({
            data: titles.map((title) => ({
                userId,
                title,
                rideId,
            })),
        });

        return;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error creating stopovers");
    }
}

export async function getStopOverById({
    stopOverId,
    userId,
}: {
    stopOverId: string;
    userId: string;
}) {
    try {
        const stopOver = await db.stopOver.findFirst({
            where: {
                id: stopOverId,
                userId,
            },
            select: {
                id: true,
                title: true,
                user: {
                    select: {
                        fullName: true,
                        profilePhoto: true,
                    },
                },
                ride: {
                    select: {
                        id: true,
                        from: true,
                        fromLat: true,
                        fromLong: true,
                        to: true,
                        toLat: true,
                        toLong: true,
                        date: true,
                        time: true,
                        noOfSeats: true,
                        pricePerSeat: true,
                        summary: true,
                        isCompleted: true,
                        isCancelled: true,
                        remainingSeat: true,
                        vehicle: {
                            select: {
                                id: true,
                                brand: true,
                                model: true,
                                color: true,
                            },
                        },
                    },
                },
            },
        });
        return stopOver;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error fetching stopover");
    }
}

export async function getStopOversOfRide({
    rideId,
    userId,
}: {
    rideId: string;
    userId: string;
}) {
    try {
        const stopOvers = await db.stopOver.findMany({
            where: {
                rideId,
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
            },
        });
        return stopOvers;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error fetching stopovers");
    }
}

export async function removeStopOverById({
    stopOverId,
    userId,
}: {
    stopOverId: string;
    userId: string;
}) {
    try {
        await db.stopOver.delete({
            where: {
                id: stopOverId,
                userId,
            },
        });
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error removing stopover");
    }
}
