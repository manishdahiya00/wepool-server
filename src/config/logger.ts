import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "auth-service" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.simple(),
            ),
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "app.log",
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV === "test",
        }),
    ],
});

export default logger;
