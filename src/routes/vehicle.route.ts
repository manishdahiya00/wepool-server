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
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicles
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicle]
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
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Edit a vehicle
 *     tags: [Vehicle]
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
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicle]
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
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

const vehicleRouter = Router();

vehicleRouter.get("/", allVehicles);

vehicleRouter.post("/", addvehicle);

vehicleRouter.put("/", editvehicle);

vehicleRouter.delete("/", deleteVehicle);

const vehicleRoute = Router().use("/vehicle", authenticateUser, vehicleRouter);

export default vehicleRoute;
