/**
 * LoginPage — Trang đăng nhập Client Portal
 */

import React, { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { LogIn, UserCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { LoginForm } from "../features/auth";
import { useAuthStore } from "@/shared/stores";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { ROUTES } from "@/shared/constants/routes";
import type { UserRole } from "@/shared/types";

const redirectAfterLogin = (role: UserRole): string => {
  if (role === "STUDENT") return ROUTES.COURSE_DETAIL("ielts-intensive-mastery");
  if (role === "ADMIN") return ROUTES.ADMIN_HOME;
  if (role === "MENTOR") return ROUTES.MENTOR_HOME;
  return ROUTES.HOME;
};

const ROLE_LABEL: Record<UserRole, string> = {
  GUEST: "Khách",
  STUDENT: "Học viên",
  MENTOR: "Mentor",
  ADMIN: "Quản trị viên",
};

const ROLE_BADGE: Record<UserRole, "primary" | "ai" | "warning" | "neutral"> = {
  GUEST: "neutral",
  STUDENT: "primary",
  MENTOR: "ai",
  ADMIN: "warning",
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated, user, role, logout, userName } = useAuthStore();

  useEffect(() => {
    if (params.get("reauth") === "1" && isAuthenticated) {
      navigate(redirectAfterLogin(role), { replace: true });
    }
  }, [params, isAuthenticated, role, navigate]);

  if (isAuthenticated && user && params.get("reauth") !== "1") {
    const target = redirectAfterLogin(role);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto text-white shadow-md">
            <UserCircle2 className="w-8 h-8 text-white" />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Phiên đang hoạt động
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1.5">
              Xin chào, {userName}!
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2.5">
              <Badge variant={ROLE_BADGE[role]} size="md">
                {role}
              </Badge>
              <span className="text-xs text-slate-500">
                · {ROLE_LABEL[role]}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Bạn đang đăng nhập với tài khoản <b>{user.email}</b>. Có thể tiếp tục
            vào trang của bạn hoặc chuyển sang tài khoản khác để demo.
          </p>

          <div className="space-y-2.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={ArrowRight}
              onClick={() => navigate(target, { replace: true })}
            >
              Vào trang của tôi
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={RotateCcw}
              onClick={async () => {
                await logout();
                navigate("/login?reauth=1", { replace: true });
                window.location.reload();
              }}
            >
              Đăng nhập tài khoản khác
            </Button>
          </div>

          <Link
            to="/login?reauth=1"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-600"
            onClick={async (e) => {
              e.preventDefault();
              await logout();
              navigate("/login?reauth=1", { replace: true });
              window.location.reload();
            }}
          >
            <LogIn className="w-3 h-3" />
            Bỏ qua và đăng nhập lại từ đầu
          </Link>
        </div>
      </div>
    );
  }

  return <LoginForm />;
};

export default LoginPage;
