import createHttpError from "http-errors";
import db from "../config/database";
import { ICreateUser, IEditProfileData } from "../types";
import logger from "../config/logger";
import { User } from "@prisma/client";
import cloudinary, { getPublicIdFromUrl } from "../utils/cloudinary";
import fs from "node:fs";

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
    } catch (error: any) {
        logger.error(error.stack);
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
    } catch (error: any) {
        logger.error(error.stack);
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
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error verifying user");
    }
}

export async function findUserByEmail(email: string) {
    try {
        return await db.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
        });
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error finding user by email");
    }
}

export async function updateUserSecurityToken(userId: string, token: string) {
    try {
        return await db.user.update({
            where: { id: userId },
            data: { securityToken: token },
        });
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error updating security token");
    }
}

export async function updateUserPassword(userId: string, password: string) {
    try {
        return await db.user.update({
            where: { id: userId },
            data: { password },
        });
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error updating password");
    }
}
export async function findUserBySecurityToken(token: string) {
    try {
        return await db.user.findFirst({
            where: { securityToken: { equals: token, mode: "insensitive" } },
        });
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error finding user by security token");
    }
}

export async function deleteAllUsers() {
    try {
        return await db.user.deleteMany();
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error deleting all users");
    }
}

export async function updateUser(user: User) {
    try {
        return await db.user.update({
            where: { id: user.id },
            data: user,
        });
    } catch (error: any) {
        logger.error(error.stack);
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
                bio: true,
                profilePhoto: true,
                isPhnConfirmed: true,
                isGovtProofConfirmed: true,
                _count: {
                    select: {
                        vehicles: true,
                    },
                },
            },
        });
        return user;
    } catch (error: any) {
        logger.error(error.stack);
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
                subFrom: true,
                subTo: true,
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
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error fetching user created rides");
    }
};

export const getAllUsers = async (page: number, limit: number) => {
    try {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            db.user.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    isVerified: true,
                    gender: true,
                    mobileNumber: true,
                    dob: true,
                    deviceId: true,
                    deviceType: true,
                    deviceName: true,
                    isBanned: true,
                    securityToken: true,
                    latitude: true,
                    longitude: true,
                    profilePhoto: true,
                    createdAt: true,
                    rides: true,
                    StopOver: true,
                    UserRide: true,
                    vehicles: true,
                },
            }),
            db.user.count(),
        ]);

        return { users, total };
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error fetching all users");
    }
};

export const editProfileService = async (
    userId: string,
    data: IEditProfileData,
) => {
    try {
        const user = await db.user.update({
            where: { id: userId },
            data,
        });
        return user;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error updating user");
    }
};

export const editProfileImageService = async (
    userId: string,
    file: Express.Multer.File,
) => {
    try {
        // Fetch user to check old profile pic
        const existingUser = await db.user.findUnique({
            where: { id: userId },
        });

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "profile_pics",
            transformation: [{ width: 300, height: 300, crop: "fill" }],
        });

        // Delete local temp file
        fs.unlink(file.path, (err) => {
            if (err) logger.error("Error deleting temp file:", err);
        });

        // Delete old Cloudinary image if exists
        if (existingUser?.profilePhoto) {
            const publicId = getPublicIdFromUrl(existingUser.profilePhoto);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId).catch((err) => {
                    logger.error("Error deleting old Cloudinary image:", err);
                });
            }
        }

        // Update DB with Cloudinary URL
        const user = await db.user.update({
            where: { id: userId },
            data: {
                profilePhoto: result.secure_url,
            },
        });

        return user;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error updating user profile image");
    }
};

export const verifyAadharService = async (
    userId: string,
    file: Express.Multer.File,
) => {
    try {
        // Fetch user to check old profile pic
        const existingUser = await db.user.findUnique({
            where: { id: userId },
        });

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "aadhar_docs",
            transformation: [{ width: 600, height: 400, crop: "fit" }],
        });

        fs.unlink(file.path, (err) => {
            if (err) logger.error("Error deleting temp file:", err);
        });

        // Delete old Cloudinary image if exists
        if (existingUser?.aadharUrl) {
            const publicId = getPublicIdFromUrl(existingUser.aadharUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId).catch((err) => {
                    logger.error("Error deleting old Cloudinary image:", err);
                });
            }
        }

        // Update DB with Cloudinary URL
        const user = await db.user.update({
            where: { id: userId },
            data: {
                aadharUrl: result.secure_url,
            },
        });

        return user;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error uploading Aadhar document");
    }
};

export const deleteProfileImageService = async (userId: string) => {
    try {
        // Fetch user to check old profile pic
        const existingUser = await db.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser?.profilePhoto) {
            throw createHttpError(400, "No profile image to delete");
        }

        // Delete old Cloudinary image if exists
        const publicId = getPublicIdFromUrl(existingUser.profilePhoto);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId).catch((err) => {
                logger.error("Error deleting Cloudinary image:", err);
            });
        }

        // Update DB to remove profile photo URL
        const user = await db.user.update({
            where: { id: userId },
            data: {
                profilePhoto: "",
            },
        });

        return user;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error deleting user profile image");
    }
};
