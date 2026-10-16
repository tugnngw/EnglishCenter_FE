/**
 * useAuth hook — Wrapper selectors cho Client Portal Auth
 */

import { useAuthStore } from "@/shared/auth";
import type { Role } from "@/shared/constants/roles";

export function useAuth() {
  return useAuthStore((s) => ({
    user: s.user,
    isAuthenticated: s.isAuthenticated,
    isLoading: s.isLoading,
    error: s.error,
    role: s.role,
    userName: s.userName,
    login: s.login,
    register: s.register,
    logout: s.logout,
    mockLogin: s.mockLogin,
    setRole: s.setRole,
    clearError: s.clearError,
    reset: s.reset,
  }));
}

export function useRole(): Role {
  return useAuthStore((s) => s.role);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((s) => s.isAuthenticated);
}
