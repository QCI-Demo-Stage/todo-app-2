import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  completed: Joi.boolean().optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).optional(),
  completed: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "Provide at least one of title or completed",
  });
