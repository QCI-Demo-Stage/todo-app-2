import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

import useDialogFocusTrap from "../hooks/useDialogFocusTrap";
import { useAppDispatch } from "../store/hooks";
import { updateTask, type Task } from "../store/taskSlice";

import styles from "./Dialog.module.css";

type EditTaskModalProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

function EditTaskModal({ task, isOpen, onClose }: EditTaskModalProps) {
  const dispatch = useAppDispatch();
  const titleHeadingId = useId();
  const titleFieldHintId = useId();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setDueDate(task.dueDate ?? "");
    }
  }, [isOpen, task.id, task.title, task.description, task.dueDate]);

  const containerRef = useDialogFocusTrap(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  const trimmedTitle = title.trim();
  const canSave = trimmedTitle.length > 0;
  const titleInvalid = title.length > 0 && !canSave;

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    dispatch(
      updateTask({
        id: task.id,
        title: trimmedTitle,
        description: description.trim() ? description.trim() : undefined,
        dueDate: dueDate || undefined,
      }),
    );
    toast.success("Task updated.");
    onClose();
  };

  return createPortal(
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleHeadingId}
        className={styles.panel}
      >
        <h2 id={titleHeadingId} className={styles.title}>
          Edit task
        </h2>
        <div className={styles.field}>
          <label className={styles.label}>
            Title
            <input
              id="edit-task-title"
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
              aria-describedby={titleInvalid ? titleFieldHintId : undefined}
              aria-invalid={titleInvalid}
              aria-required
            />
          </label>
          {titleInvalid ? (
            <p id={titleFieldHintId} className={styles.fieldHint} role="alert">
              Task title cannot be empty.
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="edit-task-description">
            Description <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            id="edit-task-description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="edit-task-due">
            Due date <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="edit-task-due"
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleSave}
            disabled={!canSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default EditTaskModal;
