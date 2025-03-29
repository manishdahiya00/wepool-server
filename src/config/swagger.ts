import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WePool API",
            version: "1.0.0",
            description: "WePool API",
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "Development Server",
            },
            {
                url: "http://13.202.226.63/api",
                description: "Production Server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};

export const specs = swaggerJsdoc(options);
