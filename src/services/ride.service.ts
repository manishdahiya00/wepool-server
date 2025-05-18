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
    stopovers,
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
                remainingSeat: noOfSeats,
                StopOver: {
                    createMany: {
                        data: stopovers.map((title) => ({ title, userId })),
                    },
                },
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error creating ride");
    }
}

export async function searchRides({ from, to, date }: ISearchRide) {
    try {
        const rides = await db.ride.findMany({
            where: {
                from: {
                    contains: from,
                    mode: "insensitive",
                },
                to: {
                    contains: to,
                    mode: "insensitive",
                },
                date,
                isCancelled: false,
                isCompleted: false,
            },
            orderBy: [{ noOfSeats: "desc" }, { createdAt: "desc" }],
            select: {
                user: {
                    select: {
                        fullName: true,
                        profilePhoto: true,
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
                remainingSeat: true,
                vehicle: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        color: true,
                    },
                },
                StopOver: {
                    select: {
                        id: true,
                        title: true,
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
                isCompleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                isCancelled: true,
                cancelledAt: true,
                user: {
                    select: {
                        fullName: true,
                        profilePhoto: true,
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
                remainingSeat: true,
                vehicle: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        color: true,
                    },
                },
                UserRide: {
                    select: {
                        user: {
                            select: {
                                fullName: true,
                                mobileNumber: true,
                                profilePhoto: true,
                                gender: true,
                            },
                        },
                    },
                },
                StopOver: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        // Filter and handle date logic as you already have
        const now = DateTime.now().setZone("Asia/Kolkata");

        const filteredRides = rides.filter((ride) => {
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

            if (rideDateTime <= now) return false;

            if (ride.isCancelled) {
                if (!ride.cancelledAt) {
                    logger.warn(
                        `Cancelled ride ${ride.id} is missing cancelledAt`,
                    );
                    return false;
                }
                const cancelledAt = DateTime.fromJSDate(
                    ride.cancelledAt,
                ).setZone("Asia/Kolkata");
                return now < cancelledAt.plus({ hours: 36 });
            }

            return true;
        });

        // Map UserRide to array of users directly here
        const ridesWithUsers = filteredRides.map(({ UserRide, ...ride }) => ({
            ...ride,
            joinedUsers: UserRide.map((ur) => ur.user),
        }));

        // Add joined info if needed
        const upcomingRides = await Promise.all(
            ridesWithUsers.map(async (ride) => {
                const joined = await isRideJoined({ rideId: ride.id, userId });
                return { ...ride, joined };
            }),
        );

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
                        profilePhoto: true,
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
                remainingSeat: true,
                UserRide: {
                    select: {
                        user: {
                            select: {
                                fullName: true,
                                mobileNumber: true,
                                profilePhoto: true,
                                gender: true,
                            },
                        },
                    },
                },
                vehicle: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        color: true,
                    },
                },
                StopOver: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        if (!ride) return null;

        // Transform `UserRide` to `joinedUsers`
        const joinedUsers = ride.UserRide.map((r) => r.user);

        return {
            ...ride,
            joinedUsers,
            UserRide: undefined,
        };
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
    stopovers,
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
                StopOver: {
                    deleteMany: {},
                    createMany: {
                        data: stopovers.map((title) => ({
                            title,
                            userId,
                        })),
                    },
                },
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
                cancelledAt: new Date(),
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error cancelling ride");
    }
}
export const joinRideOfUser = async ({
    userId,
    rideId,
}: {
    userId: string;
    rideId: string;
}) => {
    try {
        await db.userRide.create({
            data: {
                userId,
                rideId,
            },
        });
        await db.ride.update({
            where: {
                id: rideId,
            },
            data: {
                remainingSeat: {
                    decrement: 1,
                },
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error joining ride");
    }
};

export const getRideForJoining = async ({ rideId }: { rideId: string }) => {
    try {
        const ride = await db.ride.findFirst({
            where: {
                id: rideId,
            },
        });
        return ride;
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error fetching ride");
    }
};

export const isRideJoined = async ({
    rideId,
    userId,
}: {
    rideId: string;
    userId: string;
}) => {
    try {
        const isJoined = await db.userRide.findFirst({
            where: {
                rideId,
                userId,
            },
        });

        return !!isJoined;
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error fetching ride");
    }
};
