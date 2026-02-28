import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "./errorHandler";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      next(
        new ApiError(
          400,
          `Validation failed: ${details.map((d) => `${d.path} ${d.message}`).join(", ")}`,
          "VALIDATION_ERROR",
        ),
      );
      return;
    }

    req.body = result.data;
    next();
  };
