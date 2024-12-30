import express, { Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import { NextFunction } from "connect";

const app = express();

app.get("/health", (_req, res) => {
    res.send({
        success: true,
        message: "Healthy 🚀",
        timeStamp: Date.now(),
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [{ type: err.name, msg: err.message, path: "", location: "" }],
    });
});

export default app;
