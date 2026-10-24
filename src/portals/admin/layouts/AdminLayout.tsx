/**
 * AdminLayout — Shell layout dành riêng cho Quản trị viên (Admin Portal)
 *
 * MUST độc lập, không import chéo từ Client hay Mentor.
 * MUST export default để lazy loading hoạt động.
 */

import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  BookOpen,
  Users,
  DollarSign,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import { useAuthStore } from "@/shared/auth";
import { Badge } from "@/shared/components/Badge";
import { ROUTES } from "@/shared/constants/routes";
import { ROLES, type Role } from "@/shared/constants/roles";

const ADMIN_NAV = [
  {
    to: "/admin",
    end: true,
    label: "Quản lý Khóa học",
    icon: BookOpen,
  },
  {
    to: ROUTES.ADMIN.EXAMS,
    end: false,
    label: "Quản lý Đề thi",
    icon: FileCheck2,
  },
  {
    to: "/admin/accounts",
    end: false,
    label: "Tài khoản & Quyền",
    icon: Users,
  },
  {
    to: "/admin/revenue",
    end: false,
    label: "Doanh thu & Đơn hàng",
    icon: DollarSign,
  },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { role, setRole } = useAuthStore();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    setRole(newRole);
    if (newRole === ROLES.MENTOR) {
      navigate(ROUTES.MENTOR.HOME);
    } else if (newRole === ROLES.USER || newRole === ROLES.STUDENT) {
      navigate(ROUTES.CLIENT.MY_COURSES);
    } else if (newRole === ROLES.GUEST) {
      navigate(ROUTES.CLIENT.HOME);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-row">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 text-white shrink-0 hidden md:flex flex-col border-r border-slate-800">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                PrepMaster
              </span>
              <span className="text-[11px] font-semibold text-rose-400 block tracking-wider uppercase">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Hệ thống quản trị
          </div>
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer / Switch Portal */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
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
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="danger" size="sm" icon={ShieldAlert}>
              Super Admin Mode
            </Badge>
            <span className="hidden sm:inline text-xs text-slate-500">
              | Trung tâm điều khiển và quản trị hệ thống
            </span>
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
                className="text-xs font-bold bg-white text-slate-800 rounded-lg px-2 py-1 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value={ROLES.GUEST}>GUEST</option>
                <option value={ROLES.USER}>STUDENT</option>
                <option value={ROLES.MENTOR}>MENTOR</option>
                <option value={ROLES.ADMIN}>ADMIN</option>
              </select>
            </div>

            {/* Profile pill */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                A
              </div>
              <span className="hidden md:inline text-xs font-bold text-slate-800">
                Admin Master
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

export default AdminLayout;
