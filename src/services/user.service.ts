import createHttpError from "http-errors";
import db from "../config/database";
import { ICreateUser } from "../types";
import logger from "../config/logger";

export async function createUser({
    fullName,
    email,
    hashedPassword,
    securityToken,
    deviceId,
    deviceName,
    deviceType,
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
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error creating user");
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
