import { NextFunction, Request, Response } from "express";
import { findUserBySecurityToken } from "../services/user.service";

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const validUser = await findUserBySecurityToken(token);
    if (!validUser) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = validUser;
    next();
};
