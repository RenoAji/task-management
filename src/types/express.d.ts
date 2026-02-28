import type { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUser, "_id" | "email" | "fullName">;
    }
  }
}

export {};
