import { useState } from "react";

import { useAppSelector } from "../store/hooks";
import type { Task } from "../store/taskSlice";

import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import EditTaskModal from "./EditTaskModal";
import { DeleteIcon } from "./icons/DeleteIcon";
import { EditIcon } from "./icons/EditIcon";
import styles from "./TaskList.module.css";

export function TaskList() {
  const tasks = useAppSelector((state) => state.tasks.items);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <section
        className={`${styles.section} task-list-region`}
        aria-labelledby="tasks-heading"
      >
        <h2 id="tasks-heading" className={styles.heading}>
          Your tasks
        </h2>
        <p className={styles.empty} role="status">
          No tasks yet.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`${styles.section} task-list-region`}
      aria-labelledby="tasks-heading"
    >
      <h2 id="tasks-heading" className={styles.heading}>
        Your tasks
      </h2>
      <ul className={styles.list} aria-labelledby="tasks-heading">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`${styles.item} task-list-item`}
          >
            <div className={styles.body}>
              <span className={styles.title}>{task.title}</span>
              {task.description ? (
                <p className={styles.meta}>{task.description}</p>
              ) : null}
              {task.dueDate ? (
                <p className={styles.meta}>
                  <span className={styles.metaLabel}>Due:</span>{" "}
                  <time dateTime={task.dueDate}>
                    {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString()}
                  </time>
                </p>
              ) : null}
            </div>
            <div className={`${styles.actions} task-list-actions`}>
              <button
                type="button"
                className={`${styles.iconButton} task-list-icon-button`}
                aria-label={`Edit task: ${task.title}`}
                onClick={() => setEditTarget(task)}
              >
                <EditIcon />
              </button>
              <button
                type="button"
                className={`${styles.iconButton} task-list-icon-button`}
                aria-label={`Delete task: ${task.title}`}
                onClick={() => setDeleteTarget(task)}
              >
                <DeleteIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editTarget ? (
        <EditTaskModal
          task={editTarget}
          isOpen
          onClose={() => setEditTarget(null)}
        />
      ) : null}
      {deleteTarget ? (
        <DeleteConfirmationDialog
          taskId={deleteTarget.id}
          taskTitle={deleteTarget.title}
          isOpen
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </section>
  );
}
