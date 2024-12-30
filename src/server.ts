import app from "./app";
import { Config } from "./config";

const startServer = () => {
    const PORT = Config.PORT;

    try {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server: ", error);
        process.exit(1);
    }
};

startServer();
