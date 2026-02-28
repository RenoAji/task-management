import type { Request, Response } from "express";
import {
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
} from "../services/authService";

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = await registerUser(req.body);
  res.status(201).json({ message: "Registered successfully", data: result });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = await loginUser(req.body);
  res.status(200).json({ message: "Logged in successfully", data: result });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  await logoutUser(req.user!._id.toString());
  res.status(200).json({ message: "Logged out successfully" });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const result = await refreshUserToken(req.body.refreshToken);
  res
    .status(200)
    .json({ message: "Token refreshed successfully", data: result });
};
