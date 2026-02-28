import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./routes/auth";
import { taskRouter } from "./routes/task";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// API Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customSiteTitle: "Task Management API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
