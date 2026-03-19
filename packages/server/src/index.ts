import Fastify from "fastify";
import cors from "@fastify/cors";
import { healthRoutes } from "./routes/health.js";

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: process.env["CORS_ORIGIN"] ?? "http://localhost:5173",
});

server.register(healthRoutes, { prefix: "/api" });

const port = Number(process.env["PORT"] ?? 3000);
const host = process.env["HOST"] ?? "0.0.0.0";

try {
  await server.listen({ port, host });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
