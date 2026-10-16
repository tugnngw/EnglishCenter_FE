/**
 * AccountManagementView — Quản lý tài khoản & Phân quyền thành viên (Student / Mentor / Admin)
 */

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  Sparkles,
  Lock,
  Unlock,
} from "lucide-react";
import { Card } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { ROLES, type Role } from "@/shared/constants/roles";

interface AccountItem {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "LOCKED";
  enrolledCoursesCount: number;
  lastLogin: string;
}

const MOCK_ACCOUNTS: AccountItem[] = [
  {
    id: "usr-01",
    fullName: "Nguyễn Văn A",
    email: "student@prepmaster.ai",
    role: ROLES.STUDENT,
    status: "ACTIVE",
    enrolledCoursesCount: 2,
    lastLogin: "Vừa xong",
  },
  {
    id: "usr-02",
    fullName: "David Nguyen",
    email: "mentor@prepmaster.ai",
    role: ROLES.MENTOR,
    status: "ACTIVE",
    enrolledCoursesCount: 0,
    lastLogin: "25 phút trước",
  },
  {
    id: "usr-03",
    fullName: "Admin Master",
    email: "admin@prepmaster.ai",
    role: ROLES.ADMIN,
    status: "ACTIVE",
    enrolledCoursesCount: 0,
    lastLogin: "10 phút trước",
  },
  {
    id: "usr-04",
    fullName: "Trần Bảo Nam",
    email: "baonam.tran@gmail.com",
    role: ROLES.STUDENT,
    status: "ACTIVE",
    enrolledCoursesCount: 1,
    lastLogin: "2 giờ trước",
  },
  {
    id: "usr-05",
    fullName: "Lê Hoàng Yến",
    email: "hoangyen.le@gmail.com",
    role: ROLES.STUDENT,
    status: "LOCKED",
    enrolledCoursesCount: 3,
    lastLogin: "3 ngày trước",
  },
];

export const AccountManagementView: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountItem[]>(MOCK_ACCOUNTS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const handleToggleLock = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? { ...acc, status: acc.status === "ACTIVE" ? "LOCKED" : "ACTIVE" }
          : acc
      )
    );
  };

  const handleChangeRole = (id: string, newRole: Role) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, role: newRole } : acc))
    );
  };

  const filtered = accounts.filter((acc) => {
    if (roleFilter !== "ALL" && acc.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        acc.fullName.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" />
          Quản lý Tài khoản & Phân quyền
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kiểm soát danh sách người dùng, gán quyền Mentor/Admin và bảo vệ tài khoản
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value={ROLES.STUDENT}>STUDENT (Học viên)</option>
              <option value={ROLES.MENTOR}>MENTOR (Giảng viên)</option>
              <option value={ROLES.ADMIN}>ADMIN (Quản trị viên)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Accounts Table */}
      <Card className="overflow-hidden p-0 border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Thành viên</th>
                <th className="py-3.5 px-4">Vai trò (Role)</th>
                <th className="py-3.5 px-4">Khóa học</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Đăng nhập gần nhất</th>
                <th className="py-3.5 px-4 text-right">Phân quyền & Khóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{acc.fullName}</p>
                    <p className="text-xs text-slate-500">{acc.email}</p>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={acc.role}
                      onChange={(e) =>
                        handleChangeRole(acc.id, e.target.value as Role)
                      }
                      className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value={ROLES.USER}>STUDENT</option>
                      <option value={ROLES.STUDENT}>STUDENT</option>
                      <option value={ROLES.MENTOR}>MENTOR</option>
                      <option value={ROLES.ADMIN}>ADMIN</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-semibold">
                    {acc.enrolledCoursesCount > 0 ? (
                      <span className="text-xs text-primary font-bold">
                        {acc.enrolledCoursesCount} khóa
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={acc.status === "ACTIVE" ? "success" : "danger"}
                      size="sm"
                    >
                      {acc.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500">
                    {acc.lastLogin}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant={acc.status === "ACTIVE" ? "outline" : "primary"}
                      size="sm"
                      leftIcon={acc.status === "ACTIVE" ? Lock : Unlock}
                      onClick={() => handleToggleLock(acc.id)}
                      className="text-xs h-8 px-2.5"
                    >
                      {acc.status === "ACTIVE" ? "Khóa" : "Mở khóa"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AccountManagementView;
