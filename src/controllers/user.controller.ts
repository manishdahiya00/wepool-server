import logger from "../config/logger";
import {
    deleteProfileImageService,
    editProfileImageService,
    editProfileService,
    getAllUsers,
    getUserById,
    getUserCreatedRides,
    verifyAadharService,
} from "../services/user.service";
import { Request, Response } from "express";
import { editProfileSchema } from "../validations/user.validation";
import { formatZodError } from "../utils/zod.error";
import fs from "node:fs";

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is missing",
            });
            return;
        }

        const user = await getUserById(userId);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                isVerified: user.isVerified,
                gender: user.gender,
                mobileNumber: user.mobileNumber,
                dob: user.dob,
                bio: user.bio,
                profilePhoto: user.profilePhoto,
                isProfileUrl: user.profilePhoto ? true : false,
                isEmailConfirmed: user.isVerified,
                isBioAvailable: user.bio ? true : false,
                isPhnConfirmed: user.isPhnConfirmed ?? false,
                isGovtProofConfirmed: user.isGovtProofConfirmed ?? false,
                isVehicleAvailable: user._count.vehicles > 0 ? true : false,
                rateAppUrl:
                    "https://play.google.com/store/apps/details?id=com.arun.wepool",
                referUrl:
                    "https://play.google.com/store/apps/details?id=com.arun.wepool",
            },
        });
    } catch (error: any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const editProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(400).json({
                status: false,
                message: "UserId is missing",
            });
            return;
        }
        const result = editProfileSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: formatZodError(result.error),
            });
            return;
        }
        await editProfileService(userId, result.data);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
        });
    } catch (error: any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const userCreatedRides = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is missing",
            });
            return;
        }

        const rides = await getUserCreatedRides(userId);

        if (!rides) {
            res.status(404).json({
                success: false,
                message: "Rides not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Rides fetched successfully",
            rides,
        });
    } catch (error: any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const allUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        const { users, total } = await getAllUsers(page, limit);

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const editProfileImage = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is missing",
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        if (!req.file.mimetype.startsWith("image/")) {
            fs.unlink(req.file.path, (err) => {
                if (err) logger.error("Error deleting temp file:", err);
            });
            return res.status(400).json({
                success: false,
                message: "Only image files are supported.",
            });
        }
        await editProfileImageService(userId, req.file);

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
        });
    } catch (error: any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const verifyAadhar = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is missing",
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        if (!req.file.mimetype.startsWith("image/")) {
            fs.unlink(req.file.path, (err) => {
                if (err) logger.error("Error deleting temp file:", err);
            });
            return res.status(400).json({
                success: false,
                message: "Only image files are supported.",
            });
        }
        await verifyAadharService(userId, req.file);

        res.status(200).json({
            success: true,
            message: "Aadhar uploaded successfully",
        });
    } catch (error: any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteProfileImage = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is missing",
            });
        }
        if (req.user?.profilePhoto === "" || req.user?.profilePhoto === null) {
            return res.status(400).json({
                success: false,
                message: "No profile image to delete",
            });
        }
        await deleteProfileImageService(userId);

        res.status(200).json({
            success: true,
            message: "Profile image deleted successfully",
        });
    } catch (error: any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
