import { get, run } from "../src/db/database";

async function main(): Promise<void> {
  await run(
    `CREATE TABLE IF NOT EXISTS _connection_test (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note TEXT NOT NULL
    )`
  );
  await run("INSERT INTO _connection_test (note) VALUES (?)", ["dummy"]);

  const row = await get<{ id: number; note: string }>(
    "SELECT id, note FROM _connection_test ORDER BY id DESC LIMIT 1"
  );

  console.log("SQLite connection OK. Last inserted row:", row);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
