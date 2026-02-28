import { Task, type ITask } from "../models/Task";

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  dueDate?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const toTaskResponse = (task: ITask): TaskResponse => ({
  id: task._id.toString(),
  title: task.title,
  description: task.description,
  status: task.status,
  dueDate: task.dueDate,
  closedAt: task.closedAt,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export const createTask = async (
  input: {
    title: string;
    description?: string;
    dueDate?: Date;
  },
  userId: string,
): Promise<TaskResponse> => {
  const task = await Task.create({
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    userId,
  });

  return toTaskResponse(task);
};

export const getTasksForUser = async (
  userId: string,
  filters?: {
    status?: "todo" | "in-progress" | "completed";
    sortBy?: "createdAt" | "dueDate";
    sortOrder?: "asc" | "desc";
  },
): Promise<TaskResponse[]> => {
  const query: any = { userId };

  if (filters?.status) {
    query.status = filters.status;
  }

  const sortField = filters?.sortBy || "createdAt";
  const sortDirection = filters?.sortOrder === "asc" ? 1 : -1;

  const tasks = await Task.find(query).sort({ [sortField]: sortDirection });
  return tasks.map(toTaskResponse);
};

export const getTaskById = async (
  taskId: string,
  userId: string,
): Promise<TaskResponse | null> => {
  const task = await Task.findOne({ _id: taskId, userId });
  return task ? toTaskResponse(task) : null;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  input: {
    title?: string;
    description?: string;
    status?: "todo" | "in-progress" | "completed";
    dueDate?: Date;
  },
): Promise<TaskResponse | null> => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { $set: input },
    { new: true },
  );

  return task ? toTaskResponse(task) : null;
};

export const deleteTask = async (
  taskId: string,
  userId: string,
): Promise<boolean> => {
  const result = await Task.deleteOne({ _id: taskId, userId });
  return result.deletedCount === 1;
};
