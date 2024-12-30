import express from "express";

const app = express();

app.get("/health", (req, res) => {
    res.send({
        success: true,
        message: "Healthy 🚀",
        timeStamp: Date.now(),
    });
});

export default app;
