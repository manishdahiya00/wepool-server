import { Router } from "express";
import {
    checkUserExists,
    forgotPassword,
    login,
    register,
    resetPassword,
    verifyOtp,
    verifyRegisterOTP,
} from "../controllers/auth.controller";

const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 15
 *               deviceId:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               deviceName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               deviceType:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               dob:
 *                 type: string
 *                 pattern: ^\d{4}-\d{2}-\d{2}$
 *               mobileNumber:
 *                 type: string
 *                 pattern: ^\d{10}$
 *               gender:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 *
 */
authRouter.post("/register", register);

/**
 * @swagger
 * /auth/check-user-exists:
 *   post:
 *     tags:
 *       - Auth
 *     description: Check if a user already exists by email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: User exists
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *
 */
authRouter.post("/check-user-exists", checkUserExists);

/**
 * @swagger
 * /auth/verify-user:
 *   post:
 *     tags:
 *       - Auth
 *     description: Verify the user after registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 50
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 *
 */
authRouter.post("/verify-user", verifyRegisterOTP);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 15
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 *
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     description: Forgot password for sending the otp to the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 *
 */
authRouter.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     description: Verify OTP for the forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 50
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 *
 */
authRouter.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     description: Reset password after verifying the forgot password otp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 50
 *               resetToken:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 15
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 *
 */
authRouter.post("/reset-password", resetPassword);

// /**
//  * @swagger
//  * /auth/delete-users:
//  *   post:
//  *     tags:
//  *       - Auth
//  *     description: Delete all users, Not for production use
//  *     responses:
//  *       200:
//  *         description: OK
//  *       400:
//  *         description: Bad Request
//  *       500:
//  *         description: Internal Server Error
//  *
//  */
// authRouter.post("/delete-users", deleteUsers);

const authRoutes = Router().use("/auth", authRouter);

export default authRoutes;
