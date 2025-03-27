import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
    return error.issues.map((issue) => {
        const field = issue.path.join(".");
        const capitalizedField = field.replace(/^./, (char) =>
            char.toUpperCase(),
        );

        const message =
            issue.code === "invalid_type" && issue.message.includes("Required")
                ? `${capitalizedField} is required.`
                : issue.message;

        return {
            field: capitalizedField || "General",
            message,
        };
    });
};
