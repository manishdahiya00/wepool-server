import logger from "../config/logger";
import {
    getAllUsers,
    getUserById,
    getUserCreatedRides,
} from "../services/user.service";
import { Request, Response } from "express";

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
            user,
        });
    } catch (error) {
        logger.error(error);
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
    } catch (error) {
        logger.error(error);
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
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
