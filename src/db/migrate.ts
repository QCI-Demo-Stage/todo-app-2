import { run } from "./database";

export async function migrate(): Promise<void> {
  await run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `);
}
