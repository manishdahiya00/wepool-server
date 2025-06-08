import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticate.middleware";
import {
    addRide,
    cancelRide,
    editRide,
    getRide,
    joinRide,
    searchRide,
    upcomingRides,
} from "../controllers/ride.controller";
import { getStopOvers } from "../controllers/stopover.controller";

const rideRouter = Router();

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
 *               subFrom:
 *                type: string
 *                description: Sub-location of the from location
 *               fromLat:
 *                 type: string
 *                 description: From location latitude
 *               fromLong:
 *                 type: string
 *                 description: From location longitude
 *               to:
 *                 type: string
 *                 description: To location
 *               subTo:
 *                type: string
 *                description: Sub-location of the to location
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
 *               stopovers:
 *                 type: array
 *                 description: Array of stopover titles
 *                 items:
 *                   type: string
 *                   description: Stopover title
 *                 example: ["Stopover 1", "Stopover 2"]
 *                 required: true
 *                 uniqueItems: true
 *
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
rideRouter.post("/", addRide);

/** @swagger
 * /ride/{id}:
 *   get:
 *     summary: Get ride by ID
 *     tags: [Ride]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Upcoming ride fetched successfully
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Internal server error
 */
rideRouter.get("/:id", getRide);

/** @swagger
 * /ride:
 *   put:
 *     summary: Edit a ride
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
 *               id:
 *                 type: string
 *                 description: ID of the ride
 *               from:
 *                 type: string
 *                 description: From location
 *               subFrom:
 *                 type: string
 *                 description: Sub-location of the from location
 *               fromLat:
 *                 type: string
 *                 description: From location latitude
 *               fromLong:
 *                 type: string
 *                 description: From location longitude
 *               to:
 *                 type: string
 *                 description: To location
 *               subTo:
 *                 type: string
 *                 description: Sub-location of the to location
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
 *               stopovers:
 *                 type: array
 *                 description: Array of stopover titles
 *                 items:
 *                   type: string
 *                   description: Stopover title
 *                 example: ["Stopover 1", "Stopover 2"]
 *                 required: true
 *                 uniqueItems: true
 *     responses:
 *       200:
 *         description: Ride edited successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *
 */
rideRouter.put("/", editRide);

/** @swagger
 * /ride/cancel:
 *   delete:
 *     summary: Cancel a ride
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
 *               id:
 *                 type: string
 *                 description: ID of the ride
 *     responses:
 *       200:
 *         description: Ride cancelled successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *        description: Forbidden
 *       404:
 *        description: Not found
 *       500:
 *         description: Internal server error
 */
rideRouter.delete("/cancel", cancelRide);

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
rideRouter.post("/search", searchRide);

/** @swagger
 * /ride/upcoming:
 *   post:
 *     summary: Upcoming rides
 *     tags: [Ride]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upcoming Rides fetched successfully
 *       500:
 *         description: Internal server error
 */
rideRouter.post("/upcoming", upcomingRides);

/** @swagger
 * /ride/join:
 *   post:
 *     summary: Join ride
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
 *               rideId:
 *                 type: string
 *                 description: Ride id
 *     responses:
 *       200:
 *         description: Rides fetched successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
rideRouter.post("/join", joinRide);

/** @swagger
 * /ride/stopover:
 *   post:
 *     summary: Get stopovers of the ride by rideId
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
 *               rideId:
 *                 type: string
 *                 description: ID of the ride
 *     responses:
 *       200:
 *         description: Stopovers fetched successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Ride or stopovers not found
 *       500:
 *         description: Internal server error
 */
rideRouter.post("/stopover", getStopOvers);

const rideRoutes = Router().use("/ride", authenticateUser, rideRouter);

export default rideRoutes;
