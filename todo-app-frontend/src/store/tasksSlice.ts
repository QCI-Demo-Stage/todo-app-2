import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isEditing?: boolean;
};

export type NewTaskPayload = {
  title: string;
  description?: string;
  dueDate?: string;
};

const initialState: Task[] = [
  { id: '1', title: 'Learn React' },
  { id: '2', title: 'Build the todo UI' },
  { id: '3', title: 'Ship the feature' },
];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<NewTaskPayload>) {
      const { title, description, dueDate } = action.payload;
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      state.push({
        id,
        title: title.trim(),
        ...(description?.trim()
          ? { description: description.trim() }
          : {}),
        ...(dueDate ? { dueDate } : {}),
      });
    },
    editTask(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.forEach((task) => {
        const next = task;
        next.isEditing = task.id === id;
      });
    },
    deleteTask(state, action: PayloadAction<string>) {
      return state.filter((task) => task.id !== action.payload);
    },
  },
});

export const { addTask, editTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
