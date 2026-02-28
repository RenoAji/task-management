import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "./errorHandler";

export const authGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Unauthorized", "UNAUTHORIZED"));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("_id email fullName");

    if (!user) {
      next(new ApiError(401, "Unauthorized", "UNAUTHORIZED"));
      return;
    }

    req.user = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token", "INVALID_TOKEN"));
  }
};
