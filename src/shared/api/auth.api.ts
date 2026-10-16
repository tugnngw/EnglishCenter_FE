/**
 * Auth API — gọi Backend qua axiosClient (shared/api).
 * MUST mọi request đi qua axiosClient.
 */

import { axiosClient } from "./axiosClient";
import type {
  ApiResponse,
  AuthData,
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/shared/types";
import { successResponse, errorResponse } from "@/shared/types";
import type { Role } from "@/shared/constants/roles";

interface TokenResponseBE {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn: number;
}

interface UserResponseBE {
  userId: number;
  email: string;
  fullName: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  roles: string[];
}

function toAuthUser(u: UserResponseBE): AuthUser {
  const role = (u.roles?.[0]?.toUpperCase() as Role) ?? "STUDENT";
  return {
    id: String(u.userId),
    fullName: u.fullName,
    email: u.email,
    role,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      u.email,
    )}`,
  };
}

export async function loginApi(payload: LoginRequest): Promise<AuthResponse> {
  try {
    const res = await axiosClient.post<{ code?: number; message?: string; result?: TokenResponseBE }>(
      "/v1/auth/login",
      { email: payload.email, password: payload.password },
    );

    const token = res.data.result;
    if (!token) {
      return errorResponse(res.data.message || "Đăng nhập thất bại");
    }

    // Lấy thông tin user
    const meRes = await axiosClient.get<{ code?: number; message?: string; result?: UserResponseBE }>(
      "/v1/users/me",
      { headers: { Authorization: `Bearer ${token.accessToken}` } },
    );

    const userBE = meRes.data.result;
    if (!userBE) {
      return errorResponse("Không lấy được thông tin người dùng");
    }

    const user = toAuthUser(userBE);
    const authData: AuthData = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      user,
      expiresIn: token.expiresIn,
    };

    return successResponse(authData, "Đăng nhập thành công");
  } catch (err: unknown) {
    const message = err && typeof err === "object" && "message" in err
      ? String((err as { message: unknown }).message)
      : "Đăng nhập thất bại";
    return errorResponse(message);
  }
}

export async function registerApi(payload: RegisterRequest): Promise<AuthResponse> {
  try {
    const regRes = await axiosClient.post<{ code?: number; message?: string; result?: UserResponseBE }>(
      "/v1/auth/register",
      {
        email: payload.email,
        password: payload.password,
        fullName: payload.fullName,
      },
    );

    if (!regRes.data.result) {
      return errorResponse(regRes.data.message || "Đăng ký thất bại");
    }

    return loginApi({ email: payload.email, password: payload.password });
  } catch (err: unknown) {
    const message = err && typeof err === "object" && "message" in err
      ? String((err as { message: unknown }).message)
      : "Đăng ký thất bại";
    return errorResponse(message);
  }
}

export async function logoutApi(): Promise<ApiResponse<null>> {
  try {
    await axiosClient.post("/v1/auth/logout");
  } catch {
    /* ignore */
  }
  return successResponse(null, "Đăng xuất thành công");
}

export async function getMyProfileApi(accessToken: string): Promise<ApiResponse<AuthUser>> {
  try {
    const res = await axiosClient.get<{ code?: number; message?: string; result?: UserResponseBE }>(
      "/v1/users/me",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!res.data.result) {
      return errorResponse(res.data.message || "Không lấy được profile");
    }
    return successResponse(toAuthUser(res.data.result), "Lấy profile thành công");
  } catch (err: unknown) {
    const message = err && typeof err === "object" && "message" in err
      ? String((err as { message: unknown }).message)
      : "Lỗi kết nối";
    return errorResponse(message);
  }
}

/* Mock Demo Login */
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const randomToken = (role: string) =>
  `mock.${role}.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;

export async function mockDemoApi(role: Role): Promise<AuthResponse> {
  await delay(200);
  const profile = {
    GUEST: { fullName: "Khách vãng lai", email: "guest@prepmaster.ai" },
    STUDENT: { fullName: "Nguyễn Văn A (Demo)", email: "student@prepmaster.ai" },
    USER: { fullName: "Nguyễn Văn A (Demo)", email: "student@prepmaster.ai" },
    MENTOR: { fullName: "Mentor David (Demo)", email: "mentor@prepmaster.ai" },
    ADMIN: { fullName: "Admin Master (Demo)", email: "admin@prepmaster.ai" },
  }[role];

  const user: AuthUser = {
    id: `usr_${role.toLowerCase()}`,
    fullName: profile.fullName,
    email: profile.email,
    role,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role.toLowerCase()}`,
  };

  const data: AuthData = {
    accessToken: randomToken(role.toLowerCase()),
    refreshToken: randomToken(role.toLowerCase()),
    user,
    expiresIn: 3600,
  };

  return successResponse(data, `Đăng nhập nhanh (${role})`);
}
