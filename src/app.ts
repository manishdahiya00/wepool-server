import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRoutes from "./routes/auth.routes";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
    res.send({
        success: true,
        message: "Healthy 🚀",
        timeStamp: Date.now(),
    });
});

app.use("/api/auth", authRoutes);

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [{ type: err.name, msg: err.message, path: "", location: "" }],
    });
});

export default app;
