import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRoutes from "./routes/auth.route";
import * as swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import vehicleRoute from "./routes/vehicle.route";
import { aj } from "./config/arcjet";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/health", (_req, res) => {
    res.send({
        success: true,
        message: "Healthy 🚀",
        timeStamp: Date.now(),
    });
});

app.use("/", async (req: Request, res: Response, next: NextFunction) => {
    const decision = await aj.protect(req, {
        requested: 1,
    });
    if (decision.isAllowed()) {
        next();
    } else {
        res.status(429).json({
            success: false,
            message: "You are going too fast. Please slow down",
        });
    }
});

app.use(authRoutes);
app.use(vehicleRoute);

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [{ type: err.name, msg: err.message, path: "", location: "" }],
    });
});

export default app;
