import createHttpError from "http-errors";
import db from "../config/database";
import logger from "../config/logger";
import { ICreateVehicle, IEditVehicle } from "../types";

export async function createVehicle({
    userId,
    brand,
    model,
    color,
}: ICreateVehicle) {
    try {
        await db.vehicle.create({
            data: {
                userId,
                brand,
                model,
                color,
            },
        });
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error creating vehicle");
    }
}

export async function findVehicleById(vehicleId: string) {
    try {
        const vehicle = await db.vehicle.findFirst({
            where: { id: vehicleId },
        });
        return vehicle;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error finding vehicle by id");
    }
}

export async function editVehicle({
    vehicleId,
    brand,
    model,
    color,
}: IEditVehicle) {
    try {
        await db.vehicle.update({
            where: { id: vehicleId },
            data: {
                brand,
                model,
                color,
            },
        });
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error updating vehicle");
    }
}

export async function getAllVehicles(userId: string) {
    try {
        const vehicles = await db.vehicle.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                brand: true,
                model: true,
                color: true,
            },
        });
        return vehicles;
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error fetching vehicles");
    }
}

export async function deleteSingleVehicle(vehicleId: string) {
    try {
        await db.vehicle.delete({
            where: { id: vehicleId },
        });
    } catch (error: any) {
        logger.error(error.stack);
        throw createHttpError(500, "Error deleting vehicle");
    }
}
