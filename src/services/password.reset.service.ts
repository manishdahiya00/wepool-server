import createHttpError from "http-errors";
import db from "../config/database";
import logger from "../config/logger";

export async function createResetPasswordToken(userId: string, token: string) {
    try {
        await db.passwordReset.deleteMany({ where: { userId } });
        await db.passwordReset.create({
            data: {
                userId,
                hashedOtp: token,
                otpExpiresAt: new Date(Date.now() + 60 * 1000), // 60seconds
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error creating reset password token");
    }
}

export async function findResetPasswordToken(userId: string) {
    try {
        const token = await db.passwordReset.findFirst({
            where: { userId },
        });
        return token;
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error finding reset password token");
    }
}

export async function deleteResetPasswordToken(userId: string) {
    try {
        await db.passwordReset.deleteMany({ where: { userId } });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error deleting reset password token");
    }
}

export async function updateResetPasswordToken(
    userId: string,
    resetToken: string,
) {
    try {
        await db.passwordReset.update({
            where: { userId },
            data: {
                hashedOtp: "-",
                otpExpiresAt: new Date(Date.now()),
                resetToken,
                resetTokenExpiresAt: new Date(Date.now() + 60 * 1000), // 60seconds
            },
        });
    } catch (error) {
        logger.error(error);
        throw createHttpError(500, "Error updating reset password token");
    }
}
