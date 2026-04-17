import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Task } from './types';

export type AddTaskPayload = Pick<Task, 'title' | 'description' | 'dueDate'>;

type TasksState = {
  items: Task[];
};

const initialState: TasksState = {
  items: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<AddTaskPayload>) => {
      const { title, description, dueDate } = action.payload;
      state.items.push({
        id: crypto.randomUUID(),
        title,
        description,
        dueDate,
      });
    },
  },
});

export const { addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
