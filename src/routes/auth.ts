import { Router } from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/authController";
import { authGuard } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../validators/authValidator";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", authGuard, logout);
authRouter.post("/refresh", validate(refreshTokenSchema), refresh);

export { authRouter };
