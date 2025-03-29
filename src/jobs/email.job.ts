import { Job, Queue, Worker } from "bullmq";
import { defaultJobOptions, redisConnection } from "../config/queue";
import logger from "../config/logger";
import { EmailJobData } from "../types";
import { sendOtpEmail } from "../utils/send.email";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
    connection: redisConnection,
    defaultJobOptions,
});

export const handler = new Worker(
    emailQueueName,
    async (job: Job<EmailJobData>) => {
        const data = job.data;
        await sendOtpEmail(data.otp, data.email);
    },
    {
        connection: redisConnection,
    },
);

handler.on("completed", (job) => {
    logger.info(`Job ${job?.id} completed`);
});

handler.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed:`, err);
});
