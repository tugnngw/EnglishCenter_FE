/**
 * ClientHeader — Topbar cho Client Portal
 */

import React, { useState } from "react";
import {
  Search,
  Bell,
  Sparkles,
  X,
  Headphones,
  Calendar,
  Award,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Badge } from "@/shared/components/Badge";
import type { Role } from "@/shared/constants/roles";

export interface ClientHeaderProps {
  pageTitle?: string;
  role?: Role;
  userName?: string;
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: React.ElementType;
  tone: "primary" | "ai" | "warning" | "success";
  unread?: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "AI chấm bài Speaking xong",
    desc: "Lộ trình IELTS Speaking 7.0 đã có kết quả",
    time: "Vừa xong",
    icon: Sparkles,
    tone: "ai",
    unread: true,
  },
  {
    id: "2",
    title: "Lịch Mentor 1-1 sắp diễn ra",
    desc: "Buổi học với Mentor David lúc 20:00",
    time: "Trong 1 giờ",
    icon: Calendar,
    tone: "primary",
  },
  {
    id: "3",
    title: "Đề thi TOEIC tháng 10 đã mở",
    desc: "Bạn có 7 ngày để hoàn thành",
    time: "2 giờ trước",
    icon: Award,
    tone: "primary",
  },
  {
    id: "4",
    title: "Hệ thống bảo trì 02:00 - 03:00",
    desc: "Một số tính năng sẽ tạm gián đoạn",
    time: "Hôm qua",
    icon: AlertCircle,
    tone: "warning",
  },
];

const CERTS = [
  { key: "ielts", label: "IELTS", tone: "ielts" as const },
  { key: "toeic", label: "TOEIC", tone: "toeic" as const },
  { key: "vstep", label: "VSTEP", tone: "vstep" as const },
];

const NOTIFICATION_TONE_CLASS: Record<Notification["tone"], string> = {
  primary: "bg-primary/10 text-primary",
  ai: "bg-ai/10 text-ai",
  warning: "bg-status-warning-bg text-status-warning",
  success: "bg-status-success-bg text-status-success",
};

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  pageTitle,
  role,
  userName,
  className,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header
      className={cn(
        "sticky top-0 z-20 h-16",
        "bg-white/90 backdrop-blur-md border-b border-slate-200",
        "px-4 lg:px-6 flex items-center gap-3",
        className,
      )}
    >
      {/* Search */}
      <div className="flex-1 max-w-xl">
        {pageTitle && (
          <p className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
            {pageTitle}
          </p>
        )}
        <div className="relative">
          <Search
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Tìm khóa học IELTS, đề TOEIC, từ vựng VSTEP..."
            className={cn(
              "w-full h-10 pl-10 pr-4 rounded-input text-sm",
              "bg-slate-100/80 hover:bg-slate-100",
              "border border-transparent focus:border-primary focus:bg-white",
              "focus:outline-none focus:ring-4 focus:ring-primary/10",
              "placeholder:text-slate-400 text-slate-700 transition-all",
            )}
            aria-label="Tìm kiếm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              aria-label="Xoá nội dung tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Certificate Pills */}
      <div
        className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-input bg-slate-50 border border-slate-200/70"
        aria-label="Chứng chỉ hỗ trợ"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1.5 pr-1">
          Cert
        </span>
        {CERTS.map((c) => (
          <Badge
            key={c.key}
            variant={c.tone}
            size="sm"
            className="font-extrabold tracking-wider cursor-pointer hover:scale-105 transition-transform"
          >
            {c.label}
          </Badge>
        ))}
      </div>

      {/* User Info */}
      {role && userName && (
        <div
          className={cn(
            "hidden lg:flex items-center gap-2 px-2 py-1 rounded-input bg-slate-50 border border-slate-200/70",
            "text-xs font-medium text-slate-600",
          )}
        >
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mr-1 text-white",
              role === "GUEST" && "bg-slate-400 text-white",
              (role === "STUDENT" || role === "USER") && "bg-blue-600",
              role === "MENTOR" && "bg-violet-600",
              role === "ADMIN" && "bg-slate-900",
            )}
          >
            {role.charAt(0)}
          </div>
          <span>{userName}</span>
        </div>
      )}

      <div className="hidden md:block h-6 w-px bg-slate-200" aria-hidden="true" />

      {/* Bell + Notifications */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setNotifOpen((o) => !o)}
          className={cn(
            "relative p-2.5 rounded-input text-slate-500",
            "hover:text-slate-900 hover:bg-slate-100 transition-colors",
          )}
          aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ""}`}
          aria-haspopup="menu"
          aria-expanded={notifOpen}
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1",
                "rounded-full bg-status-danger text-white text-[9px] font-extrabold",
                "flex items-center justify-center ring-2 ring-white",
              )}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setNotifOpen(false)}
              aria-hidden="true"
            />
            <div
              role="menu"
              className={cn(
                "absolute right-0 top-12 w-[360px] z-40",
                "bg-white rounded-card border border-slate-200 shadow-elevation",
                "overflow-hidden",
              )}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Thông báo</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {unreadCount > 0
                      ? `${unreadCount} thông báo chưa đọc`
                      : "Bạn đã đọc hết thông báo"}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  Đánh dấu đã đọc
                </button>
              </div>
              <ul className="max-h-[420px] overflow-y-auto divide-y divide-slate-100">
                {NOTIFICATIONS.map((n) => {
                  const Icon = n.icon;
                  return (
                    <li
                      key={n.id}
                      className={cn(
                        "px-4 py-3 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors",
                        n.unread && "bg-primary-tint/40",
                      )}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-input flex items-center justify-center shrink-0",
                          NOTIFICATION_TONE_CLASS[n.tone],
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[13px] text-slate-900 truncate">
                            {n.title}
                          </p>
                          {n.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {n.desc}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                          {n.time}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        className={cn(
          "hidden md:inline-flex items-center gap-1.5 h-10 px-3 rounded-input",
          "text-xs font-bold text-slate-600 hover:text-slate-900",
          "hover:bg-slate-100 transition-colors",
        )}
        title="Hỗ trợ"
      >
        <Headphones className="w-3.5 h-3.5" />
        Hỗ trợ
      </button>
    </header>
  );
};

export default ClientHeader;
