import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import logger from "../config/logger";
import {
    createUser,
    findUserByEmail,
    updateUserSecurityToken,
} from "../services/user.service";
import { hash, verify } from "argon2";
import { formatZodError } from "../utils/zod.error";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: formatZodError(result.error) });
            return;
        }
        const { fullName, email, password, deviceId, deviceName, deviceType } =
            result.data;

        const isExistingUser = await findUserByEmail(email);
        if (isExistingUser) {
            res.status(400).json({
                success: false,
                message: "User already registered with this email address",
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
        next(error);
        return;
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
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
        const isUserBanned = existingUser.isBanned;
        if (isUserBanned) {
            res.status(401).json({
                success: false,
                message: "You are banned from using application.",
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
        next(error);
        return;
    }
};
