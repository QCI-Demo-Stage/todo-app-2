import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Task = {
  id: string;
  title: string;
  isEditing?: boolean;
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

export const { editTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
