import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  title: string;
}

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

export const { editTask, deleteTask } = taskSlice.actions;
