/** SQLite row shape for the `todos` table */
export interface TodoRow {
  id: number;
  title: string;
  completed: number;
  createdAt: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export function todoFromRow(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed !== 0,
    createdAt: row.createdAt,
  };
}
