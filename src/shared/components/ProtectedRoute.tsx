/**
 * ProtectedRoute — Guard FE chỉ để cải thiện trải nghiệm.
 * MUST Backend kiểm tra role ở mỗi API.
 *
 * 3 nhánh: chưa đăng nhập → /login, sai role → /, đúng role → Outlet.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/shared/auth";
import type { Role } from "@/shared/constants/roles";
import { ROUTES } from "@/shared/constants/routes";
import { Loading } from "./Loading";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <Loading />;
  if (!isAuthenticated || !user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={ROUTES.HOME} replace />;

  return <Outlet />;
}
