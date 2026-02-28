import bcrypt from "bcrypt";
import { User, type IUser } from "../models/User";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { ApiError } from "../middleware/errorHandler";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

const buildAuthResponse = (user: IUser, refreshToken: string): AuthResponse => {
  const payload = { sub: user._id.toString(), email: user.email };
  const accessToken = signAccessToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    },
  };
};

export const registerUser = async (input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> => {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "Email already registered", "EMAIL_ALREADY_EXISTS");
  }

  const password = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    email: input.email.toLowerCase(),
    password,
    fullName: input.fullName,
  });

  const refreshToken = signRefreshToken({
    sub: user._id.toString(),
    email: user.email,
  });
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return buildAuthResponse(user, refreshToken);
};

export const loginUser = async (input: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const user = await User.findOne({ email: input.email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const validPassword = await bcrypt.compare(input.password, user.password);
  if (!validPassword) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const refreshToken = signRefreshToken({
    sub: user._id.toString(),
    email: user.email,
  });

  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return buildAuthResponse(user, refreshToken);
};

export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};

export const refreshUserToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  const payload = verifyRefreshToken(refreshToken);

  const user = await User.findById(payload.sub);
  if (!user || !user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
  }

  const isTokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isTokenMatch) {
    throw new ApiError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
  }

  const newRefreshToken = signRefreshToken({
    sub: user._id.toString(),
    email: user.email,
  });

  user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
  await user.save();

  return buildAuthResponse(user, newRefreshToken);
};
