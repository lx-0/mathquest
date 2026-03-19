import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import { healthRoutes } from "./health.js";

describe("GET /api/health", () => {
  it("returns status ok", async () => {
    const app = Fastify();
    app.register(healthRoutes, { prefix: "/api" });
    await app.ready();

    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: "ok" });
  });
});
