import { Queue } from "bullmq";
import { Redis } from "ioredis";

const redisConnection = new Redis({
    host: "localhost",
    port: 6379,
});

const emailQueue = new Queue("emailQueue", { connection: redisConnection });

export const sendOtpEmailJob = async (email: string, otp: string) => {
    await emailQueue.add(
        "sendOtp",
        { email, otp },
        { removeOnComplete: false, delay: 0 },
    );
};
