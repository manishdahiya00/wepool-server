import { Request, Response } from "express";
import logger from "../config/logger";
import {
    cancelRideSchema,
    createRideSchema,
    editRideSchema,
    searchRideSchema,
} from "../validations/ride.validation";
import { formatZodError } from "../utils/zod.error";
import {
    cancelRideOfUser,
    createRide,
    editRideOfUser,
    getRideById,
    searchRides,
    upcomingRide,
} from "../services/ride.service";
import { findVehicleById } from "../services/vehicle.service";
import { User } from "@prisma/client";

export const addRide = async (req: Request, res: Response) => {
    try {
        const result = createRideSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: formatZodError(result.error),
            });
            return;
        }
        const userId = req.user!.id;
        const {
            vehicleId,
            from,
            to,
            date,
            time,
            noOfSeats,
            pricePerSeat,
            summary,
            fromLat,
            fromLong,
            toLat,
            toLong,
        } = result.data;

        const vehicle = await findVehicleById(vehicleId);
        if (!vehicle) {
            res.status(400).json({
                success: false,
                message: "Vehicle not found",
            });
            return;
        }
        if (vehicle.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action",
            });
            return;
        }

        await createRide({
            userId,
            vehicleId,
            from,
            to,
            date,
            time,
            noOfSeats,
            pricePerSeat,
            summary,
            fromLat,
            fromLong,
            toLat,
            toLong,
        });

        res.status(201).json({
            success: true,
            message: "Ride published successfully",
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

export const searchRide = async (req: Request, res: Response) => {
    try {
        const result = searchRideSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: formatZodError(result.error),
            });
            return;
        }
        const { from, to, date, noOfSeats } = result.data;

        const rides = await searchRides({
            from,
            to,
            date,
            noOfSeats,
        });

        res.status(200).json({
            success: true,
            message: "Rides fetched successfully",
            rides,
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

export const upcomingRides = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const rides = await upcomingRide({ userId });

        res.status(200).json({
            success: true,
            message: "Upcoming Rides fetched successfully",
            rides,
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

export const getRide = async (req: Request, res: Response) => {
    try {
        const rideId = req.params.id;
        if (!rideId) {
            res.status(400).json({
                success: false,
                message: "Ride ID is required",
            });
            return;
        }
        const userId = req.user!.id;
        const ride = await getRideById({ rideId, userId });
        if (!ride) {
            res.status(404).json({
                success: false,
                message: "Ride not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Ride details fetched successfully",
            ride,
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

export const editRide = async (req: Request, res: Response) => {
    try {
        const result = editRideSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: formatZodError(result.error),
            });
            return;
        }
        const userId = req.user!.id;
        const {
            vehicleId,
            rideId,
            from,
            to,
            date,
            time,
            noOfSeats,
            pricePerSeat,
            summary,
            fromLat,
            fromLong,
            toLat,
            toLong,
        } = result.data;

        const ride = await getRideById({ rideId, userId });
        if (!ride) {
            res.status(404).json({
                success: false,
                message: "Ride not found",
            });
            return;
        }
        if ((ride.user as User).id !== userId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action",
            });
            return;
        }
        if (ride.isCompleted || ride.isCancelled) {
            res.status(400).json({
                success: false,
                message: "Ride is completed already",
            });
            return;
        }
        const vehicle = await findVehicleById(vehicleId);
        if (!vehicle) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
            return;
        }
        await editRideOfUser({
            userId,
            vehicleId,
            rideId,
            from,
            to,
            date,
            time,
            noOfSeats,
            pricePerSeat,
            summary,
            fromLat,
            fromLong,
            toLat,
            toLong,
        });
        res.status(200).json({
            success: true,
            message: "Ride edited successfully",
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

export const cancelRide = async (req: Request, res: Response) => {
    try {
        const result = cancelRideSchema.safeParse(req.body);
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
        if ((ride.user as User).id !== userId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action",
            });
            return;
        }
        if (ride.isCompleted || ride.isCancelled) {
            res.status(400).json({
                success: false,
                message: "Ride is completed already",
            });
            return;
        }
        await cancelRideOfUser({
            userId,
            rideId,
        });

        res.status(200).json({
            success: true,
            message: "Ride cancelled successfully",
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
