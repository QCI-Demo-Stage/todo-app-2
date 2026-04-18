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
      <section
        className={`${styles.wrapper} task-list-region`}
        aria-labelledby="tasks-heading"
      >
        <h2 className={styles.title} id="tasks-heading">
          Tasks
        </h2>
        <p className={styles.empty} role="status">
          No tasks yet.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`${styles.wrapper} task-list-region`}
      aria-labelledby="tasks-heading"
    >
      <h2 className={styles.title} id="tasks-heading">
        Tasks
      </h2>
      <ul className={styles.list} aria-labelledby="tasks-heading">
        {tasks.map((task) => (
          <li key={task.id} className={`${styles.item} task-list-item`}>
            <p className={styles.label}>{task.title}</p>
            <div className={`${styles.actions} task-list-actions`}>
              <button
                type="button"
                className={`${styles.iconButton} task-list-icon-button`}
                aria-label={`Edit task: ${task.title}`}
                onClick={() => setEditTarget(task)}
              >
                <svg
                  className={styles.icon}
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/icons.svg#edit-icon" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.iconButton} task-list-icon-button`}
                aria-label={`Delete task: ${task.title}`}
                onClick={() => setDeleteTarget(task)}
              >
                <svg
                  className={styles.icon}
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
    </section>
  );
}

export default TaskList;
