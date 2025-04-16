import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticate.middleware";
import { addRide, searchRide } from "../controllers/ride.controller";

const router = Router();

/** @swagger
 * /ride:
 *   post:
 *     summary: Add a new ride
 *     tags: [Ride]
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
 *               from:
 *                 type: string
 *                 description: From location
 *               fromLat:
 *                 type: string
 *                 description: From location latitude
 *               fromLong:
 *                 type: string
 *                 description: From location longitude
 *               to:
 *                 type: string
 *                 description: To location
 *               toLat:
 *                 type: string
 *                 description: To location latitude
 *               toLong:
 *                 type: string
 *                 description: To location longitude
 *               date:
 *                 type: string
 *                 description: Date of the ride
 *               time:
 *                 type: string
 *                 description: Time of the ride
 *               noOfSeats:
 *                 type: number
 *                 description: Number of seats
 *               pricePerSeat:
 *                 type: number
 *                 description: Price per seat
 *               summary:
 *                 type: string
 *                 description: Summary of the ride
 *     responses:
 *       201:
 *         description: Ride added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 */
router.post("/", addRide);

/** @swagger
 * /ride/search:
 *   post:
 *     summary: Search rides
 *     tags: [Ride]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *                 description: From location
 *               to:
 *                 type: string
 *                 description: To location
 *               date:
 *                 type: string
 *                 description: Date of the ride
 *               noOfSeats:
 *                 type: number
 *                 description: Number of seats
 *     responses:
 *       200:
 *         description: Rides fetched successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/search", searchRide);

const rideRoutes = router.use("/ride", authenticateUser, router);

export default rideRoutes;
