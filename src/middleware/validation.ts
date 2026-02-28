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

export const validatePathParam =
  (paramName: string, schema: ZodSchema<any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const param = req.params[paramName];

    if (!param) {
      next(new ApiError(400, `${paramName} is required`, "MISSING_PARAMETER"));
      return;
    }

    const result = schema.safeParse(param);

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

    (req.params as any)[paramName] = result.data;
    next();
  };
