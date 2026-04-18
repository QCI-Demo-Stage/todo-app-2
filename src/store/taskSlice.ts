import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
}

export type NewTaskPayload = {
  title: string;
  description?: string;
  dueDate?: string;
};

export type UpdateTaskPayload = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
};

export interface TaskState {
  items: Task[];
}

const initialState: TaskState = {
  items: [
    { id: 1, title: "Example task" },
    { id: 2, title: "Another task" },
  ],
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<NewTaskPayload>) => {
      const { title, description, dueDate } = action.payload;
      const nextId =
        state.items.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      state.items.push({
        id: nextId,
        title: title.trim(),
        ...(description?.trim()
          ? { description: description.trim() }
          : {}),
        ...(dueDate ? { dueDate } : {}),
      });
    },
    updateTask: (state, action: PayloadAction<UpdateTaskPayload>) => {
      const { id, title, description, dueDate } = action.payload;
      const task = state.items.find((t) => t.id === id);
      if (!task) {
        return;
      }
      task.title = title.trim();
      if (description !== undefined && description.trim()) {
        task.description = description.trim();
      } else {
        delete task.description;
      }
      if (dueDate) {
        task.dueDate = dueDate;
      } else {
        delete task.dueDate;
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;
