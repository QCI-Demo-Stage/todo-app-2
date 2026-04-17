export type Task = {
  id: string;
  title: string;
  description: string;
  /** ISO date string (yyyy-mm-dd) or empty */
  dueDate: string;
};
