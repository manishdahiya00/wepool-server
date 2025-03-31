import arcjet, {
    shield,
    detectBot,
    tokenBucket,
    validateEmail,
} from "@arcjet/node";
import { Config } from ".";

const aj = arcjet({
    key: Config.ARCJET_KEY!,
    characteristics: ["ip.src"],
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE"],
        }),

        shield({ mode: "LIVE" }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }),
    ],
});

const emailAj = arcjet({
    key: Config.ARCJET_KEY!,
    characteristics: ["email"],
    rules: [
        shield({ mode: "LIVE" }),
        validateEmail({
            mode: "LIVE",
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }),
    ],
});

export { aj, emailAj };
