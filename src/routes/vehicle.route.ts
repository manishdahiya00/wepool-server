import { Router } from "express";
import {
    addvehicle,
    allVehicles,
    deleteVehicle,
    editvehicle,
} from "../controllers/vehicle.controller";
import { authenticateUser } from "../middlewares/authenticate.middleware";

/**
 * @swagger
 * /vehicle:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicles
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *                 description: Brand of the vehicle
 *               model:
 *                 type: string
 *                 description: Model of the vehicle
 *               color:
 *                 type: string
 *                 description: Color of the vehicle
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *   put:
 *     summary: Edit a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 description: ID of the vehicle
 *               brand:
 *                 type: string
 *                 description: Brand of the vehicle
 *               model:
 *                 type: string
 *                 description: Model of the vehicle
 *               color:
 *                 type: string
 *                 description: Color of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 description: ID of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 */

const router = Router();

router.get("/", allVehicles);

router.post("/", addvehicle);

router.put("/", editvehicle);

router.delete("/", deleteVehicle);

const vehicleRoute = Router();
vehicleRoute.use("/vehicle", authenticateUser, router);

export default vehicleRoute;
