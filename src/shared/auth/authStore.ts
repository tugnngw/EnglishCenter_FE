/**
 * Auth Store (Zustand) — quản lý trạng thái xác thực toàn cục.
 *
 * MUST lưu dữ liệu phiên xác thực ở đây.
 * MUST role dùng hằng ROLES.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, LoginRequest, RegisterRequest } from "@/shared/types";
import type { Role } from "@/shared/constants/roles";
import {
  loginApi,
  registerApi,
  logoutApi,
  getMyProfileApi,
  mockDemoApi,
} from "@/shared/api/auth.api";

export const ROLE_MOCK_PROFILE: Record<
  Role,
  { fullName: string; email: string; avatarColor: string }
> = {
  GUEST: { fullName: "Khách vãng lai", email: "guest@prepmaster.ai", avatarColor: "#94A3B8" },
  USER: { fullName: "Học viên Nguyễn Văn A", email: "student@prepmaster.ai", avatarColor: "#2563EB" },
  STUDENT: { fullName: "Học viên Nguyễn Văn A", email: "student@prepmaster.ai", avatarColor: "#2563EB" },
  MENTOR: { fullName: "Mentor David", email: "mentor@prepmaster.ai", avatarColor: "#7C3AED" },
  ADMIN: { fullName: "Admin Master", email: "admin@prepmaster.ai", avatarColor: "#0F172A" },
};

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: Role;
  userName: string;

  login: (payload: LoginRequest) => Promise<AuthUser>;
  register: (payload: RegisterRequest) => Promise<AuthUser>;
  mockLogin: (role: Role) => Promise<AuthUser>;
  fetchMyProfile: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  setRole: (role: Role) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  user: null as AuthUser | null,
  accessToken: null as string | null,
  refreshToken: null as string | null,
  isAuthenticated: false,
  isLoading: false,
  error: null as string | null,
  role: "GUEST" as Role,
  userName: ROLE_MOCK_PROFILE.GUEST.fullName,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      clearError: () => set({ error: null }),
      reset: () => {
        localStorage.removeItem("access_token");
        set({ ...initialState });
      },

      setRole: (role: Role) => {
        const profile = ROLE_MOCK_PROFILE[role];
        const isGuest = role === "GUEST";
        set({
          role,
          userName: profile.fullName,
          isAuthenticated: !isGuest,
          user: isGuest
            ? null
            : {
                id: `mock-${role.toLowerCase()}`,
                fullName: profile.fullName,
                email: profile.email,
                role,
              },
        });
      },

      login: async (payload: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const res = await loginApi(payload);
          if (!res.success || !res.data) {
            set({ isLoading: false, error: res.message });
            throw new Error(res.message);
          }
          const { user, accessToken, refreshToken } = res.data;
          localStorage.setItem("access_token", accessToken);
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            role: user.role,
            userName: user.fullName,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (err) {
          const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      register: async (payload: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const res = await registerApi(payload);
          if (!res.success || !res.data) {
            set({ isLoading: false, error: res.message });
            throw new Error(res.message);
          }
          const { user, accessToken, refreshToken } = res.data;
          localStorage.setItem("access_token", accessToken);
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            role: user.role,
            userName: user.fullName,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (err) {
          const message = err instanceof Error ? err.message : "Đăng ký thất bại";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      mockLogin: async (role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const res = await mockDemoApi(role);
          const { user, accessToken, refreshToken } = res.data;
          localStorage.setItem("access_token", accessToken);
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            role,
            userName: user.fullName,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (err) {
          const message = err instanceof Error ? err.message : "Đăng nhập nhanh thất bại";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      fetchMyProfile: async () => {
        const token = get().accessToken;
        if (!token) return null;
        const res = await getMyProfileApi(token);
        if (!res.success || !res.data) return null;
        set({
          user: res.data,
          role: res.data.role,
          userName: res.data.fullName,
        });
        return res.data;
      },

      logout: async () => {
        try {
          await logoutApi();
        } catch {
          /* ignore */
        }
        localStorage.removeItem("access_token");
        set({ ...initialState });
      },
    }),
    {
      name: "prepmaster-ai-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        userName: state.userName,
      }),
    },
  ),
);

export const selectUser = (s: AuthState) => s.user;
export const selectRole = (s: AuthState): Role => s.role;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectUserName = (s: AuthState) => s.userName;
