import { config } from "dotenv";
config();

const {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SERVICE,
    REDIS_HOST,
    REDIS_PORT,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    SMTP_HOST,
    SMTP_PASS,
    SMTP_PORT,
    SMTP_USER,
    SMTP_SERVICE,
    REDIS_HOST,
    REDIS_PORT,
};
