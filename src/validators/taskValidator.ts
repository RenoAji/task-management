import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["todo", "in-progress", "completed"]).default("todo"),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
  dueDate: z.coerce.date().optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const getTasksSchema = z.object({
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
  sortBy: z.enum(["createdAt", "dueDate"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const taskIdFormat = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid task id format");
