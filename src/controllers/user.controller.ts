import logger from "../config/logger";
import { getUserById, getUserCreatedRides } from "../services/user.service";
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
