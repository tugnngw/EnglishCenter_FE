import type { ApiResponse } from "./api";
import type { Role } from "@/shared/constants/roles";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type TargetExam = "IELTS" | "TOEIC";

export type CurrentLevel =
  | "BEGINNER"
  | "ELEMENTARY"
  | "INTERMEDIATE"
  | "UPPER_INTERMEDIATE"
  | "ADVANCED";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  targetExam: TargetExam;
  currentLevel: CurrentLevel;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn?: number;
}

export type AuthResponse = ApiResponse<AuthData>;
export type MeResponse = ApiResponse<AuthUser>;
export type RefreshTokenResponse = ApiResponse<{ accessToken: string; expiresIn: number }>;
