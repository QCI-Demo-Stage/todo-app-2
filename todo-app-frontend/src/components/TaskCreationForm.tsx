import { type FormEvent, useId, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import type { AppDispatch } from '../store';
import { addTask } from '../store/tasksSlice';

import './TaskCreationForm.css';

type FieldErrors = {
  title?: string;
};

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
};

export default function TaskCreationForm() {
  const dispatch = useDispatch<AppDispatch>();
  const baseId = useId();

  const [title, setTitle] = useState(initialForm.title);
  const [description, setDescription] = useState(initialForm.description);
  const [dueDate, setDueDate] = useState(initialForm.dueDate);
  const [errors, setErrors] = useState<FieldErrors>({});

  const titleId = `${baseId}-title`;
  const titleErrorId = `${baseId}-title-error`;
  const descriptionId = `${baseId}-description`;
  const dueDateId = `${baseId}-due-date`;

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!title.trim()) {
      next.title = 'Title is required.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    dispatch(
      addTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate.trim(),
      }),
    );

    setTitle(initialForm.title);
    setDescription(initialForm.description);
    setDueDate(initialForm.dueDate);
    setErrors({});

    toast.success('Task created.');
  }

  return (
    <form
      className="task-creation-form"
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={`${baseId}-heading`}
    >
      <h2 className="task-creation-form__heading" id={`${baseId}-heading`}>
        New task
      </h2>

      <div className="task-creation-form__field">
        <label className="task-creation-form__label" htmlFor={titleId}>
          <span className="task-creation-form__label-text">
            Title <span aria-hidden="true">*</span>
          </span>
          <input
            id={titleId}
            className="task-creation-form__input"
            type="text"
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            autoComplete="off"
            aria-required="true"
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? titleErrorId : undefined}
          />
        </label>
        {errors.title ? (
          <span
            id={titleErrorId}
            className="task-creation-form__error"
            role="alert"
          >
            {errors.title}
          </span>
        ) : null}
      </div>

      <div className="task-creation-form__field">
        <label className="task-creation-form__label" htmlFor={descriptionId}>
          <span className="task-creation-form__label-text">Description</span>
          <textarea
            id={descriptionId}
            className="task-creation-form__textarea"
            name="description"
            value={description}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      <div className="task-creation-form__field">
        <label className="task-creation-form__label" htmlFor={dueDateId}>
          <span className="task-creation-form__label-text">Due date</span>
          <input
            id={dueDateId}
            className="task-creation-form__input"
            type="date"
            name="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="task-creation-form__submit">
        Add task
      </button>
    </form>
  );
}
