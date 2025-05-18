import createHttpError from "http-errors";
import db from "../config/database";
import { ICreateUser } from "../types";
import logger from "../config/logger";
import { User } from "@prisma/client";

export async function createUser({
    fullName,
    email,
    hashedPassword,
    securityToken,
    deviceId,
    deviceName,
    deviceType,
    dob,
    mobileNumber,
    gender,
}: ICreateUser) {
    try {
        let profilePhoto;

        const maleProfiles = [
            "https://api.dicebear.com/9.x/avataaars/svg?seed=male1",
            "https://api.dicebear.com/9.x/avataaars/svg?seed=male2",
        ];

        const femaleProfiles = [
            "https://api.dicebear.com/9.x/avataaars/svg?seed=female1",
            "https://api.dicebear.com/9.x/avataaars/svg?seed=female2",
        ];

        if (gender === "Male") {
            profilePhoto =
                maleProfiles[Math.floor(Math.random() * maleProfiles.length)];
        } else {
            profilePhoto =
                femaleProfiles[
                    Math.floor(Math.random() * femaleProfiles.length)
                ];
        }
        return await db.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                securityToken,
                isBanned: false,
                deviceId,
                deviceType,
                deviceName,
                dob,
                mobileNumber,
                gender,
                profilePhoto,
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error creating user");
    }
}

export async function updateUserOTP(userId: string, otp: string) {
    try {
        return await db.user.update({
            where: { id: userId },
            data: {
                hashedOtp: otp,
                otpExpiresAt: new Date(Date.now() + 60 * 1000), // 60 seconds
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error updating OTP");
    }
}

export async function verifyUser(userId: string) {
    try {
        return await db.user.update({
            where: { id: userId },
            data: {
                isVerified: true,
                hashedOtp: "",
                otpExpiresAt: new Date(Date.now()),
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error verifying user");
    }
}

export async function findUserByEmail(email: string) {
    try {
        return await db.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error finding user by email");
    }
}

export async function updateUserSecurityToken(userId: string, token: string) {
    try {
        return await db.user.update({
            where: { id: userId },
            data: { securityToken: token },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error updating security token");
    }
}

export async function updateUserPassword(userId: string, password: string) {
    try {
        return await db.user.update({
            where: { id: userId },
            data: { password },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error updating password");
    }
}
export async function findUserBySecurityToken(token: string) {
    try {
        return await db.user.findFirst({
            where: { securityToken: { equals: token, mode: "insensitive" } },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error finding user by security token");
    }
}

export async function deleteAllUsers() {
    try {
        return await db.user.deleteMany();
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error deleting all users");
    }
}

export async function updateUser(user: User) {
    try {
        return await db.user.update({
            where: { id: user.id },
            data: user,
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error updating user");
    }
}
export const getUserById = async (userId: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                isVerified: true,
                gender: true,
                mobileNumber: true,
                dob: true,
                profilePhoto: true,
            },
        });
        return user;
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error finding user");
    }
};

export const getUserCreatedRides = async (userId: string) => {
    try {
        const rides = await db.ride.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
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
                cancelledAt: true,
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
        throw createHttpError(500, "Error fetching user created rides");
    }
};
