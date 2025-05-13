import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticate.middleware";
import {
    addStopOver,
    getStopOver,
    removeStopOver,
} from "../controllers/stopover.controller";

const router = Router();

/** @swagger
 * /stopover:
 *   post:
 *     summary: Add a new stopover
 *     tags: [Stopover]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the stopover
 *               rideId:
 *                 type: string
 *                 description: ID of the ride
 *     responses:
 *       201:
 *         description: Stopover added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 */
router.post("/", addStopOver);

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
router.get("/:id", getStopOver);

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
router.delete("/:id", removeStopOver);

const stopoverRoutes = router.use("/stopover", authenticateUser, router);

export default stopoverRoutes;
