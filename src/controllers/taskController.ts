import type { Request, Response } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksForUser,
  updateTask,
  TaskResponse,
} from "../services/taskService";

export const createTaskHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await createTask(req.body, req.user!._id.toString());
  res.status(201).json({ message: "Task created successfully", data: result });
};

export const getTasksHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { status, sortBy, sortOrder } = req.query;

  const filters = {
    status: status as "todo" | "in-progress" | "completed" | undefined,
    sortBy: sortBy as "createdAt" | "dueDate" | undefined,
    sortOrder: sortOrder as "asc" | "desc" | undefined,
  };

  const result = await getTasksForUser(req.user!._id.toString(), filters);
  res
    .status(200)
    .json({ message: "Tasks retrieved successfully", data: result });
};

export const getTaskByIdHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const result = await getTaskById(id as string, req.user!._id.toString());
  if (!result) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res
    .status(200)
    .json({ message: "Task retrieved successfully", data: result });
};

export const updateTaskHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const result = await updateTask(
    id as string,
    req.user!._id.toString(),
    req.body,
  );
  if (!result) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(200).json({ message: "Task updated successfully", data: result });
};
export const deleteTaskHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const deleted = await deleteTask(id as string, req.user!._id.toString());
  if (!deleted) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(200).json({ message: "Task deleted successfully" });
};
