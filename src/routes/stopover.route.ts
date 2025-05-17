import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticate.middleware";
import {
    addStopOver,
    getStopOver,
    removeStopOver,
} from "../controllers/stopover.controller";

const stopOverRouter = Router();
/** @swagger
 * /stopover:
 *   post:
 *     summary: Add multiple stopovers to a ride
 *     tags: [Stopover]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titles
 *               - rideId
 *             properties:
 *               titles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of stopover titles
 *                 example: ["Stop 1", "Stop 2", "Stop 3"]
 *               rideId:
 *                 type: string
 *                 description: ID of the ride
 *     responses:
 *       201:
 *         description: Stopovers added successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

stopOverRouter.post("/", addStopOver);

/** @swagger
 * /stopover/{id}:
 *   get:
 *     summary: Get stopover by ID
 *     tags: [Stopover]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stopover ID
 *     responses:
 *       200:
 *         description: Stopover fetched successfully
 *       404:
 *         description: Stopover not found
 *       500:
 *         description: Internal server error
 */
stopOverRouter.get("/:id", getStopOver);

/** @swagger
 * /stopover/{id}:
 *   delete:
 *     summary: Remove a stopover
 *     tags: [Stopover]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stopover ID
 *     responses:
 *       200:
 *         description: Stopover removed successfully
 *       404:
 *         description: Stopover not found
 *       500:
 *         description: Internal server error
 */
stopOverRouter.delete("/:id", removeStopOver);

const stopoverRoutes = Router().use(
    "/stopover",
    authenticateUser,
    stopOverRouter,
);

export default stopoverRoutes;
