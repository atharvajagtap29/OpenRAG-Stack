import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger_output.json" with { type: "json" };

const app = express();

// All application middlewares
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes import
import healthcheckRouter from "./routes/healthcheck.routes.js";
import contextRouter from "./routes/context.routes.js";
import agentRouter from "./routes/agent.routes.js"

// Mount routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/context", contextRouter);
app.use("/api/v1/agent", agentRouter);

// 404 Fallback
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export { app };
