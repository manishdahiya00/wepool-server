import { Request, Response, Router } from "express";
import {
    allUsers,
    editProfile,
    editProfileImage,
    getUser,
    userCreatedRides,
    verifyAadhar,
} from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/authenticate.middleware";
import { z } from "zod";
import { formatZodError } from "../utils/zod.error";
import { getUserById } from "../services/user.service";
import db from "../config/database";
import logger from "../config/logger";
import multer from "multer";

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
    } catch (error: any) {
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
    } catch (error: any) {
        logger.error("Error in allUsers:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

/** @swagger
 * /user/editProfile:
 *   put:
 *     summary: Edit user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               dob:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.put("/editProfile", async (req: Request, res: Response) => {
    try {
        await editProfile(req, res);
    } catch (error: any) {
        logger.error("Error in editProfile:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

/** @swagger
 *  /user/editProfileImage:
 *    put:
 *      summary: Edit user profile image
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                profilePhoto:
 *                  type: string
 *                  format: binary
 *      responses:
 *        200:
 *          description: Profile image updated successfully
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: User not found
 *        500:
 *          description: Internal Server Error
 */
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
userRouter.put(
    "/editProfileImage",
    upload.single("profilePhoto"),
    async (req: Request, res: Response) => {
        try {
            await editProfileImage(req, res);
        } catch (error: any) {
            logger.error("Error in editProfileImage:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    },
);

/** @swagger
 *  /user/aadhar/verify:
 *    post:
 *      summary: Verify Aadhar card
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                aadhar:
 *                  type: string
 *                  format: binary
 *      responses:
 *        200:
 *          description: Aadhar card verified successfully
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: User not found
 *        500:
 *          description: Internal Server Error
 */
userRouter.post(
    "/aadhar/verify",
    upload.single("aadhar"),
    async (req: Request, res: Response) => {
        try {
            await verifyAadhar(req, res);
        } catch (error: any) {
            logger.error("Error in verifyAadhar:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    },
);

const userRoutes = Router().use("/user", authenticateUser, userRouter);

export default userRoutes;
