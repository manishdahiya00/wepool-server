import { config } from "dotenv";
config();

const { PORT, NODE_ENV, JWT_SECRET } = process.env;

export const Config = { PORT, NODE_ENV, JWT_SECRET };
