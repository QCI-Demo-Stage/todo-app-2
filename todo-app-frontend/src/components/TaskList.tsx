import { useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../store/store';
import type { Task } from '../store/tasksSlice';

import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import EditTaskModal from './EditTaskModal';

import styles from './TaskList.module.css';

function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Tasks</h2>
        <p className={styles.empty}>No tasks yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Tasks</h2>
      <ul className={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.item}>
            <p className={styles.label}>{task.title}</p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Edit task: ${task.title}`}
                onClick={() => setEditTarget(task)}
              >
                <svg
                  className={styles.icon}
                  role="img"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/icons.svg#edit-icon" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Delete task: ${task.title}`}
                onClick={() => setDeleteTarget(task)}
              >
                <svg
                  className={styles.icon}
                  role="img"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/icons.svg#delete-icon" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editTarget && (
        <EditTaskModal
          task={editTarget}
          isOpen
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmationDialog
          taskId={deleteTarget.id}
          taskTitle={deleteTarget.title}
          isOpen
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default TaskList;
