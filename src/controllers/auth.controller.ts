import { Request, Response } from "express";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    verifyOtpSchema,
} from "../validations/auth.validation";
import logger from "../config/logger";
import {
    createUser,
    findUserByEmail,
    updateUserPassword,
    updateUserSecurityToken,
} from "../services/user.service";
import { hash, verify } from "argon2";
import { formatZodError } from "../utils/zod.error";
import aj from "../config/arcjet";
import {
    createResetPasswordToken,
    deleteResetPasswordToken,
    findResetPasswordToken,
    updateResetPasswordToken,
} from "../services/password.reset.service";
import { emailQueue, emailQueueName } from "../jobs/email.job";

export const register = async (req: Request, res: Response) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }

        const { fullName, email, password, deviceId, deviceName, deviceType } =
            result.data;

        const decision = await aj.protect(req, { email, requested: 3 });
        if (decision.isDenied()) {
            res.status(400).json({
                success: false,
                message: "Invalid email address",
            });
            return;
        }

        const isExistingUser = await findUserByEmail(email);
        if (isExistingUser) {
            res.status(400).json({
                success: false,
                message: "User already registered",
            });
            return;
        }

        const hashedPassword = await hash(password);
        const securityToken = crypto.randomUUID();

        const newUser = await createUser({
            fullName,
            email,
            hashedPassword,
            securityToken,
            deviceId,
            deviceName,
            deviceType,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token: newUser.securityToken,
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }

        const { email, password } = result.data;

        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const isPasswordValid = await verify(existingUser.password, password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        if (existingUser.isBanned) {
            res.status(403).json({
                success: false,
                message: "You are banned from this application",
            });
            return;
        }

        const newToken = crypto.randomUUID();
        const updatedUser = await updateUserSecurityToken(
            existingUser.id,
            newToken,
        );

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: updatedUser.securityToken,
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const result = forgotPasswordSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }

        const user = await findUserByEmail(result.data.email);
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await hash(otp);

        await createResetPasswordToken(user.id, hashedOtp);

        await emailQueue.add(emailQueueName, { email: user.email, otp });

        res.status(200).json({
            success: true,
            message: "OTP sent to your email",
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const result = verifyOtpSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }

        const { email, otp } = result.data;
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
            return;
        }

        const resetPass = await findResetPasswordToken(user.id);
        if (!resetPass || resetPass.otpExpiresAt < new Date()) {
            res.status(400).json({
                success: false,
                message: "OTP expired or invalid",
            });
            return;
        }

        const isOtpValid = await verify(resetPass.hashedOtp, otp);
        if (!isOtpValid) {
            res.status(400).json({ success: false, message: "Invalid OTP" });
            return;
        }

        const resetSessionToken = crypto.randomUUID();
        await updateResetPasswordToken(user.id, resetSessionToken);

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            resetToken: resetSessionToken,
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const result = resetPasswordSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }

        const user = await findUserByEmail(result.data.email);
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
            return;
        }

        const { resetToken, newPassword } = result.data;
        const resetPass = await findResetPasswordToken(user.id);

        if (!resetPass) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
            return;
        }

        if (
            resetPass.resetToken !== resetToken ||
            resetPass.resetTokenExpiresAt! < new Date()
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
            return;
        }

        const hashedPassword = await hash(newPassword);
        await updateUserPassword(user.id, hashedPassword);
        await deleteResetPasswordToken(user.id);

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};
