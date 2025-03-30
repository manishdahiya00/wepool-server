import { Request, Response } from "express";
import logger from "../config/logger";
import {
    addVehicleSchema,
    deleteVehicleSchema,
    editVehicleSchema,
} from "../validations/vehicle.validation";
import { formatZodError } from "../utils/zod.error";
import {
    createVehicle,
    deleteSingleVehicle,
    editVehicle,
    findVehicleById,
    getAllVehicles,
} from "../services/vehicle.service";

export const addvehicle = async (req: Request, res: Response) => {
    try {
        const result = addVehicleSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }

        const { brand, model, color } = result.data;
        const userId = req.user!.id;

        const newVehicle = await createVehicle({
            userId,
            brand,
            model,
            color,
        });

        res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            vehicle: newVehicle,
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

export const editvehicle = async (req: Request, res: Response) => {
    try {
        const result = editVehicleSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }

        const { brand, model, color, vehicleId } = result.data;

        const vehicle = await findVehicleById(vehicleId);
        if (!vehicle) {
            res.status(400).json({ message: "Vehicle not found" });
            return;
        }
        if (vehicle.userId !== req.user?.id) {
            res.status(401).json({
                message: "You are not authorized to perform this action",
            });
            return;
        }
        await editVehicle({
            vehicleId,
            brand,
            model,
            color,
        });

        res.status(201).json({
            success: true,
            message: "Vehicle updated successfully",
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

export const allVehicles = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const vehicles = await getAllVehicles(userId);
        res.status(200).json({
            success: true,
            message: "All vehicles fetched successfully",
            vehicles,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = deleteVehicleSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }
        const { vehicleId } = result.data;

        const vehicle = await findVehicleById(vehicleId);
        if (!vehicle) {
            res.status(400).json({ message: "Vehicle not found" });
            return;
        }
        if (vehicle.userId !== req.user?.id) {
            res.status(401).json({
                message: "You are not authorized to perform this action",
            });
            return;
        }
        await deleteSingleVehicle(vehicleId);

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
