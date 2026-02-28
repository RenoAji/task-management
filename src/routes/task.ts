import { Router } from "express";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateTaskHandler,
} from "../controllers/taskController";
import { authGuard } from "../middleware/auth";
import { validate, validatePathParam } from "../middleware/validation";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdFormat,
} from "../validators/taskValidator";

const taskRouter = Router();

taskRouter.post("/", authGuard, validate(createTaskSchema), createTaskHandler);
taskRouter.get("/", authGuard, getTasksHandler);
taskRouter.get(
  "/:id",
  authGuard,
  validatePathParam("id", taskIdFormat),
  getTaskByIdHandler,
);
taskRouter.put(
  "/:id",
  authGuard,
  validatePathParam("id", taskIdFormat),
  validate(updateTaskSchema),
  updateTaskHandler,
);
taskRouter.delete(
  "/:id",
  authGuard,
  validatePathParam("id", taskIdFormat),
  deleteTaskHandler,
);

export { taskRouter };
