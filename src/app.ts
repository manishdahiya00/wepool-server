import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRoutes from "./routes/auth.route";
import * as swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import vehicleRoute from "./routes/vehicle.route";
import rideRoutes from "./routes/ride.route";
import { rateLimit, RateLimitRequestHandler } from "express-rate-limit";
import userRoutes from "./routes/user.route";
import stopoverRoutes from "./routes/stopover.route";
import expressBasicAuth from "express-basic-auth";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const swaggerAuth = expressBasicAuth({
    users: { ["admin"]: process.env.SWAGGER_AUTH_PASSWORD! },
    challenge: true,
});

app.use("/docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(specs));

app.get("/delete-account", (req, res) => {
    res.send(`
    <html>
      <head><title>Delete Your Account</title></head>
      <body style="font-family:sans-serif;padding:2rem;display:flex;justify-content:center;flex-direction:column;width:100%;height:100vh;align-items:center;text-align:center;background-color:#f5f5f5;color:#333;margin:0;box-sizing:border-box;font-size:24px;">
        <h1>Delete Your Account</h1>
        <p>If you want to delete your account, please contact us at <a href="mailto:wepool@gmail.com">wepool@gmail.com</a></p>
      </body>
    </html>
  `);
});

app.get("/health", (_req, res) => {
    res.send({
        success: true,
        message: "Healthy 🚀",
        timeStamp: Date.now(),
    });
});

app.use(authRoutes);
app.use(userRoutes);
app.use(vehicleRoute);
app.use(rideRoutes);
app.use(stopoverRoutes);

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
