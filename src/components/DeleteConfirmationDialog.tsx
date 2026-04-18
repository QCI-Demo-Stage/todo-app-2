import { useId } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

import useDialogFocusTrap from "../hooks/useDialogFocusTrap";
import { useAppDispatch } from "../store/hooks";
import { deleteTask } from "../store/taskSlice";

import styles from "./Dialog.module.css";

type DeleteConfirmationDialogProps = {
  taskId: number;
  taskTitle: string;
  isOpen: boolean;
  onClose: () => void;
};

function DeleteConfirmationDialog({
  taskId,
  taskTitle,
  isOpen,
  onClose,
}: DeleteConfirmationDialogProps) {
  const dispatch = useAppDispatch();
  const titleId = useId();
  const messageId = useId();
  const containerRef = useDialogFocusTrap(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    dispatch(deleteTask(taskId));
    toast.success("Task deleted.");
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
        aria-describedby={messageId}
        className={styles.panel}
      >
        <h2 id={titleId} className={styles.title}>
          Delete task?
        </h2>
        <p id={messageId} className={styles.message}>
          Are you sure you want to delete &ldquo;{taskTitle}&rdquo;? This cannot
          be undone.
        </p>
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
            className={`${styles.button} ${styles.buttonDanger}`}
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default DeleteConfirmationDialog;
