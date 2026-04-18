import { Router } from "express";
import { all, get, run } from "../db/database";
import { TodoRow, todoFromRow } from "../models/todo";

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

router.post("/", async (req, res, next) => {
  try {
    const titleRaw = req.body?.title;
    if (typeof titleRaw !== "string") {
      res.status(400).json({ error: "title is required and must be a string" });
      return;
    }
    const title = titleRaw.trim();
    if (title.length === 0) {
      res.status(400).json({ error: "title must not be empty" });
      return;
    }

    const createdAt = new Date().toISOString();
    const result = await run(
      "INSERT INTO todos (title, completed, createdAt) VALUES (?, 0, ?)",
      [title, createdAt]
    );
    const row = await get<TodoRow>("SELECT * FROM todos WHERE id = ?", [
      result.lastID,
    ]);
    if (!row) {
      res.status(500).json({ error: "Failed to load created todo" });
      return;
    }
    res.status(201).json(todoFromRow(row));
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id ?? "");
    if (id === null) {
      res.status(400).json({ error: "Invalid todo id" });
      return;
    }

    const { title: titleRaw, completed: completedRaw } = req.body ?? {};
    const updates: string[] = [];
    const params: unknown[] = [];

    if (titleRaw !== undefined) {
      if (typeof titleRaw !== "string") {
        res.status(400).json({ error: "title must be a string" });
        return;
      }
      const title = titleRaw.trim();
      if (title.length === 0) {
        res.status(400).json({ error: "title must not be empty" });
        return;
      }
      updates.push("title = ?");
      params.push(title);
    }

    if (completedRaw !== undefined) {
      if (typeof completedRaw !== "boolean") {
        res.status(400).json({ error: "completed must be a boolean" });
        return;
      }
      updates.push("completed = ?");
      params.push(completedRaw ? 1 : 0);
    }

    if (updates.length === 0) {
      res
        .status(400)
        .json({ error: "Provide at least one of title or completed" });
      return;
    }

    params.push(id);
    const sql = `UPDATE todos SET ${updates.join(", ")} WHERE id = ?`;
    const result = await run(sql, params);
    if (result.changes === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    const row = await get<TodoRow>("SELECT * FROM todos WHERE id = ?", [id]);
    if (!row) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(200).json(todoFromRow(row));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id ?? "");
    if (id === null) {
      res.status(400).json({ error: "Invalid todo id" });
      return;
    }

    const result = await run("DELETE FROM todos WHERE id = ?", [id]);
    if (result.changes === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(200).json({ message: "Todo deleted", id });
  } catch (err) {
    next(err);
  }
});

export default router;
