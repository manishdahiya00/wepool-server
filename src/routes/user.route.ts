import { Router } from "express";
import { getUser, userCreatedRides } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/authenticate.middleware";

const router = Router();

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
router.get("/", getUser);

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
router.get("/createdRideHistory", userCreatedRides);

const userRoutes = router.use("/user", authenticateUser, router);

export default userRoutes;
