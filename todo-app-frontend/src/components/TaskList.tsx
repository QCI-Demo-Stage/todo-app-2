import { useSelector } from 'react-redux';

import { deleteTask, editTask } from '../store/tasksSlice';
import { useAppDispatch } from '../store/hooks';
import type { RootState } from '../store/store';

import styles from './TaskList.module.css';

function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useAppDispatch();

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
          <li
            key={task.id}
            className={`${styles.item} ${task.isEditing ? styles.itemEditing : ''}`}
          >
            <div className={styles.taskBody}>
              <p className={styles.label}>{task.title}</p>
              {task.description ? (
                <p className={styles.meta}>{task.description}</p>
              ) : null}
              {task.dueDate ? (
                <p className={styles.meta}>
                  <span className={styles.metaLabel}>Due:</span>{' '}
                  <time dateTime={task.dueDate}>
                    {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString()}
                  </time>
                </p>
              ) : null}
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Edit task: ${task.title}`}
                onClick={() => dispatch(editTask(task.id))}
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
                onClick={() => dispatch(deleteTask(task.id))}
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
    </div>
  );
}

export default TaskList;
