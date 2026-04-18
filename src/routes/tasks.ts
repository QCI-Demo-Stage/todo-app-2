import { Router } from "express";
import { all, get, run } from "../db/database";
import { rowToTodo, type TodoRow } from "../types/todo";
import type { ApiError } from "../middleware/errorHandler";

const router = Router();

function parseId(param: string): number {
  const id = Number(param);
  if (!Number.isInteger(id) || id < 1) {
    const err: ApiError = new Error("Invalid task id");
    err.statusCode = 400;
    throw err;
  }
  return id;
}

router.get("/", async (_req, res, next) => {
  try {
    const rows = await all<TodoRow>(
      "SELECT id, title, completed, created_at FROM tasks ORDER BY id ASC"
    );
    res.json(rows.map(rowToTodo));
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const title = req.body?.title;
    if (typeof title !== "string" || title.trim().length === 0) {
      const err: ApiError = new Error("title is required and must be a non-empty string");
      err.statusCode = 400;
      throw err;
    }
    let completed = false;
    if (req.body?.completed !== undefined) {
      if (typeof req.body.completed !== "boolean") {
        const err: ApiError = new Error("completed must be a boolean when provided");
        err.statusCode = 400;
        throw err;
      }
      completed = req.body.completed;
    }
    const result = await run(
      "INSERT INTO tasks (title, completed) VALUES (?, ?)",
      [title.trim(), completed ? 1 : 0]
    );
    const row = await get<TodoRow>(
      "SELECT id, title, completed, created_at FROM tasks WHERE id = ?",
      [result.lastID]
    );
    if (!row) {
      const err: ApiError = new Error("Failed to load created task");
      err.statusCode = 500;
      throw err;
    }
    res.status(201).json(rowToTodo(row));
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const existing = await get<TodoRow>(
      "SELECT id, title, completed, created_at FROM tasks WHERE id = ?",
      [id]
    );
    if (!existing) {
      const err: ApiError = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }
    const hasTitle = req.body?.title !== undefined;
    const hasCompleted = req.body?.completed !== undefined;
    if (!hasTitle && !hasCompleted) {
      const err: ApiError = new Error(
        "Request body must include at least one of: title, completed"
      );
      err.statusCode = 400;
      throw err;
    }
    let title = existing.title;
    if (hasTitle) {
      if (typeof req.body.title !== "string" || req.body.title.trim().length === 0) {
        const err: ApiError = new Error("title must be a non-empty string when provided");
        err.statusCode = 400;
        throw err;
      }
      title = req.body.title.trim();
    }
    let completed = existing.completed === 1;
    if (hasCompleted) {
      if (typeof req.body.completed !== "boolean") {
        const err: ApiError = new Error("completed must be a boolean when provided");
        err.statusCode = 400;
        throw err;
      }
      completed = req.body.completed;
    }
    await run("UPDATE tasks SET title = ?, completed = ? WHERE id = ?", [
      title,
      completed ? 1 : 0,
      id,
    ]);
    const row = await get<TodoRow>(
      "SELECT id, title, completed, created_at FROM tasks WHERE id = ?",
      [id]
    );
    if (!row) {
      const err: ApiError = new Error("Task not found after update");
      err.statusCode = 500;
      throw err;
    }
    res.json(rowToTodo(row));
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const result = await run("DELETE FROM tasks WHERE id = ?", [id]);
    if (result.changes === 0) {
      const err: ApiError = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
