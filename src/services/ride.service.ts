import createHttpError from "http-errors";
import logger from "../config/logger";
import db from "../config/database";
import { ICreateRide, IEditRide, ISearchRide } from "../types";
import { DateTime } from "luxon";

export async function createRide({
    userId,
    vehicleId,
    from,
    subFrom,
    to,
    subTo,
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
                subFrom,
                subTo,
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
export async function searchRides({
    from,
    to,
    date,

    fromLat,
    fromLng,
    toLat,
    toLng,
    noOfSeats,
    userId,
}: ISearchRide) {
    try {
        const rides = await db.ride.findMany({
            where: {
                isCancelled: false,
                isCompleted: false,
                date,
                remainingSeat: {
                    gte: Number(noOfSeats),
                },
                // AND: [
                //     {
                //         OR: [
                //             {
                //                 from: { contains: from, mode: "insensitive" },
                //                 to: { contains: to, mode: "insensitive" },
                //             },
                //             {
                //                 fromLat: { not: undefined },
                //                 fromLong: { not: undefined },
                //                 toLat: { not: undefined },
                //                 toLong: { not: undefined },
                //             },
                //         ],
                //     },
                // ],
            },
            orderBy: [{ createdAt: "desc" }],
            select: {
                id: true,
                userId: true,
                from: true,
                fromLat: true,
                fromLong: true,
                to: true,
                toLat: true,
                toLong: true,
                subFrom: true,
                subTo: true,
                date: true,
                time: true,
                noOfSeats: true,
                pricePerSeat: true,
                summary: true,
                remainingSeat: true,
                vehicle: {
                    select: { id: true, brand: true, model: true, color: true },
                },
                user: {
                    select: {
                        fullName: true,
                        profilePhoto: true,
                        mobileNumber: true,
                    },
                },
                StopOver: {
                    select: { id: true, title: true },
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
            },
        });

        // Filter by proximity
        const fromLatNum = parseFloat(fromLat);
        const fromLngNum = parseFloat(fromLng);
        const toLatNum = parseFloat(toLat);
        const toLngNum = parseFloat(toLng);
        const RADIUS_KM = 10;

        const isNear = (
            lat1: number,
            lng1: number,
            lat2: number,
            lng2: number,
        ) => {
            const toRad = (x: number) => (x * Math.PI) / 180;
            const R = 6371;
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lng2 - lng1);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) *
                    Math.cos(toRad(lat2)) *
                    Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c <= RADIUS_KM;
        };

        const filtered = rides.filter((ride) => {
            const rFromLat = parseFloat(ride.fromLat);
            const rFromLng = parseFloat(ride.fromLong);
            const rToLat = parseFloat(ride.toLat);
            const rToLng = parseFloat(ride.toLong);
            return (
                isNear(fromLatNum, fromLngNum, rFromLat, rFromLng) &&
                isNear(toLatNum, toLngNum, rToLat, rToLng)
            );
        });

        const finalRides = await Promise.all(
            filtered.map(async (ride) => {
                const rideConfirmed = await db.userRide.findFirst({
                    where: { rideId: ride.id, userId },
                });

                return {
                    ...ride,
                    joined: !!rideConfirmed,
                    yourRide: ride.userId === userId,
                    joinedUsers: ride.UserRide.map((ur) => ur.user),
                };
            }),
        );

        return finalRides;
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error fetching rides");
    }
}

export async function upcomingRide({ userId }: { userId: string }) {
    try {
        const now = DateTime.now().setZone("Asia/Kolkata");

        // Step 1: Get all rides user has joined via UserRide
        const joinedUserRides = await db.userRide.findMany({
            where: {
                userId,
                ride: {
                    isCompleted: false,
                },
            },
            select: {
                ride: {
                    select: {
                        id: true,
                        userId: true,
                        isCancelled: true,
                        cancelledAt: true,
                        from: true,
                        fromLat: true,
                        fromLong: true,
                        to: true,
                        toLat: true,
                        toLong: true,
                        subFrom: true,
                        subTo: true,
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
                        user: {
                            select: {
                                fullName: true,
                                profilePhoto: true,
                            },
                        },
                        StopOver: {
                            select: {
                                id: true,
                                title: true,
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
                    },
                },
            },
        });

        // Step 2: Flatten rides and tag as joined
        const joinedRides = joinedUserRides
            .map(({ ride }) => {
                const rideDateTime = DateTime.fromFormat(
                    `${ride.date} ${ride.time}`,
                    "MMM dd, yyyy hh:mm a",
                    { zone: "Asia/Kolkata" },
                );

                if (!rideDateTime.isValid) return null;
                if (rideDateTime <= now) return null;

                if (ride.isCancelled && ride.cancelledAt) {
                    const cancelledAt = DateTime.fromJSDate(
                        ride.cancelledAt,
                    ).setZone("Asia/Kolkata");
                    if (now > cancelledAt.plus({ hours: 36 })) return null;
                }

                return {
                    ...ride,
                    joined: true,
                    yourRide: ride.userId === userId,
                    joinedUsers: ride.UserRide.map((ur) => ur.user),
                };
            })
            .filter(Boolean);

        // Step 3: Get rides created by the user that they haven’t joined via UserRide
        const createdRides = await db.ride.findMany({
            where: {
                userId,
                isCompleted: false,
            },
            select: {
                id: true,
                userId: true,
                isCancelled: true,
                cancelledAt: true,
                from: true,
                fromLat: true,
                fromLong: true,
                to: true,
                toLat: true,
                toLong: true,
                subFrom: true,
                subTo: true,
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
                user: {
                    select: {
                        fullName: true,
                        profilePhoto: true,
                    },
                },
                StopOver: {
                    select: {
                        id: true,
                        title: true,
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
            },
        });

        // Filter created rides that are upcoming and not duplicated from UserRide
        const filteredCreated = createdRides
            .filter((ride) => {
                const rideDateTime = DateTime.fromFormat(
                    `${ride.date} ${ride.time}`,
                    "MMM dd, yyyy hh:mm a",
                    { zone: "Asia/Kolkata" },
                );

                if (!rideDateTime.isValid) return false;
                if (rideDateTime <= now) return false;

                if (ride.isCancelled && ride.cancelledAt) {
                    const cancelledAt = DateTime.fromJSDate(
                        ride.cancelledAt,
                    ).setZone("Asia/Kolkata");
                    if (now > cancelledAt.plus({ hours: 36 })) return false;
                }

                const alreadyIncluded = joinedRides.find(
                    (r) => r!.id === ride.id,
                );
                return !alreadyIncluded;
            })
            .map((ride) => ({
                ...ride,
                joined: false,
                yourRide: true,
                joinedUsers: ride.UserRide.map((ur) => ur.user),
            }));

        // Step 4: Merge all
        return [...joinedRides, ...filteredCreated];
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
                subFrom: true,
                subTo: true,
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
        const userRideArr = Array.isArray(ride.UserRide)
            ? (ride.UserRide as {
                  user: {
                      fullName: string;
                      mobileNumber: string;
                      profilePhoto: string;
                      gender: string;
                  };
              }[])
            : [];
        const joinedUsers = userRideArr.map((r) => r.user);

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
    subFrom,
    subTo,
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
                subFrom,
                subTo,
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
