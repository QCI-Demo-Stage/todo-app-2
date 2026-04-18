import type { KeyboardEvent } from "react";

import { deleteTask, editTask } from "../store/taskSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { DeleteIcon } from "./icons/DeleteIcon";
import { EditIcon } from "./icons/EditIcon";
import styles from "./TaskList.module.css";

function activateButtonKey(e: KeyboardEvent, action: () => void): void {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    action();
  }
}

export function TaskList() {
  const tasks = useAppSelector((state) => state.tasks.items);
  const dispatch = useAppDispatch();

  return (
    <section className={styles.section} aria-label="Task list">
      <ul className={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.item}>
            <span className={styles.title}>{task.title}</span>
            <div className={styles.actions}>
              <span
                className={styles.iconButton}
                tabIndex={0}
                role="button"
                aria-label={`Edit task: ${task.title}`}
                onClick={() => dispatch(editTask(task.id))}
                onKeyDown={(e) =>
                  activateButtonKey(e, () => dispatch(editTask(task.id)))
                }
              >
                <EditIcon />
              </span>
              <span
                className={styles.iconButton}
                tabIndex={0}
                role="button"
                aria-label={`Delete task: ${task.title}`}
                onClick={() => dispatch(deleteTask(task.id))}
                onKeyDown={(e) =>
                  activateButtonKey(e, () => dispatch(deleteTask(task.id)))
                }
              >
                <DeleteIcon />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
