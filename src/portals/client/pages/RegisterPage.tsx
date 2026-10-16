/**
 * RegisterPage — Trang đăng ký học viên Client Portal
 */

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { RegisterForm } from "../features/auth";
import { useAuthStore } from "@/shared/stores";
import { ROUTES } from "@/shared/constants/routes";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 sm:px-10 py-5 flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Về trang chủ
        </Link>
        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">Đã có tài khoản?</span>
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-10 flex items-start sm:items-center justify-center">
        <div className="w-full">
          <RegisterForm onSuccessRedirect={() => ROUTES.MY_LEARNING} />
        </div>
      </main>

      <footer className="py-5 px-6 text-center text-xs text-slate-400 border-t border-slate-200/70 bg-white/40">
        © 2026 PrepMaster AI Platform. Hệ thống đào tạo & Khảo thí chuẩn hoá.
      </footer>
    </div>
  );
};

export default RegisterPage;
