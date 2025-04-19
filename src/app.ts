import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRoutes from "./routes/auth.route";
import * as swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import vehicleRoute from "./routes/vehicle.route";
import rideRoutes from "./routes/ride.route";
import { rateLimit, RateLimitRequestHandler } from "express-rate-limit";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const rateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request): string => {
        return typeof req.user?.id === "string"
            ? req.user.id
            : (req.ip as string);
    },
});

app.use(rateLimiter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/health", (_req, res) => {
    res.send({
        success: true,
        message: "Healthy 🚀",
        timeStamp: Date.now(),
    });
});

app.use(authRoutes);
app.use(vehicleRoute);
app.use(rideRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err instanceof Error ? err.message : String(err));
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    const message =
        err instanceof Error ? err.message : "Internal Server Error";

    res.status(statusCode).json({
        errors: [{ type: "Error", msg: message, path: "", location: "" }],
    });
});

export default app;
