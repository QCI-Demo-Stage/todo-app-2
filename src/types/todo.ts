export interface TodoRow {
  id: number;
  title: string;
  completed: number;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}
