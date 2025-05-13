import { Request, Response } from "express";
import logger from "../config/logger";
import {
    createStopOver,
    getStopOverById,
    getStopOversOfRide,
    removeStopOverById,
} from "../services/stopover.service";
import { formatZodError } from "../utils/zod.error";
import {
    createStopOverSchema,
    getStopOversOfRideSchema,
} from "../validations/ride.validation";
import { getRideById } from "../services/ride.service";

export const addStopOver = async (req: Request, res: Response) => {
    try {
        const result = createStopOverSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: formatZodError(result.error),
            });
            return;
        }
        const userId = req.user!.id;
        const { title, rideId } = result.data;

        const stopOver = await createStopOver({
            userId,
            title,
            rideId,
        });

        res.status(201).json({
            success: true,
            message: "Stopover added successfully",
            stopOver,
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getStopOver = async (req: Request, res: Response) => {
    try {
        const stopOverId = req.params.id;
        if (!stopOverId) {
            res.status(400).json({
                success: false,
                message: "Stopover ID is required",
            });
            return;
        }
        const userId = req.user!.id;
        const stopOver = await getStopOverById({ stopOverId, userId });
        if (!stopOver) {
            res.status(404).json({
                success: false,
                message: "Stopover not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Stopover fetched successfully",
            stopOver,
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getStopOvers = async (req: Request, res: Response) => {
    try {
        const result = getStopOversOfRideSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: formatZodError(result.error),
            });
            return;
        }
        const userId = req.user!.id;
        const { rideId } = result.data;

        const ride = await getRideById({ rideId, userId });
        if (!ride) {
            res.status(404).json({
                success: false,
                message: "Ride not found",
            });
            return;
        }

        const stopOvers = await getStopOversOfRide({ rideId, userId });

        res.status(200).json({
            success: true,
            message: "Stopovers fetched successfully",
            stopOvers,
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const removeStopOver = async (req: Request, res: Response) => {
    try {
        const stopOverId = req.params.id;
        if (!stopOverId) {
            res.status(400).json({
                success: false,
                message: "Stopover ID is required",
            });
            return;
        }
        const userId = req.user!.id;
        const stopOver = await getStopOverById({ stopOverId, userId });
        if (!stopOver) {
            res.status(404).json({
                success: false,
                message: "Stopover not found",
            });
            return;
        }
        await removeStopOverById({ stopOverId, userId });

        res.status(200).json({
            success: true,
            message: "Stopover removed successfully",
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
