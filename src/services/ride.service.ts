import createHttpError from "http-errors";
import logger from "../config/logger";
import db from "../config/database";
import { ICreateRide, IEditRide, ISearchRide } from "../types";
import { DateTime } from "luxon";

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
    fromLong,
    fromLat,
    toLong,
    toLat,
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
                fromLat,
                fromLong,
                toLat,
                toLong,
            },
        });
    } catch (error) {
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
                isCancelled: false,
                isCompleted: false,
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

export async function upcomingRide({ userId }: { userId: string }) {
    try {
        const rides = await db.ride.findMany({
            where: {
                userId,
                isCancelled: false,
                isCompleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                user: {
                    select: {
                        fullName: true,
                    },
                },
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
                vehicle: {
                    select: {
                        brand: true,
                        model: true,
                        color: true,
                    },
                },
            },
        });

        const now = DateTime.now().setZone("Asia/Kolkata");

        const upcomingRides = rides.filter((ride) => {
            const rideDateTime = DateTime.fromFormat(
                `${ride.date} ${ride.time}`,
                "MMM dd, yyyy hh:mm a",
                { zone: "Asia/Kolkata" },
            );

            if (!rideDateTime.isValid) {
                logger.error(
                    `Invalid date format for ride: ${ride.date} ${ride.time}`,
                );
                return false;
            }

            return rideDateTime > now;
        });

        return upcomingRides;
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error fetching upcoming rides");
    }
}

export async function getRideById({
    rideId,
    userId,
}: {
    rideId: string;
    userId: string;
}) {
    try {
        const ride = await db.ride.findFirst({
            where: {
                id: rideId,
                userId,
            },
            select: {
                user: {
                    select: {
                        fullName: true,
                        id: true,
                    },
                },
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
                vehicle: {
                    select: {
                        brand: true,
                        model: true,
                        color: true,
                    },
                },
            },
        });
        return ride;
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error fetching ride");
    }
}

export async function editRideOfUser({
    userId,
    id,
    vehicleId,
    from,
    to,
    date,
    time,
    noOfSeats,
    pricePerSeat,
    summary,
    fromLong,
    fromLat,
    toLong,
    toLat,
}: IEditRide) {
    try {
        await db.ride.update({
            where: {
                userId,
                id,
            },
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
                fromLat,
                fromLong,
                toLat,
                toLong,
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error editing ride");
    }
}

export async function cancelRideOfUser({
    userId,
    id,
}: {
    userId: string;
    id: string;
}) {
    try {
        await db.ride.update({
            where: {
                userId,
                id,
            },
            data: {
                isCancelled: true,
                isCompleted: true,
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error cancelling ride");
    }
}
