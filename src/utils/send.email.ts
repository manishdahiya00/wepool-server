import nodemailer from "nodemailer";
import { Config } from "../config";
import createHttpError from "http-errors";
import logger from "../config/logger";

const transporter = nodemailer.createTransport({
    service: Config.SMTP_SERVICE,
    auth: {
        user: Config.SMTP_USER,
        pass: Config.SMTP_PASS,
    },
});

export async function sendOtpEmail(otp: string, email: string) {
    const mailOptions = {
        from: `"WePool" <${Config.SMTP_USER}>`,
        to: email,
        subject: "WePool - OTP",
        text: `Your OTP code is: ${otp}.`,
        html: `<p>Your OTP code is: <strong>${otp}</strong>.`,
    };

    try {
        logger.info(`📤 Sending OTP email to ${email}...`);
        const info = await transporter.sendMail(mailOptions);
        logger.info(`✅ Email sent: ${info.response}`);
        logger.info(`📩 Message ID: ${info.messageId}`);
    } catch (error: any) {
        logger.error(`❌ Email failed: ${error}`);
        throw createHttpError(500, "Error sending email");
    }
}
