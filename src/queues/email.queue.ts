import { Queue } from "bullmq";
import { Redis } from "ioredis";

const redisConnection = new Redis({
    host: "localhost",
    port: 6379,
});

const emailQueue = new Queue("emailQueue", { connection: redisConnection });

export const sendOtpEmailJob = async (email: string, otp: string) => {
    console.log(`📩 Adding job to queue for ${email}`);
    const job = await emailQueue.add(
        "sendOtp",
        { email, otp },
        { removeOnComplete: false, delay: 0 },
    );
    console.log(`✅ Job added successfully: ${job.id}`);
};
