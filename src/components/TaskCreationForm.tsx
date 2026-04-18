import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

import { addTask, type NewTaskPayload } from "../store/taskSlice";
import { useAppDispatch } from "../store/hooks";

import styles from "./TaskCreationForm.module.css";

type FieldErrors = {
  title?: string;
  dueDate?: string;
};

function validate(title: string, dueDate: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = title.trim();
  if (!trimmed) {
    errors.title = "Title is required.";
  }
  if (dueDate) {
    const parsed = Date.parse(`${dueDate}T00:00:00`);
    if (Number.isNaN(parsed)) {
      errors.dueDate = "Enter a valid due date.";
    }
  }
  return errors;
}

export function TaskCreationForm() {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearError = (field: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(title, dueDate);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload: NewTaskPayload = {
      title: title.trim(),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(dueDate ? { dueDate } : {}),
    };
    dispatch(addTask(payload));
    setTitle("");
    setDescription("");
    setDueDate("");
    setErrors({});
    toast.success("Task added.");
  };

  return (
    <section className={styles.wrapper} aria-labelledby="task-form-heading">
      <h2 id="task-form-heading" className={styles.title}>
        Add a task
      </h2>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label}>
            Title <span aria-hidden="true">*</span>
            <input
              className={`${styles.input} ${errors.title ? styles.inputInvalid : ""}`}
              type="text"
              name="title"
              value={title}
              onChange={(ev) => {
                setTitle(ev.target.value);
                clearError("title");
              }}
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? "task-creation-title-error" : undefined}
            />
          </label>
          {errors.title ? (
            <span
              id="task-creation-title-error"
              className={styles.error}
              role="alert"
            >
              {errors.title}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Description <span className={styles.optional}>(optional)</span>
            <textarea
              className={styles.textarea}
              name="description"
              value={description}
              onChange={(ev) => {
                setDescription(ev.target.value);
              }}
              rows={4}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Due date <span className={styles.optional}>(optional)</span>
            <input
              className={`${styles.input} ${errors.dueDate ? styles.inputInvalid : ""}`}
              type="date"
              name="dueDate"
              value={dueDate}
              onChange={(ev) => {
                setDueDate(ev.target.value);
                clearError("dueDate");
              }}
              aria-invalid={errors.dueDate ? true : undefined}
              aria-describedby={
                errors.dueDate ? "task-creation-due-date-error" : undefined
              }
            />
          </label>
          {errors.dueDate ? (
            <span
              id="task-creation-due-date-error"
              className={styles.error}
              role="alert"
            >
              {errors.dueDate}
            </span>
          ) : null}
        </div>

        <div className={styles.submitRow}>
          <button className={styles.submit} type="submit">
            Add task
          </button>
        </div>
      </form>
    </section>
  );
}
