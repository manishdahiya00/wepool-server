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
        const newUser = await db.user.create({
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
        return newUser;
    } catch (error) {
        logger.error(error);
        const err = createHttpError(500, "Error creating user");
        throw err;
    }
}

export async function findUserByEmail(email: string) {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        logger.error(error);
        const err = createHttpError(500, "Error finding user by email");
        throw err;
    }
}

export async function updateUserSecurityToken(userId: string, token: string) {
    try {
        const user = await db.user.update({
            where: { id: userId },
            data: { securityToken: token },
        });

        return user;
    } catch (error) {
        logger.error(error);
        const err = createHttpError(500, "Error updating the securityToken");
        throw err;
    }
}
