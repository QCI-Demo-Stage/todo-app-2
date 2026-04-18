import cors from "cors";
import express from "express";
import healthRouter from "./routes/health";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
