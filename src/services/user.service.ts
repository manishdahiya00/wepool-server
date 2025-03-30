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
}: ICreateUser) {
    try {
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
