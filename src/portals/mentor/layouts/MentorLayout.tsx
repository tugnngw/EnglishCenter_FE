/**
 * MentorLayout — Shell layout dành riêng cho Mentor Portal
 *
 * MUST độc lập, không import chéo từ Client hay Admin.
 * MUST export default để lazy loading hoạt động.
 */

import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  FileEdit,
  Calendar,
  LogOut,
  ExternalLink,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useAuthStore } from "@/shared/auth";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { ROUTES } from "@/shared/constants/routes";
import { ROLES, type Role } from "@/shared/constants/roles";

const NAV_ITEMS = [
  {
    to: "/mentor",
    end: true,
    label: "Tổng quan Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/mentor/grading",
    end: false,
    label: "Chấm bài & Feedback",
    icon: FileEdit,
    badge: "3 bài",
  },
];

export const MentorLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, setRole, logout } = useAuthStore();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    setRole(newRole);
    if (newRole === ROLES.ADMIN) {
      navigate(ROUTES.ADMIN.HOME);
    } else if (newRole === ROLES.USER || newRole === ROLES.STUDENT) {
      navigate(ROUTES.CLIENT.MY_COURSES);
    } else if (newRole === ROLES.GUEST) {
      navigate(ROUTES.CLIENT.HOME);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row">
      {/* Mentor Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col border-r border-slate-800">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                PrepMaster
              </span>
              <span className="text-[11px] font-semibold text-purple-400 block tracking-wider uppercase">
                Mentor Space
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Khu vực làm việc
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer / Switch Portal */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Xem trang Học viên
            </span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="ai" size="sm" icon={Sparkles}>
                Mentor Portal
              </Badge>
              <span className="hidden sm:inline text-xs text-slate-500">
                | Không gian nghiệp vụ Giảng viên & Chấm bài
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher for Evaluation */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider pl-1.5">
                Role:
              </span>
              <select
                value={role}
                onChange={handleRoleChange}
                className="text-xs font-bold bg-white text-slate-800 rounded-lg px-2 py-1 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                <option value={ROLES.GUEST}>GUEST</option>
                <option value={ROLES.USER}>STUDENT</option>
                <option value={ROLES.MENTOR}>MENTOR</option>
                <option value={ROLES.ADMIN}>ADMIN</option>
              </select>
            </div>

            {/* Profile pill */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                M
              </div>
              <span className="hidden md:inline text-xs font-bold text-slate-800">
                Mentor David
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MentorLayout;
