import cors from "cors";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import "./db/database";
import { ensureSchema } from "./db/schema";
import { errorHandler } from "./middleware/errorHandler";
import healthRouter from "./routes/health";
import tasksRouter from "./routes/tasks";

const app = express();
const port = 3000;

const openApiSpec = YAML.load(path.join(__dirname, "docs/openapi.yaml"));

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/health", healthRouter);
app.use("/tasks", tasksRouter);

app.use(errorHandler);

void ensureSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((err: unknown) => {
    console.error("Failed to initialize database schema:", err);
    process.exit(1);
  });
