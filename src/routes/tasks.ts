import { Router } from "express";
import { all, get, run } from "../db/database";
import { BadRequestError, NotFoundError } from "../errors/httpErrors";
import { validate } from "../middleware/validate";
import { TodoRow, todoFromRow } from "../models/todo";
import { createTaskSchema, updateTaskSchema } from "../validation/taskSchemas";

const router = Router();

function parseIdParam(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  if (!Number.isFinite(id) || id < 1 || String(id) !== raw) {
    return null;
  }
  return id;
}

router.get("/", async (_req, res, next) => {
  try {
    const rows = await all<TodoRow>("SELECT * FROM todos ORDER BY id ASC");
    res.status(200).json(rows.map(todoFromRow));
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(createTaskSchema), async (req, res, next) => {
  try {
    const { title } = req.body as { title: string; completed?: boolean };

    const createdAt = new Date().toISOString();
    const result = await run(
      "INSERT INTO todos (title, completed, createdAt) VALUES (?, ?, ?)",
      [title, req.body.completed === true ? 1 : 0, createdAt]
    );
    const row = await get<TodoRow>("SELECT * FROM todos WHERE id = ?", [
      result.lastID,
    ]);
    if (!row) {
      next(new Error("Failed to load created todo"));
      return;
    }
    res.status(201).json(todoFromRow(row));
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  validate(updateTaskSchema),
  async (req, res, next) => {
    try {
      const rawId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : (req.params.id ?? "");
      const id = parseIdParam(rawId);
      if (id === null) {
        next(new BadRequestError("Invalid todo id"));
        return;
      }

      const { title, completed } = req.body as {
        title?: string;
        completed?: boolean;
      };
      const updates: string[] = [];
      const params: unknown[] = [];

      if (title !== undefined) {
        updates.push("title = ?");
        params.push(title);
      }

      if (completed !== undefined) {
        updates.push("completed = ?");
        params.push(completed ? 1 : 0);
      }

      params.push(id);
      const sql = `UPDATE todos SET ${updates.join(", ")} WHERE id = ?`;
      const result = await run(sql, params);
      if (result.changes === 0) {
        next(new NotFoundError("Todo not found"));
        return;
      }

      const row = await get<TodoRow>("SELECT * FROM todos WHERE id = ?", [id]);
      if (!row) {
        next(new NotFoundError("Todo not found"));
        return;
      }
      res.status(200).json(todoFromRow(row));
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", async (req, res, next) => {
  try {
    const rawId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : (req.params.id ?? "");
    const id = parseIdParam(rawId);
    if (id === null) {
      next(new BadRequestError("Invalid todo id"));
      return;
    }

    const result = await run("DELETE FROM todos WHERE id = ?", [id]);
    if (result.changes === 0) {
      next(new NotFoundError("Todo not found"));
      return;
    }
    res.status(200).json({ message: "Todo deleted", id });
  } catch (err) {
    next(err);
  }
});

export default router;
