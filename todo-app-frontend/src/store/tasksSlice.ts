import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Task = {
  id: string;
  title: string;
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
    updateTask(
      state,
      action: PayloadAction<{ id: string; title: string }>,
    ) {
      const { id, title } = action.payload;
      const task = state.find((t) => t.id === id);
      if (task) {
        task.title = title;
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      return state.filter((task) => task.id !== action.payload);
    },
  },
});

export const { updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
