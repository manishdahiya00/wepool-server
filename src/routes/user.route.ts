import { Request, Response, Router } from "express";
import {
    allUsers,
    getUser,
    userCreatedRides,
} from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/authenticate.middleware";
import { z } from "zod";
import { formatZodError } from "../utils/zod.error";
import { getUserById } from "../services/user.service";
import db from "../config/database";
import logger from "../config/logger";

const userRouter = Router();

/** @swagger
 * /user:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get("/", getUser);

/** @swagger
 * /user/createdRideHistory:
 *   get:
 *     summary: Get created rides of user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get("/createdRideHistory", userCreatedRides);

/**
 * @swagger
 * /user/appOpen:
 *   post:
 *     summary: Record app open event with user location
 *     tags: [App]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *     responses:
 *       200:
 *         description: App opened successfully
 *
 *       400:
 *         description: Bad request
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal Server Error
 *
 */

userRouter.post("/appOpen", async (req: Request, res: Response) => {
    try {
        const appOpenSchema = z.object({
            latitude: z.string(),
            longitude: z.string(),
        });
        const result = appOpenSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: formatZodError(result.error),
            });
            return;
        }

        const userId = req.user?.id;
        const { latitude, longitude } = result.data;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const updatedUser = await db.user.update({
            where: {
                id: userId,
            },
            data: {
                latitude,
                longitude,
            },
            omit: {
                password: true,
                hashedOtp: true,
                otpExpiresAt: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "App Opened Successfully",
            user: updatedUser,
        });
    } catch (error) {
        logger.error("Error in appOpen:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

/** @swagger
 * /user/all:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *       - in: query
 *         name: limit
 *     responses:
 *       200:
 *         description: All users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
userRouter.get("/all", async (req: Request, res: Response) => {
    try {
        await allUsers(req, res);
    } catch (error) {
        logger.error("Error in allUsers:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

const userRoutes = Router().use("/user", authenticateUser, userRouter);

export default userRoutes;
