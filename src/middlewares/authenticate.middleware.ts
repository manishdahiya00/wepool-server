import { NextFunction, Request, Response } from "express";
import { findUserBySecurityToken } from "../services/user.service";

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Session Expired. Login again",
        });
        return;
    }
    const validUser = await findUserBySecurityToken(token.split(" ")[1]);
    if (!validUser) {
        res.status(401).json({
            success: false,
            message: "Session Expired. Login again",
        });
        return;
    }
    if (!validUser.isVerified) {
        res.status(401).json({
            success: false,
            message: "Session Expired. Login again",
        });
        return;
    }
    req.user = validUser;
    next();
};
