/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import createHttpError from "http-errors";
import logger from "../config/logger";
import db from "../config/database";
import { ICreateRide, ISearchRide } from "../types";
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
