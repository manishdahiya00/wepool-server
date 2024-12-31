import request from "supertest";
import app from "./app";
describe("APP", () => {
    it("should run app and return 200 status code", async () => {
        const response = await request(app).get("/health");
        expect(response.statusCode).toBe(200);
    });
});
