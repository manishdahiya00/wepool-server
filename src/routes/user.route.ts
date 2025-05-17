import { Router } from "express";
import { getUser, userCreatedRides } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/authenticate.middleware";

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

const userRoutes = Router().use("/user", authenticateUser, userRouter);

export default userRoutes;
