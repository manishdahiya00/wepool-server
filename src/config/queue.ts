import { Config } from ".";

export const redisConnection = {
    host: Config.REDIS_HOST,
    port: Number(Config.REDIS_PORT),
};

export const defaultJobOptions = {
    delay: 5000,
    removeOnComplete: true,
    attempts: 3,
    backoff: {
        type: "exponential",
        delay: 1000,
    },
    removeOnFail: true,
};
