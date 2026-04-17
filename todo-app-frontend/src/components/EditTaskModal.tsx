import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch } from '../store/hooks';
import { updateTask, type Task } from '../store/tasksSlice';
import useDialogFocusTrap from '../hooks/useDialogFocusTrap';

import styles from './Dialog.module.css';

type EditTaskModalProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

function EditTaskModal({ task, isOpen, onClose }: EditTaskModalProps) {
  const dispatch = useAppDispatch();
  const titleId = useId();
  const titleLabelId = useId();
  const [title, setTitle] = useState(task.title);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
    }
  }, [isOpen, task.id, task.title]);

  const containerRef = useDialogFocusTrap(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  const trimmedTitle = title.trim();
  const canSave = trimmedTitle.length > 0;

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    dispatch(updateTask({ id: task.id, title: trimmedTitle }));
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
        aria-labelledby={titleId}
        className={styles.panel}
      >
        <h2 id={titleId} className={styles.title}>
          Edit task
        </h2>
        <div className={styles.field}>
          <span id={titleLabelId} className={styles.label}>
            Title
          </span>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
            aria-labelledby={titleLabelId}
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
