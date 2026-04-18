import cors from "cors";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { migrate } from "./db/migrate";
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

void migrate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((err: unknown) => {
    console.error("Database migration failed:", err);
    process.exit(1);
  });
