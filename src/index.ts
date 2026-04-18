import cors from "cors";
import express from "express";
import { migrate } from "./db/migrate";
import healthRouter from "./routes/health";
import tasksRouter from "./routes/tasks";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/tasks", tasksRouter);

void migrate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database migration failed:", err);
    process.exit(1);
  });
