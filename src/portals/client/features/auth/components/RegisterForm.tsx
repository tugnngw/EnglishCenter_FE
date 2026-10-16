/**
 * RegisterForm — Form đăng ký học viên mới
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Target,
  TrendingUp,
  UserPlus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/shared/auth";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/utils/cn";

interface RegisterFormProps {
  onSuccessRedirect?: () => string;
}

type TargetExam = "IELTS" | "TOEIC";
type CurrentLevel =
  | "BEGINNER"
  | "ELEMENTARY"
  | "INTERMEDIATE"
  | "UPPER_INTERMEDIATE"
  | "ADVANCED";

const TARGET_EXAMS: { value: TargetExam; label: string; desc: string }[] = [
  { value: "IELTS", label: "IELTS", desc: "Academic / General" },
  { value: "TOEIC", label: "TOEIC", desc: "Listening & Reading" },
];

const CURRENT_LEVELS: { value: CurrentLevel; label: string; desc: string }[] = [
  { value: "BEGINNER", label: "Beginner", desc: "Mất gốc, chưa nền tảng" },
  { value: "ELEMENTARY", label: "Elementary", desc: "Giao tiếp cơ bản" },
  { value: "INTERMEDIATE", label: "Intermediate", desc: "Đủ dùng trong công việc" },
  { value: "UPPER_INTERMEDIATE", label: "Upper-Int.", desc: "Tự tin thuyết trình" },
  { value: "ADVANCED", label: "Advanced", desc: "Chuẩn bị đi thi" },
];

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccessRedirect = () => ROUTES.MY_LEARNING,
}) => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    targetExam: "IELTS" as TargetExam,
    currentLevel: "INTERMEDIATE" as CurrentLevel,
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Vui lòng nhập họ tên";
    else if (form.fullName.trim().length < 2)
      next.fullName = "Họ tên quá ngắn";

    if (!form.email.trim()) next.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Email không đúng định dạng";

    if (!form.password) next.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 6)
      next.password = "Mật khẩu tối thiểu 6 ký tự";

    if (!form.confirmPassword) next.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (form.confirmPassword !== form.password)
      next.confirmPassword = "Mật khẩu xác nhận không khớp";

    if (!form.agree) next.agree = "Bạn cần đồng ý điều khoản để tiếp tục";

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    clearError();
    if (!validate()) return;

    try {
      const user = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        targetExam: form.targetExam,
        currentLevel: form.currentLevel,
      });
      setNotice(`Chào mừng ${user.fullName} đến với PrepMaster AI!`);
      setTimeout(() => {
        navigate(onSuccessRedirect(), { replace: true });
      }, 500);
    } catch {
      /* store error */
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/70">
      <div className="relative px-8 sm:px-12 pt-10 pb-7 bg-navy-900 text-white overflow-hidden">
        <div className="absolute -top-24 -right-16 w-72 h-72 bg-primary/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-ai/25 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-ai" />
            </div>
            <span className="font-extrabold tracking-tight">
              PrepMaster <span className="text-ai">AI</span>
            </span>
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-slate-200">
            <UserPlus className="w-3.5 h-3.5" /> Tạo tài khoản học viên
          </span>
        </div>

        <div className="relative z-10 mt-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bắt đầu hành trình mới
          </h1>
          <p className="mt-1.5 text-slate-300 text-sm max-w-xl">
            Tạo tài khoản để nhận lộ trình học cá nhân hoá, đăng ký lớp Mentor
            1–1 và tham gia ngân hàng đề thi chuẩn hoá.
          </p>
        </div>
      </div>

      <div className="px-8 sm:px-12 py-10">
        {notice && (
          <div className="mb-5 flex items-start gap-2 p-3 rounded-xl bg-status-success-bg border border-emerald-200 text-status-success text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-start gap-2 p-3 rounded-xl bg-status-danger-bg border border-red-200 text-status-danger text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              id="fullName"
              label="Họ và tên"
              icon={User}
              value={form.fullName}
              onChange={(v) => {
                set("fullName", v);
                if (fieldErrors.fullName)
                  setFieldErrors((p) => ({ ...p, fullName: "" }));
              }}
              placeholder="Nguyễn Văn A"
              error={fieldErrors.fullName}
              autoComplete="name"
            />
            <Field
              id="email"
              label="Email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={(v) => {
                set("email", v);
                if (fieldErrors.email)
                  setFieldErrors((p) => ({ ...p, email: "" }));
              }}
              placeholder="you@prepmaster.ai"
              error={fieldErrors.email}
              autoComplete="email"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PasswordField
              id="password"
              label="Mật khẩu"
              value={form.password}
              onChange={(v) => {
                set("password", v);
                if (fieldErrors.password)
                  setFieldErrors((p) => ({ ...p, password: "" }));
              }}
              placeholder="Tối thiểu 6 ký tự"
              error={fieldErrors.password}
              show={showPassword}
              onToggle={() => setShowPassword((s) => !s)}
              autoComplete="new-password"
            />
            <PasswordField
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={(v) => {
                set("confirmPassword", v);
                if (fieldErrors.confirmPassword)
                  setFieldErrors((p) => ({ ...p, confirmPassword: "" }));
              }}
              placeholder="Nhập lại mật khẩu"
              error={fieldErrors.confirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm((s) => !s)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-primary" />
              Mục tiêu điểm
            </p>
            <div className="grid grid-cols-2 gap-3">
              {TARGET_EXAMS.map((opt) => {
                const active = form.targetExam === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("targetExam", opt.value)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all",
                      active
                        ? "border-primary bg-primary-tint/30 ring-2 ring-primary/15"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition",
                        active
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {opt.label === "IELTS" ? "I" : "T"}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-bold text-sm",
                          active ? "text-primary" : "text-slate-800",
                        )}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </div>
                    {active && (
                      <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              Trình độ hiện tại
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {CURRENT_LEVELS.map((opt) => {
                const active = form.currentLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("currentLevel", opt.value)}
                    className={cn(
                      "flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all",
                      active
                        ? "border-primary bg-primary-tint/30 ring-2 ring-primary/15"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    )}
                  >
                    <p
                      className={cn(
                        "font-bold text-xs uppercase tracking-wide",
                        active ? "text-primary" : "text-slate-800",
                      )}
                    >
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer select-none text-sm">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => {
                set("agree", e.target.checked);
                if (fieldErrors.agree)
                  setFieldErrors((p) => ({ ...p, agree: "" }));
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-slate-600 leading-relaxed">
              Tôi đã đọc và đồng ý với{" "}
              <span className="font-semibold text-primary hover:underline">
                Điều khoản dịch vụ
              </span>{" "}
              &{" "}
              <span className="font-semibold text-primary hover:underline">
                Chính sách bảo mật
              </span>{" "}
              của PrepMaster AI.
            </span>
          </label>
          {fieldErrors.agree && (
            <p className="text-xs text-status-danger font-medium -mt-4">
              {fieldErrors.agree}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all",
              "bg-primary hover:bg-primary-hover shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Đang tạo tài khoản...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Tạo tài khoản
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-500">
            Đã có tài khoản?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-bold text-primary hover:text-primary-hover hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

interface FieldProps {
  id: string;
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  autoComplete?: string;
}

const Field: React.FC<FieldProps> = ({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoComplete,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-slate-700 mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 transition-all",
          "focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : "border-slate-200 focus:border-primary",
        )}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-status-danger font-medium">{error}</p>
    )}
  </div>
);

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  show,
  onToggle,
  autoComplete,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-slate-700 mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full pl-10 pr-12 py-3 bg-slate-50 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 transition-all",
          "focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : "border-slate-200 focus:border-primary",
        )}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-status-danger font-medium">{error}</p>
    )}
  </div>
);

export default RegisterForm;
