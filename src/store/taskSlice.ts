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

export interface TaskState {
  items: Task[];
  editingId: number | null;
}

const initialState: TaskState = {
  items: [
    { id: 1, title: "Example task" },
    { id: 2, title: "Another task" },
  ],
  editingId: null,
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
    editTask: (state, action: PayloadAction<number>) => {
      state.editingId = action.payload;
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      if (state.editingId === action.payload) {
        state.editingId = null;
      }
    },
  },
});

export const { addTask, editTask, deleteTask } = taskSlice.actions;
